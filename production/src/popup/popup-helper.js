import { officeDisplayService } from '../office/office-display-service';
import { officeStoreService } from '../office/store/office-store-service';
import { notificationService } from '../notification/notification-service';
import { errorService } from '../error/error-handler';
import { PopupTypeEnum } from '../home/popup-type-enum';
import objectTypeEnum from '../mstr-object/mstr-object-type-enum';
import { officeContext } from '../office/office-context';
import { selectorProperties } from '../attribute-selector/selector-properties';

export class PopupHelper {
  init = (popupController) => {
    this.popupController = popupController;
  }

  capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  getPopupHeight = (reportArray, reportNumberToShow = 10) => {
    const reportsListLength = reportArray.length > reportNumberToShow
      ? reportNumberToShow
      : reportArray.length;
    // This formula calculates the height as a percentage of the excel window
    // 230 is the title and refresh text height
    // 30 is the height of each report list (variable)
    // 200 is the excel ribbon + toolbar height
    // 100 is to convert to percentage
    return Math.floor(((230 + reportsListLength * 30) / (window.innerHeight + 200)) * 100);
  };

  runRefreshAllPopup = async (reportArray, reportNumberToShow = 10) => {
    const popupHeight = this.getPopupHeight(reportArray, reportNumberToShow);
    await this.popupController.runPopup(PopupTypeEnum.refreshAllPage, popupHeight, 28);
  };

  storagePrepareRefreshAllData = (reportArray) => {
    localStorage.removeItem('refreshData');
    const refreshReportsData = reportArray.map((report) => ({
      key: report.bindId,
      name: report.name,
      result: false,
      isError: null,
    }));
    const refreshData = {
      data: refreshReportsData,
      allNumber: reportArray.length,
      finished: false,
      currentNumber: 1,
    };
    localStorage.setItem('refreshData', JSON.stringify(refreshData));
  };

  storageReportRefreshStart = (refreshReport, index) => {
    const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
    fromStorage.currentName = refreshReport.name;
    fromStorage.currentNumber = index + 1;
    localStorage.setItem('refreshData', JSON.stringify(fromStorage));
  };

  storageReportRefreshFinish = (result, isError, index, length) => {
    const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
    fromStorage.data[index].result = result;
    fromStorage.data[index].isError = isError;
    fromStorage.finished = index === length - 1;
    return localStorage.setItem('refreshData', JSON.stringify(fromStorage));
  };

  printRefreshedReport = async (
    bindingId,
    objectType,
    length,
    index,
    isRefreshAll,
    promptsAnswers,
  ) => {
    const refreshReport = officeStoreService.getReportFromProperties(bindingId);
    if (isRefreshAll) this.storageReportRefreshStart(refreshReport, index);
    const mstrObjectType = objectTypeEnum.getMstrTypeByName(objectType);
    const instanceId = null;
    // TODO: Pass proper isPrompted value – promptsAnswers could probably serve as such,
    // to be refactored.
    const options = {
      dossierData: instanceId,
      promptsAnswers: !promptsAnswers
        ? refreshReport.promptsAnswers
        : promptsAnswers,
      objectId: refreshReport.id,
      instanceId: refreshReport.instanceId,
      projectId: refreshReport.projectId,
      mstrObjectType,
      selectedCell: true,
      bindingId,
      body: refreshReport.body,
      isCrosstab: refreshReport.isCrosstab,
      crosstabHeaderDimensions: refreshReport.crosstabHeaderDimensions,
      isRefresh: true,
      isPrompted: refreshReport.isPrompted,
      isRefreshAll,
      subtotalsInfo: refreshReport.subtotalsInfo,
      visualizationInfo: refreshReport.visualizationInfo,
      manipulationsXML: refreshReport.manipulationsXML,
      tableName:refreshReport.tableName,
      previousTableDimensions: refreshReport.tableDimensions,
      displayAttrFormNames: refreshReport.displayAttrFormNames,
    };
    const result = await officeDisplayService.printObject(options);
    if (result && result.type === 'warning') {
      throw new Error(result.message);
    }
    if (!isRefreshAll) {
      notificationService.displayNotification({ type: 'success', content: `${this.capitalize(mstrObjectType.name)} refreshed` });
      return false;
    }
    this.storageReportRefreshFinish('ok', false, index, length);
    return false;
  };

  handleRefreshError(error, length, index, isRefreshAll) {
    if (isRefreshAll) {
      const errorMessage = errorService.getErrorMessage(error);
      return this.storageReportRefreshFinish(errorMessage, true, index, length);
    }
    if (error && error.code === 'ItemNotFound') {
      return notificationService.displayNotification({ type: 'info', content: 'Data is not relevant anymore. You can delete it from the list' });
    }
    errorService.handleError(error);
  }

  handlePopupErrors = (error) => {
    const errorObj = error && { status: error.status, message: error.message, response: error.response, type: error.type };
    const messageObject = {
      command: selectorProperties.commandError,
      error: errorObj,
    };
    officeContext
      .getOffice()
      .context.ui.messageParent(JSON.stringify(messageObject));
  };

  parsePopupState(popupState, promptsAnswers, formsPrivilege) {
    if (!popupState) {
      return;
    }
    let chapterKey;
    let visualizationKey;
    let dossierName;
    const { visualizationInfo } = popupState;
    if (visualizationInfo) {
      ({ chapterKey, visualizationKey } = visualizationInfo);
      const { dossierStructure } = visualizationInfo;
      if (dossierStructure) {
        ({ dossierName } = dossierStructure);
      }
    }
    const chosenObjectData = {
      chosenObjectId: popupState.id,
      instanceId: popupState.instanceId,
      projectId: popupState.projectId,
      chosenObjectName: popupState.name,
      chosenObjectType: popupState.objectType,
      chosenObjectSubtype: popupState.objectType === 'report' ? 768 : 779,
      promptsAnswers: promptsAnswers || popupState.promptsAnswers,
      subtotalsInfo: popupState.subtotalsInfo,
      isEdit: popupState.isEdit,
      dossierName,
      selectedViz: `${chapterKey}:${visualizationKey}`,
      displayAttrFormNames: popupState.displayAttrFormNames
    };
    if (promptsAnswers) {
      return this.comparePromptAnswers(popupState, promptsAnswers, chosenObjectData, formsPrivilege);
    }
    return this.restoreFilters(popupState.body, chosenObjectData, formsPrivilege);
  }

  comparePromptAnswers(popupState, promptsAnswers, chosenObjectData, formsPrivilege) {
    this.sortPromptsAnswers(popupState.promptsAnswers[0].answers);
    this.sortPromptsAnswers(promptsAnswers[0].answers);
    if (JSON.stringify(popupState.promptsAnswers) === JSON.stringify(promptsAnswers)) {
      return this.restoreFilters(popupState.body, chosenObjectData, formsPrivilege);
    }
    return chosenObjectData;
  }


  sortPromptsAnswers(array) {
    for (let i = 0; i < array.length; i++) {
      array[i].values.sort();
    }
  }

  restoreFilters(body, chosenObjectData, formsPrivilege) {
    try {
      if (body && body.requestedObjects) {
        chosenObjectData.selectedAttributes = body.requestedObjects.attributes
          && body.requestedObjects.attributes.map((attribute) => attribute.id);
        chosenObjectData.selectedMetrics = body.requestedObjects.metrics
          && body.requestedObjects.metrics.map((metric) => metric.id);
        chosenObjectData.selectedAttrForms = formsPrivilege ? this.getAttrFormKeys(body.requestedObjects.attributes) : null;
      }
      if (body && body.viewFilter) {
        chosenObjectData.selectedFilters = this.parseFilters(body.viewFilter.operands);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      return chosenObjectData;
    }
  }

  getAttrFormKeys = (attributes) => {
    const checkedForms = [];
    attributes && [...attributes].forEach((attribute) => {
      attribute.forms && [...attribute.forms].forEach((form) => {
        checkedForms.push(`${attribute.id}-${form.id}`);
      });
    });
    return checkedForms;
  }

  parseFilters(filtersNodes) {
    if (filtersNodes && filtersNodes[0] && filtersNodes[0].operands) {
      // equivalent to flatMap((node) => node.operands)
      return this.parseFilters(filtersNodes.reduce((nodes, node) => nodes.concat(node.operands), []));
    }
    const elementNodes = filtersNodes.filter((node) => node.type === 'elements');
    // equivalent to flatMap((node) => node.elements)
    const elements = elementNodes.reduce((elements, node) => elements.concat(node.elements),
      []);
    const elementsIds = elements.map((elem) => elem.id);
    return elementsIds.reduce((filters, elem) => {
      const attrId = elem.split(':')[0];
      filters[attrId] = !filters[attrId] ? [elem] : [...filters[attrId], elem];
      return filters;
    }, {});
  }
}

export const popupHelper = new PopupHelper();
