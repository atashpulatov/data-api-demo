import { PageByConfiguration } from '@mstr/connector-components';

import { ObjectExecutionStatus } from '../helpers/prompts-handling-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { popupHelper } from './popup-helper';

import { reduxStore } from '../store';

import { PageBy } from '../page-by/page-by-types';
import { RequestPageByModalOpenData } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-types';
import { PopupTypeEnum } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { PageByDisplayOption } from '../right-side-panel/settings-side-panel/settings-side-panel-types';

import { selectorProperties } from '../attribute-selector/selector-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { DisplayAttrFormNames } from '../mstr-object/constants';

const { createInstance, answerPrompts, getInstance } = mstrObjectRestService;

class PopupViewSelectorHelper {
  isRepromptPopupType(popupType: PopupTypeEnum): boolean {
    return (
      popupType === PopupTypeEnum.repromptingWindow ||
      popupType === PopupTypeEnum.repromptReportDataOverview ||
      popupType === PopupTypeEnum.repromptDossierDataOverview
    );
  }

  setPopupType(props: any, popupType: PopupTypeEnum): PopupTypeEnum {
    const { importRequested, dossierOpenRequested, isPrompted, pageBy } = props;
    const arePromptsAnswered = this.arePromptsAnswered(props);
    const shouldProceedToImport =
      importRequested && (!isPrompted || arePromptsAnswered) && !pageBy?.length;
    const getPromptedReportPopupType = (): PopupTypeEnum =>
      // If we are in Multiple Reprompt workflow and get to this point, we are in
      // the transition period waiting for the next object to be reprompted.
      // Otherwise, we are in the final step of Prepare Data or Edit workflow.
      this.isMultipleReprompt(props)
        ? PopupTypeEnum.multipleRepromptTransitionPage
        : PopupTypeEnum.editFilters;

    if (shouldProceedToImport) {
      this.proceedToImport(props);
    } else if (isPrompted && arePromptsAnswered) {
      // Please review this logic above in if-condition. If we don't mark 'isPrompted' as 'true' in the Redux store,
      // particularly in the navigation-tree-reducer, while processing the 'PROMPTS_ANSWERED'
      // action triggered by the Prompts dialog, it could lead to a cyclical loop in the prompts page
      // when editing a prompted report.
      if (this.isInstanceWithPromptsAnswered(props)) {
        // Handle the case when the user is editing a prompted report or dossier.
        if (this.isRepromptPopupType(popupType)) {
          return getPromptedReportPopupType();
        }
      } else {
        return PopupTypeEnum.obtainInstanceHelper;
      }
    } else if (this.promptedReportSubmitted(props)) {
      return PopupTypeEnum.promptsWindow;
    } else if (dossierOpenRequested) {
      // open dossier without prompts
      return PopupTypeEnum.dossierWindow;
    }
    return popupType;
  }

  wasReportJustImported(props: any): boolean {
    const isNullOrEmpty = (object: any): boolean => {
      const stringifiedObj = JSON.stringify(object);
      return !object || stringifiedObj === '{}' || stringifiedObj === '[]';
    };
    return (
      !!props.editedObject &&
      isNullOrEmpty(props.editedObject.selectedAttributes) &&
      isNullOrEmpty(props.editedObject.selectedMetrics) &&
      isNullOrEmpty(props.editedObject.selectedFilters)
    );
  }

  promptedReportSubmitted(props: any): boolean {
    if (!props) {
      return false;
    }

    const isPrompted = props.propsToPass?.isPrompted;
    const finalIsPrompted = isPrompted?.isPrompted ?? false;

    const isPromptedReportSubmitted =
      !!(finalIsPrompted || props.isPrompted) &&
      props.mstrObjectType?.name === mstrObjectEnum.mstrObjectType.report.name &&
      (props.importRequested || props.popupType === PopupTypeEnum.dataPreparation);

    return isPromptedReportSubmitted;
  }

  isInstanceWithPromptsAnswered(props: any): boolean {
    return (
      !!props.editedObject &&
      !!props.editedObject.instanceId &&
      props.preparedInstance === props.editedObject.instanceId
    );
  }

  arePromptsAnswered(props: any): boolean {
    return !!props.dossierData && !!props.dossierData.instanceId;
  }

  isMultipleReprompt(props: any): boolean {
    return props.repromptsQueueProps?.total > 1;
  }

  async obtainInstanceWithPromptsAnswers(props: any): Promise<void> {
    const { editedObject, chosenProjectId, chosenObjectId } = props;
    const projectId =
      chosenProjectId || editedObject.chosenProjectId || (editedObject.projectId as string);
    const objectId = chosenObjectId || (editedObject.chosenObjectId as string);
    const defaultAttrFormNames = DisplayAttrFormNames.AUTOMATIC;
    const displayAttrFormNames =
      (editedObject && editedObject.displayAttrFormNames) || defaultAttrFormNames;
    const configInstace = { objectId, projectId };
    let instanceDefinition = await createInstance(configInstace as any);
    let count = 0;
    while (instanceDefinition.status === ObjectExecutionStatus.PROMPTED) {
      const configPrompts = {
        objectId,
        projectId,
        instanceId: instanceDefinition.instanceId,
        promptsAnswers: props.promptsAnswers[count],
      };
      await answerPrompts(configPrompts);
      const configAnsPrompts = {
        objectId,
        projectId,
        instanceId: instanceDefinition.instanceId,
        displayAttrFormNames,
      };
      try {
        instanceDefinition = await getInstance(configAnsPrompts as any);
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
      count += 1;
    }
    const body = this.createBody(
      props.editedObject && props.editedObject.selectedAttributes,
      props.editedObject && props.editedObject.selectedMetrics,
      props.editedObject && props.editedObject.selectedFilters
    );
    const preparedReport = {
      id: objectId,
      projectId,
      name: props.editedObject.chosenObjectName || props.chosenObjectName,
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
      instanceId: instanceDefinition.instanceId,
      promptsAnswers: props.promptsAnswers,
      body,
    };
    props.preparePromptedReport(instanceDefinition.instanceId, preparedReport);

    const { pageBy } = instanceDefinition.definition?.grid || {};
    const { pageByDisplaySetting } = reduxStore.getState().settingsReducer;

    if (props.popupType === PopupTypeEnum.libraryWindow) {
      if (pageBy?.length && pageByDisplaySetting === PageByDisplayOption.SELECT_PAGES) {
        this.handleRequestPageByModalOpen({ ...props, pageBy });
      } else {
        props.requestImport();
      }
    }
  }

  // TODO: get this method from library
  createBody(attributes: any[], metrics: any[], filters: any, instanceId?: boolean): any {
    // Once the rest structure is unified for both endpoints,
    // this conditional won't be needed anymore.
    const restObjectType = !instanceId ? 'requestedObjects' : 'template';
    const body: any = {
      [restObjectType]: {
        attributes: [],
        metrics: [],
      },
    };
    if (attributes && attributes.length > 0) {
      attributes.forEach(att => {
        body[restObjectType].attributes.push({ id: att });
      });
    }
    if (metrics && metrics.length > 0) {
      metrics.forEach(met => {
        body[restObjectType].metrics.push({ id: met });
      });
    }
    if (filters && Object.keys(filters).length > 0) {
      body.viewFilter = this.composeFilter(filters);
    }
    return body;
  }

  // TODO: remove once create body is from library
  composeFilter(selectedFilters: any): any {
    const filterOperands = [];
    for (const [key, value] of Object.entries(selectedFilters)) {
      if ((value as any[]).length) {
        const branch = {
          operator: 'In',
          operands: [] as any[],
        };
        branch.operands.push({
          type: 'attribute',
          id: key,
        });
        branch.operands.push({
          type: 'elements',
          elements: [],
        });
        (value as any[]).forEach(item => {
          branch.operands[1].elements.push({ id: item });
        });
        filterOperands.push(branch);
      }
    }
    const operandsLength = filterOperands.length;
    if (!operandsLength) {
      return;
    }
    return operandsLength === 1 ? filterOperands[0] : { operator: 'And', operands: filterOperands };
  }

  proceedToImport(props: any): void {
    let visualizationInfo;
    if (props.chosenChapterKey) {
      visualizationInfo = {
        chapterKey: props.chosenChapterKey,
        visualizationKey: props.chosenVisualizationKey,
        vizDimensions: props.chosenVizDimensions,
      };
    }

    const message = {
      command: selectorProperties.commandOk,
      chosenObject: props.chosenObjectId,
      chosenProject: props.chosenProjectId,
      chosenSubtype: props.chosenSubtype,
      chosenObjectName: props.chosenObjectName,
      isPrompted: props.promptsAnswers?.length > 0 && props.promptsAnswers[0].answers?.length > 0,
      importType: props.importType,
      promptsAnswers: props.promptsAnswers,
      visualizationInfo,
      preparedInstanceId: props.preparedInstanceId,
      isEdit: props.isEdit,
      displayAttrFormNames: props.displayAttrFormNames || DisplayAttrFormNames.AUTOMATIC,
      dossierData: null as any,
      body: null as any,
      pageByConfigurations: props.pageByConfigurations,
    };
    if (props.dossierData) {
      message.dossierData = {
        ...props.dossierData,
        chosenObjectName: props.chosenObjectName,
      };
      const { isReprompt } = props.dossierData;
      // skip this part if report contains no selected attribiutes/metrics/filters
      if (isReprompt && !this.wasReportJustImported(props)) {
        message.command = selectorProperties.commandOnUpdate;
        const { selectedAttributes, selectedMetrics, selectedFilters } = props.editedObject;
        message.body = this.createBody(selectedAttributes, selectedMetrics, selectedFilters, false);
      }
    }
    props.startImport();
    popupHelper.officeMessageParent(message);
  }

  /**
   * Handles the request to open the Page By modal.
   *
   * @param pageBy Contains information about page-by elements
   * @param requestPageByModalOpen Function to request the Page By modal to open
   */
  handleRequestPageByModalOpen(props: {
    pageBy: PageBy[];
    requestPageByModalOpen: (data: RequestPageByModalOpenData) => void;
  }): void {
    const { pageBy, requestPageByModalOpen } = props;

    requestPageByModalOpen({
      pageBy,
      importPageByConfigurations: (pageByConfigurations: PageByConfiguration[][]) =>
        this.proceedToImport({ ...props, pageByConfigurations }),
    });
  }
}

export const popupViewSelectorHelper = new PopupViewSelectorHelper();
