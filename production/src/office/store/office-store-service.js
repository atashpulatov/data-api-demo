import { officeProperties } from './office-properties';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { errorService } from '../../error/error-handler';
import { restoreAllObjects, deleteObject } from '../../operation/object-actions';

/* global Office */

// TODO check after integration of new right panel
class OfficeStoreService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  // preserveObject = async (object) => {
  //   try {
  //     const settings = this.getOfficeSettings();
  //     const reportProperties = this.getObjectProperties();
  //     reportProperties.unshift({
  //       id: object.id,
  //       name: object.name,
  //       bindId: object.bindId,
  //       projectId: object.projectId,
  //       envUrl: object.envUrl,
  //       body: object.body,
  //       objectType: object.objectType,
  //       isCrosstab: object.isCrosstab,
  //       isPrompted: object.isPrompted,
  //       subtotalsInfo: object.subtotalsInfo,
  //       promptsAnswers: object.promptsAnswers,
  //       crosstabHeaderDimensions: object.crosstabHeaderDimensions,
  //       visualizationInfo: object.visualizationInfo,
  //       manipulationsXML: object.manipulationsXML,
  //       tableName: object.tableName,
  //       tableDimensions: object.tableDimensions,
  //       displayAttrFormNames: object.displayAttrFormNames,
  //       refreshDate: object.refreshDate,
  //       objectWorkingId: object.objectWorkingId,
  //     });
  //     settings.set(officeProperties.loadedReportProperties, reportProperties);
  //     settings.saveAsync();
  //   } catch (error) {
  //     errorService.handleError(error);
  //   }
  // }

  // preserveObjectValue = async (bindId, key, value) => {
  //   try {
  //     const settings = this.getOfficeSettings();
  //     const reportProperties = this.getObjectProperties();
  //     const indexOfReport = reportProperties.findIndex((oldReport) => (oldReport.bindId === bindId));
  //     reportProperties[indexOfReport][key] = value;
  //     settings.set(officeProperties.loadedReportProperties, reportProperties);
  //     await settings.saveAsync();
  //     await this.loadExistingReportBindingsExcel();
  //   } catch (error) {
  //     errorService.handleError(error);
  //   }
  // }

  deleteObject = (bindId, objectWorkingId) => {
    try {
      const settings = this.getOfficeSettings();
      if (objectWorkingId) {
        const storedObjects = settings.get(officeProperties.storedObjects);
        const indexOfReport = storedObjects.findIndex((report) => (report.objectWorkingId === objectWorkingId));
        storedObjects.splice(indexOfReport, 1);
        settings.set(officeProperties.storedObjects, storedObjects);
      }


      // TODO remove after connecting object reducer to right panel
      // const reportProperties = this.getObjectProperties();
      // const indexOfReport2 = reportProperties.findIndex((report) => (report.bindId === bindId));
      // reportProperties.splice(indexOfReport2, 1);
      // settings.set(officeProperties.loadedReportProperties, reportProperties);

      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  // getObjectFromProperties = (bindId) => {
  //   const reportProperties = this.getObjectProperties();
  //   return reportProperties.find((report) => report.bindId === bindId);
  // };

  getObjectProperties = () => {
    try {
      const settings = this.getOfficeSettings();
      if (!(settings.get(officeProperties.loadedReportProperties))) {
        const reportProperties = [];
        settings.set(officeProperties.loadedReportProperties, reportProperties);
        settings.saveAsync();
      }
      return settings.get(officeProperties.loadedReportProperties);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  // loadExistingReportBindingsExcel = async () => {
  //   const reportArray = await this.getObjectProperties();
  //   this.reduxStore.dispatch({
  //     type: officeProperties.actions.loadAllReports,
  //     reportArray,
  //   });
  // };

  getOfficeSettings = () => {
    if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
      throw new RunOutsideOfficeError();
    }
    return Office.context.document.settings;
  }

  toggleFileSecuredFlag = (value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.isSecured, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  isFileSecured = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.isSecured);
    } catch (error) {
      errorService.handleError(error);
    }
  }


  // TODO remove
  clearObjectReducerFromSettings = async () => {
    const settings = this.getOfficeSettings();
    settings.set(officeProperties.storedObjects, []);
    await settings.saveAsync();
  };


  getObjectFromObjectReducer = (bindId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object) => object.bindId === bindId);
  };


  removeObjectFromStore = (bindId, objectWorkingId) => {
    this.reduxStore.dispatch(deleteObject(objectWorkingId));
    this.deleteObject(bindId, objectWorkingId);
  };

  restoreObjectsFromExcelStore = () => {
    const settings = this.getOfficeSettings();
    let objects = settings.get(officeProperties.storedObjects);

    objects = this.restoreLegacyObjectsFromExcelStore(objects);

    objects && this.reduxStore.dispatch(restoreAllObjects(objects));

    settings.set(officeProperties.loadedReportProperties, []);
    settings.set(officeProperties.storedObjects, objects);
    settings.saveAsync((saveAsync) => console.log(`Clearing report Array in settings ${saveAsync.status}`));
  };

  restoreLegacyObjectsFromExcelStore = (objects) => {
    const reportArray = this.getObjectProperties();
    const objectsToBeAdded = [];

    if (reportArray) {
      for (let index = 0; index < reportArray.length; index++) {
        const currentObject = JSON.parse(JSON.stringify(reportArray[index]));
        if (!objects || !objects.find(object => object.bindId === currentObject.bindId)) {
          this.mapLegacyObjectValue(currentObject, 'objectId', 'id');
          this.mapLegacyObjectValue(currentObject, 'mstrObjectType', 'objectType');
          this.mapLegacyObjectValue(currentObject, 'previousTableDimensions', 'tableDimensions');
          this.mapLegacyObjectValue(currentObject, 'subtotalsInfo', 'subtotalInfo');

          // TODO find better way for unique Id
          currentObject.objectWorkingId = Date.now() + (index * reportArray.length);
          objectsToBeAdded.push(currentObject);
        }
      }
    }
    return [...objects, ...objectsToBeAdded];
  }

  mapLegacyObjectValue = async (object, newKey, oldKey) => {
    try {
      if (object[oldKey]) {
        object[newKey] = object[oldKey];
        delete object[oldKey];
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  modifyObjectValue = async (bindId, key, value) => {
    try {
      const settings = this.getOfficeSettings();
      const objects = settings.get(officeProperties.storedObjects);
      const indexOfReport = objects.findIndex((object) => (object.bindId === bindId));
      objects[indexOfReport][key] = value;
      settings.set(officeProperties.storedObjects, objects);
      await settings.saveAsync();
      await this.loadExistingReportBindingsExcel();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  saveObjectsInExcelStore = async () => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const settings = this.getOfficeSettings();
    settings.set(officeProperties.storedObjects, objects);
    // TODO: check if needed
    await settings.saveAsync();
    // TODO: uncomment below
    // this.reduxStore.dispatch(markStepCompleted(objectData.objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  }
}

export const officeStoreService = new OfficeStoreService();
