import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupTypeEnum } from '../home/popup-type-enum';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { popupHelper } from './popup-helper';
import { officeProperties } from '../office/store/office-properties';

const { createInstance, answerPrompts, getInstance } = mstrObjectRestService;

class PopupViewSelectorHelper {
  setPopupType = (props, popupType) => {
    const {
      importRequested, dossierOpenRequested, loading, isPrompted
    } = props;
    if (
      (importRequested && !isPrompted)
      || (importRequested && this.arePromptsAnswered(props))
    ) {
      this.proceedToImport(props);
    } else if (!!isPrompted && this.arePromptsAnswered(props)) {
      if (this.isInstanceWithPromptsAnswered(props)) {
        if (popupType === PopupTypeEnum.repromptingWindow) {
          return PopupTypeEnum.editFilters;
        }
      } else if (dossierOpenRequested) {
        // pass given prompts answers to dossierWindow
        return PopupTypeEnum.dossierWindow;
      } else {
        this.obtainInstanceWithPromptsAnswers(props);
        return PopupTypeEnum.emptyDiv;
      }
    } else if (this.promptedReportSubmitted(props) || (dossierOpenRequested && !!isPrompted)) {
      return PopupTypeEnum.promptsWindow;
    } else if ((dossierOpenRequested) && (!loading)) {
      // open dossier without prompts
      return PopupTypeEnum.dossierWindow;
    }
    return popupType;
  };

  wasReportJustImported = (props) => {
    const isNullOrEmpty = (obj) => {
      const stringifiedObj = JSON.stringify(obj);
      return !obj || stringifiedObj === '{}' || stringifiedObj === '[]';
    };
    return (
      !!props.editedObject
      && isNullOrEmpty(props.editedObject.selectedAttributes)
      && isNullOrEmpty(props.editedObject.selectedMetrics)
      && isNullOrEmpty(props.editedObject.selectedFilters)
    );
  }

  promptedReportSubmitted = (props) => (
    !!(props.propsToPass.isPrompted || props.isPrompted)
    && (props.importRequested || props.popupType === PopupTypeEnum.dataPreparation)
  )

  isInstanceWithPromptsAnswered = (props) => (
    !!props.editedObject
    && !!props.editedObject.instanceId
    && props.preparedInstance === props.editedObject.instanceId
  )

  arePromptsAnswered = (props) => !!props.dossierData && !!props.dossierData.instanceId

  obtainInstanceWithPromptsAnswers = async (props) => {
    const { editedObject, chosenProjectId, chosenObjectId } = props;
    const projectId = chosenProjectId || editedObject.chosenProjectId || editedObject.projectId;
    const objectId = chosenObjectId || editedObject.chosenObjectId;
    const defaultAttrFormNames = officeProperties.displayAttrFormNames.automatic;
    const displayAttrFormNames = (editedObject && editedObject.displayAttrFormNames) || defaultAttrFormNames;
    const configInstace = { objectId, projectId };
    let instanceDefinition = await createInstance(configInstace);
    let count = 0;
    while (instanceDefinition.status === 2) {
      const configPrompts = {
        objectId,
        projectId,
        instanceId: instanceDefinition.instanceId,
        promptsAnswers: props.promptsAnswers[count],
      };
      await answerPrompts(configPrompts);
      const configAnsPrompts = {
        objectId, projectId, instanceId: instanceDefinition.instanceId, displayAttrFormNames
      };
      try {
        instanceDefinition = await getInstance(configAnsPrompts);
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
      count += 1;
    }
    const body = this.createBody(props.editedObject && props.editedObject.selectedAttributes,
      props.editedObject && props.editedObject.selectedMetrics,
      props.editedObject && props.editedObject.selectedFilters);
    const preparedReport = {
      id: objectId,
      projectId,
      name: props.chosenObjectName || props.editedObject.chosenObjectName,
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
      instanceId: instanceDefinition.instanceId,
      promptsAnswers: props.promptsAnswers,
      body,
    };
    props.preparePromptedReport(instanceDefinition.instanceId, preparedReport);
  }


  // TODO: get this method from library
  createBody = (attributes, metrics, filters, instanceId) => {
    // temporary line below.
    // Once the rest structure is unified for both endpoints,
    // this conditional won't be needed anymore.
    const restObjectType = !instanceId ? 'requestedObjects' : 'template';
    const body = {
      [restObjectType]: {
        attributes: [],
        metrics: [],
      },
    };
    if (attributes && attributes.length > 0) {
      attributes.forEach((att) => {
        body[restObjectType].attributes.push({ id: att });
      });
    }
    if (metrics && metrics.length > 0) {
      metrics.forEach((met) => {
        body[restObjectType].metrics.push({ id: met });
      });
    }
    if (filters && Object.keys(filters).length > 0) {
      body.viewFilter = this.composeFilter(filters);
    }
    return body;
  }

  // TODO: remove once create body is from library
  composeFilter = (selectedFilters) => {
    let branch;
    const filterOperands = [];
    const addItem = (item) => {
      branch.operands[1].elements.push({ id: item, });
    };
    for (const att of selectedFilters) {
      if (selectedFilters[att].length) {
        branch = {
          operator: 'In',
          operands: [],
        };
        branch.operands.push({
          type: 'attribute',
          id: att,
        });
        branch.operands.push({
          type: 'elements',
          elements: [],
        });
        selectedFilters[att].forEach(addItem);
        filterOperands.push(branch);
      }
    }
    const operandsLength = filterOperands.length;
    if (!operandsLength) {
      return;
    }
    return operandsLength === 1
      ? filterOperands[0]
      : { operator: 'And', operands: filterOperands };
  }

  proceedToImport = (props) => {
    let visualizationInfo;
    if (props.chosenChapterKey) {
      visualizationInfo = {
        chapterKey: props.chosenChapterKey,
        visualizationKey: props.chosenVisualizationKey,
      };
    }
    const okObject = {
      command: selectorProperties.commandOk,
      chosenObject: props.chosenObjectId,
      chosenProject: props.chosenProjectId,
      chosenSubtype: props.chosenSubtype,
      isPrompted: props.isPrompted,
      promptsAnswers: props.promptsAnswers,
      visualizationInfo,
      preparedInstanceId: props.preparedInstanceId,
      isEdit: props.isEdit,
    };
    if (props.dossierData) {
      okObject.dossierData = {
        ...props.dossierData,
        chosenObjectName: props.chosenObjectName,
      };
      const { isReprompt } = props.dossierData;
      // skip this part if report contains no selected attribiutes/metrics/filters
      if (isReprompt && !this.wasReportJustImported(props)) {
        okObject.command = selectorProperties.commandOnUpdate;
        const { selectedAttributes, selectedMetrics, selectedFilters } = props.editedObject;
        okObject.body = this.createBody(selectedAttributes, selectedMetrics, selectedFilters, false);
      }
    }
    props.startLoading();
    props.startImport();
    window.Office.context.ui.messageParent(JSON.stringify(okObject));
  }
}

export const popupViewSelectorHelper = new PopupViewSelectorHelper();
