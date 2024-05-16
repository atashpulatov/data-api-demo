import { PageByConfiguration } from '@mstr/connector-components';

import { ObjectExecutionStatus } from '../helpers/prompts-handling-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { pageByHelper } from '../page-by/page-by-helper';
import { popupHelper } from './popup-helper';

import { RequestPageByModalOpenData } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-types';
import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import { selectorProperties } from '../attribute-selector/selector-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { DisplayAttrFormNames } from '../mstr-object/constants';

const { createInstance, answerPrompts, getInstance } = mstrObjectRestService;

class PopupViewSelectorHelper {
  /**
   * Determines whether the currently open dialog is displaying the prompts editor for a report
   * in the Overview dialog, or from the SidePanel.
   *
   * @param popupType - The type of the popup to check.
   * @returns - returns true if the popup type is a prompted report.
   */
  isRepromptReportPopupType(popupType: DialogType): boolean {
    return (
      popupType === DialogType.repromptingWindow ||
      popupType === DialogType.repromptReportDataOverview
    );
  }

  /**
   * Determines the type of the Prompted popup to show based on the workflow.
   * If we are in the Multiple Reprompt workflow (reprompt queue isn't empty), and current prompted object being processed
   * is a Report, then it means we are in the transition period waiting for the next prompted object to be reprompted.
   * In this case, it returns 'multipleRepromptTransitionPage' (intermediate) for prompted reports only.
   * Otherwise, we are in the final step of the Prepare Data or Edit workflow, and it returns 'editFilters'.
   *
   * @param props - collection of properties passsed that contains repromptsQueueProps property
   * @returns - returns the type of the Prompted popup type to show
   */
  getPromptedReportPopupType = (props: any): DialogType =>
    this.isMultipleReprompt(props)
      ? DialogType.multipleRepromptTransitionPage
      : DialogType.editFilters;

  setPopupType(props: any, popupType: DialogType): DialogType {
    const { importRequested, dossierOpenRequested, isPrompted, pageByResponse } = props;
    const arePromptsAnswered = this.arePromptsAnswered(props);
    const shouldProceedToImport =
      importRequested && (!isPrompted || arePromptsAnswered) && !pageByResponse;

    if (shouldProceedToImport) {
      this.proceedToImport(props);
    } else if (isPrompted && arePromptsAnswered) {
      // Please review this logic above in if-condition. If we don't mark 'isPrompted' as 'true' in the Redux store,
      // particularly in the navigation-tree-reducer, while processing the 'PROMPTS_ANSWERED'
      // action triggered by the Prompts dialog, it could lead to a cyclical loop in the prompts page
      // when editing a prompted report.
      if (this.isInstanceWithPromptsAnswered(props)) {
        // Handle the case when the user is editing a prompted report from either SidePanel or Overview dialog.
        if (this.isRepromptReportPopupType(popupType)) {
          // Return whether the Multiple Reprompt Transition Page should be shown in
          // the case of a having multiple prompted objects in the queue and current one is prompted report
          // being processed. In the case of Dossiers, it will not show the Multiple Reprompt Transition Page.
          // Note: both, multiple transition page and Dossier window, will render the popup notification when it's
          // applicable, such as the range taken notification.
          return this.getPromptedReportPopupType(props);
        }
      } else {
        return DialogType.obtainInstanceHelper;
      }
    } else if (this.promptedReportSubmitted(props)) {
      return DialogType.promptsWindow;
    } else if (dossierOpenRequested) {
      // open dossier without prompts
      return DialogType.dossierWindow;
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
      (props.importRequested || props.popupType === DialogType.dataPreparation);

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

  async obtainInstanceWithPromptsAnswers(props: any): Promise<InstanceDefinition> {
    const { editedObject, chosenProjectId, chosenObjectId, requestPageByModalOpen, importType } =
      props;
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
      props.editedObject?.selectedAttributes,
      props.editedObject?.selectedMetrics,
      props.editedObject?.selectedFilters
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

    if (props.popupType === DialogType.libraryWindow) {
      const shouldOpenPageByModal = pageByHelper.getShouldOpenPageByModal(pageBy, importType);

      if (shouldOpenPageByModal) {
        await this.handleRequestPageByModalOpen({
          objectId,
          projectId,
          instanceId: instanceDefinition.instanceId,
          requestPageByModalOpen,
          importCallback: pageByConfigurations =>
            this.proceedToImport({ ...props, pageByConfigurations }),
        });
      } else {
        props.requestImport();
      }
    }

    return instanceDefinition;
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
   * @param objectId Unique identifier of the object
   * @param projectId Unique identifier of the project
   * @param instanceId Unique identifier of the object instance
   * @param requestPageByModalOpen Function to request the Page By modal to open
   * @param importCallback Callback function to import the Page By configurations
   */
  async handleRequestPageByModalOpen(props: {
    objectId: string;
    projectId: string;
    instanceId: string;
    requestPageByModalOpen: (data: RequestPageByModalOpenData) => void;
    importCallback: (pageByConfigurations: PageByConfiguration[][]) => void;
  }): Promise<void> {
    const { objectId, projectId, instanceId, requestPageByModalOpen, importCallback } = props;

    let instance;

    if (!instanceId) {
      instance = await this.obtainInstanceWithPromptsAnswers(props);
    }

    const pageByResponse = await mstrObjectRestService.getPageByElements(
      objectId,
      projectId,
      instanceId || instance.instanceId
    );

    requestPageByModalOpen({
      pageByResponse,
      importPageByConfigurations: (pageByConfigurations: PageByConfiguration[][]) =>
        importCallback(pageByConfigurations),
    });
  }
}

export const popupViewSelectorHelper = new PopupViewSelectorHelper();
