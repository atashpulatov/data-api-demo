/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';

import { dialogHelper } from '../../dialog/dialog-helper';
import {
  collectPromptKeys,
  ObjectExecutionStatus,
  prepareGivenPromptAnswers,
  preparePromptedDossier,
} from '../../helpers/prompts-handling-helper';
import { convertPixelsToPoints } from '../../helpers/visualization-image-utils';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { handleLoginExcelDesktopInWindows } from '../utils/embedded-helper';
import scriptInjectionHelper from '../utils/script-injection-helper';
import { embeddedDossierHelper } from './embedded-dossier-helper';

import { RootState } from '../../store';

import {
  AnswersState,
  PromptsAnswer,
} from '../../redux-reducer/answers-reducer/answers-reducer-types';
import { RepromptsQueueState } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-types';
import { VisualizationInfo } from '../../types/object-types';

import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { repromptsQueueSelector } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';
import { ErrorMessages } from '../../error/constants';

import './dossier.scss';

const { microstrategy, Office } = window;

const { createDossierInstance, rePromptDossier, getObjectPrompts } = mstrObjectRestService;

const VIZ_SELECTION_RETRY_DELAY = 200; // ms
const VIZ_SELECTION_RETRY_LIMIT = 10;

const EXPORT_ENGINE_MAX_DIMENSION_IN_PIXELS = 4000;

interface MstrData {
  envUrl?: string;
  authToken?: string;
  dossierId?: string;
  projectId?: string;
  instanceId?: string;
  promptsAnswers?: PromptsAnswer[];
  selectedViz?: string;
  visualizationInfo?: VisualizationInfo;
}

interface PromptObject {
  id: string;
  answers: any[]; // Replace 'any' with the appropriate type
  type: string;
}

interface EmbeddedDossierProps {
  mstrData?: MstrData;
  handleSelection?: () => void;
  handlePromptAnswer?: () => void;
  handleInstanceIdChange?: () => void;
  handleIframeLoadEvent?: () => void;
  handleEmbeddedDossierLoad?: () => void;
  handleUniquePromptKeys?: (keys: string[]) => void;
  reusePromptAnswers?: boolean;
  previousPromptsAnswers?: PromptsAnswer[];
  dossierOpenRequested?: boolean;
  promptObjects?: PromptObject[];
  isPrompted?: boolean;
  repromptsQueue?: RepromptsQueueState;
  isMultipleRepromptWithReuse?: boolean;
  handleEmbeddedDossierVisibility?: (flag?: boolean) => void;
  isReprompt?: boolean;
  promptKeys?: string[];
}

export default class EmbeddedDossierNotConnected extends React.Component {
  container: any;

  msgRouter: any;

  dossierData: any;

  retryCounter: number;

  embeddedDossier: any;

  constructor(props: EmbeddedDossierProps) {
    super(props);

    const { mstrData } = props;

    this.container = React.createRef();
    this.msgRouter = null;
    this.onVizSelectionHandler = this.onVizSelectionHandler.bind(this);
    this.dossierData = { promptsAnswers: mstrData.promptsAnswers };
    this.promptsAnsweredHandler = this.promptsAnsweredHandler.bind(this);
    this.instanceIdChangeHandler = this.instanceIdChangeHandler.bind(this);
    this.restoreVizSelection = this.restoreVizSelection.bind(this);
    this.onEmbeddedError = this.onEmbeddedError.bind(this);
    this.retryCounter = 0;
    this.embeddedDossier = null;
  }

  componentDidMount(): void {
    scriptInjectionHelper.watchForIframeAddition(this.container.current, this.onIframeLoad);

    // Do not embed the dossier if the Microstrategy API is not available
    if (!microstrategy?.dossier) {
      console.warn(ErrorMessages.MICROSTRATEGY_API_MISSING);
      return;
    }

    this.loadEmbeddedDossier(this.container.current);
  }

  componentWillUnmount(): void {
    if (this.msgRouter) {
      const { EventType } = microstrategy.dossier;
      this.msgRouter.removeEventhandler(
        EventType.ON_VIZ_SELECTION_CHANGED,
        this.onVizSelectionHandler
      );
      this.msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, this.promptsAnsweredHandler);
      this.msgRouter.removeEventhandler(
        EventType.ON_DOSSIER_INSTANCE_ID_CHANGE,
        this.instanceIdChangeHandler
      );
      this.msgRouter.removeEventhandler(EventType.ON_ERROR, this.onEmbeddedError);
    }
  }

  /**
   * This function is called after the embedded dossier iframe is added into the DOM
   * @param  iframe
   */
  onIframeLoad = (iframe: any): void => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;

      const { handleIframeLoadEvent }: any = this.props;
      if (iframe.focusEventListenerAdded === false) {
        iframe.focusEventListenerAdded = true;
        iframe.addEventListener('focus', scriptInjectionHelper.switchFocusToElementOnWindowFocus);
      }
      // DE160793 - Throw session expired error when dossier redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      handleLoginExcelDesktopInWindows(contentDocument, Office);
    });
  };

  /**
   * Handles the event thrown after new vizualization selection.
   * Retrives the selected vizualizationKey and chapterKey.
   * Passes new data to parent component by handleSelection function.
   *
   * @param payload - payload thrown by embedded.api after the visualization was selected
   */
  onVizSelectionHandler(payload: any): void {
    // @ts-expect-error
    const { handleSelection } = this.props;
    const [payloadChapterKey] = Object.keys(payload);
    const chapterData = payload[payloadChapterKey];
    const [payloadVisKey] = Object.keys(chapterData);
    const vizInfo = chapterData[payloadVisKey];

    let isGrid;
    let vizDimensions;

    if (vizInfo) {
      ({ isGrid, ...vizDimensions } = vizInfo);
    }

    if (vizDimensions) {
      // Currently scrollWidth is applied only to grid images
      let vizDimensionsWidth = vizDimensions.scrollWidth || vizDimensions.width;

      // If the entire image width exceeds the export engine dimension limit,
      // then export the image with allowed maximum dimension in pixels by export engine
      if (vizDimensionsWidth > EXPORT_ENGINE_MAX_DIMENSION_IN_PIXELS) {
        vizDimensionsWidth = EXPORT_ENGINE_MAX_DIMENSION_IN_PIXELS;
      }

      vizDimensions.width = convertPixelsToPoints(vizDimensionsWidth);
      vizDimensions.height = convertPixelsToPoints(vizDimensions.height);
    }

    this.dossierData = {
      ...this.dossierData,
      chapterKey: payloadChapterKey,
      visualizationKey: payloadVisKey,
      vizDimensions,
      isVizGrid: isGrid,
    };

    handleSelection(this.dossierData);
  }

  /**
   * Handles the event thrown after new error in embedded dossier.
   * Retrives the error type (based on title).
   * If error type is not a notification - handles it by closing the window
   *
   * @param {Object} error - payload thrown by embedded.api after the error occured
   */
  onEmbeddedError = (error: any): void => {
    if (error.title !== 'Notification') {
      // TODO: improve this, so it doesn't depend on i18n
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      dialogHelper.handlePopupErrors(error);
    }
  };

  /**
   * This function handles the instance creation of the Dossier.
   * If the instanceId is provided, it will be used to create the Dossier's instance.
   * Otherwise, a new instance will be created.
   * @param {*} instanceId
   * @param {*} projectId
   * @param {*} dossierId
   * @param {*} isPrompted
   * @param {*} isMultipleRepromptWithReuse
   * @returns
   */
  handleInstanceId = async (
    instanceId: string,
    projectId: string,
    dossierId: string,
    isPrompted: boolean,
    isMultipleRepromptWithReuse: boolean
  ): Promise<any> => {
    if (instanceId) {
      return { mid: instanceId, status: ObjectExecutionStatus.READY };
    }

    // Create a new instance of the Dossier using shortcut. For Multiple Reprompt workflow (with Reuse Prompt Answers flag on),
    // make sure to pass 'disableManipulationsAutoSaving: false' to ensure the Dossier instance is interpreted as a 'Shortcut Run as Base'.
    // Otherwise, the Dossier will include nested prompts answers and these answers will be added when re-prompting the Dossier, causing an error.
    // Refer to the chart here for more details: https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTSMOBILECTCiOSANA/pages/3646718180/F35914+Bookmarks+support+when+linking+to+a+dossier#2.2.1-Dossier-Execution
    const body = {
      disableManipulationsAutoSaving: !isMultipleRepromptWithReuse,
      persistViewState: true,
    };
    const instance = await createDossierInstance(projectId, dossierId, body);

    // Checking if the dossier is prompted and update the status accordingly
    instance.status =
      isPrompted || isMultipleRepromptWithReuse
        ? ObjectExecutionStatus.PROMPTED
        : ObjectExecutionStatus.READY;

    return instance;
  };

  /**
   * This function handles the preparation of the Dossier's instance to apply previous answers if necessary.
   * @param instance
   * @param dossierId
   * @param projectId
   * @param givenPromptsAnswers
   * @param {*} previousPromptsAnswers
   * @returns
   */
  prepareAndHandlePromptAnswers = async (
    instance: any,
    dossierId: string,
    projectId: string,
    givenPromptsAnswers: AnswersState[],
    previousPromptsAnswers: PromptsAnswer[]
  ): Promise<any> => {
    // Prepare the Dossier's instance to apply previous answers if necessary.
    if (givenPromptsAnswers.length > 0 && givenPromptsAnswers[0].answers.length > 0) {
      // Proceed with answering prompts if there are prompts to answer, including nested prompts.
      instance = await preparePromptedDossier(
        instance,
        dossierId,
        projectId,
        givenPromptsAnswers,
        previousPromptsAnswers
      );
    }
    return instance;
  };

  /**
   * Open Prompts' dialog if there are prompts to answer when importing a report/dossier or when
   * multiple reprompt is triggered; 'reusePromptAnswers' needs to be true for both cases.
   * @param {*} dossierId
   * @param {*} instance - passed as reference to update the instanceId (mid) if re-prompting the dossier.
   * @param {*} projectId
   * @param {*} dossierOpenRequested
   * @param {*} isImportedObjectPrompted
   * @param {*} isMultipleRepromptWithReuse
   */
  openPromptDialog = async (
    dossierId: string,
    instance: any,
    projectId: string,
    dossierOpenRequested: boolean,
    isImportedObjectPrompted: boolean,
    isMultipleRepromptWithReuse: boolean
  ): Promise<void> => {
    if ((dossierOpenRequested && isImportedObjectPrompted) || isMultipleRepromptWithReuse) {
      // Re-prompt the Dossier's instance to show the prompts dialog.
      const resp = await rePromptDossier(dossierId, instance.mid, projectId);

      instance.mid = resp?.mid;
    }
  };

  loadEmbeddedDossier = async (container: any): Promise<void> => {
    const {
      mstrData,
      handleEmbeddedDossierLoad,
      reusePromptAnswers,
      previousPromptsAnswers,
      dossierOpenRequested,
      promptObjects,
      isPrompted,
      isMultipleRepromptWithReuse,
      handleEmbeddedDossierVisibility,
      handleUniquePromptKeys,
      isReprompt,
      promptKeys,
    }: EmbeddedDossierProps = this.props;
    const {
      envUrl,
      authToken,
      dossierId,
      projectId,
      promptsAnswers,
      instanceId,
      selectedViz,
      visualizationInfo,
    } = mstrData;

    let instance: any = {};
    try {
      // Create instance and handle it different if it is prompted or multiple reprompt is triggered.
      instance = await this.handleInstanceId(
        instanceId,
        projectId,
        dossierId,
        isPrompted,
        isMultipleRepromptWithReuse
      );

      // Declared variables to determine whether importing a report/dossier is taking place and
      // whether there are previous prompt answers to handle
      const isImportedObjectPrompted = promptObjects?.length > 0;
      const handlePreviousAnswersAtImport =
        dossierOpenRequested &&
        reusePromptAnswers &&
        previousPromptsAnswers?.length > 0 &&
        isImportedObjectPrompted;

      // Instead of using the edited dossier prompt answers, use REST API to get the prompts objects when multiple reprompt is triggered.
      const promptObjectAnswers = isMultipleRepromptWithReuse
        ? await getObjectPrompts(dossierId, projectId, instance.mid)
        : promptObjects;
      const shouldPreparePromptAnswers =
        handlePreviousAnswersAtImport || isMultipleRepromptWithReuse;

      // Update givenPromptsAnswers collection with previous prompt answers if importing a report/dossier
      // or when multiple reprompt is triggered, in this case, use mstrData's (edited object) prompts answers.
      const givenPromptsAnswers = shouldPreparePromptAnswers
        ? prepareGivenPromptAnswers(promptObjectAnswers, previousPromptsAnswers)
        : [...(promptsAnswers || [])];

      instance = await this.prepareAndHandlePromptAnswers(
        instance,
        dossierId,
        projectId,
        givenPromptsAnswers as AnswersState[],
        previousPromptsAnswers
      );

      // check if all keys from promptObjectAnswers are present in the promptKeys set
      if (isMultipleRepromptWithReuse) {
        const allPromptKeys = collectPromptKeys(promptObjectAnswers);
        const areAllKeysPresent = allPromptKeys.every(key => promptKeys.includes(key));
        if (!areAllKeysPresent) {
          // Proceed with opening prompt dialog if applicable.
          await this.openPromptDialog(
            dossierId,
            instance,
            projectId,
            dossierOpenRequested,
            isImportedObjectPrompted,
            isMultipleRepromptWithReuse
          );
          handleUniquePromptKeys(allPromptKeys);
        }
      } else {
        await this.openPromptDialog(
          dossierId,
          instance,
          projectId,
          dossierOpenRequested,
          isImportedObjectPrompted,
          isMultipleRepromptWithReuse
        );
      }
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      dialogHelper.handlePopupErrors(error);
    }

    // Do not proceeed with the embedded dossier creation if the instance is not ready.
    if (!instance?.mid) {
      return;
    }

    this.dossierData = {
      ...this.dossierData,
      instanceId: instance.mid,
    };

    const serverURL = envUrl.slice(0, envUrl.lastIndexOf('/api'));
    // delete last occurence of '/api' from the enviroment url

    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    const props = {
      instance,
      serverURL,
      applicationID: projectId,
      objectID: dossierId,
      enableCustomAuthentication: true,
      customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
      enableResponsive: true,
      reportInLibraryFeature: { enabled: false },
      getLoginToken() {
        return Promise.resolve(authToken);
      },
      placeholder: container,
      enableCollaboration: false,
      filterFeature: {
        enabled: true,
        edit: true,
        summary: true,
      },
      navigationBar: {
        enabled: true,
        gotoLibrary: false,
        title: true,
        toc: true,
        reset: true,
        reprompt: true,
        share: false,
        comment: false,
        notification: false,
        filter: true,
        options: false,
        search: false,
        bookmark: true,
        edit: false,
      },
      optionsFeature: {
        enabled: true,
        help: true,
        logout: true,
        manage: true,
        showTutorials: true,
      },
      shareFeature: {
        enabled: true,
        invite: true,
        link: true,
        email: true,
        export: true,
        download: true,
        shareDossier: false,
      },
      tocFeature: { enabled: true },
      uiMessage: {
        enabled: true,
        addToLibrary: true,
      },
      enableVizSelection: true,
      onMsgRouterReadyHandler: ({ MsgRouter }: any) => {
        this.msgRouter = MsgRouter;
        this.msgRouter.registerEventHandler(
          EventType.ON_VIZ_SELECTION_CHANGED,
          this.onVizSelectionHandler
        );
        this.msgRouter.registerEventHandler(
          EventType.ON_PROMPT_ANSWERED,
          this.promptsAnsweredHandler
        );
        this.msgRouter.registerEventHandler(
          EventType.ON_DOSSIER_INSTANCE_ID_CHANGE,
          (selectedInstanceId: string) => {
            // Need to make sure that the instanceId is not null before calling the handler
            selectedInstanceId && this.instanceIdChangeHandler(selectedInstanceId);
          }
        );
        this.msgRouter.registerEventHandler(EventType.ON_ERROR, this.onEmbeddedError);
        this.msgRouter.registerEventHandler(EventType.ON_PAGE_LOADED, () => {
          // Just hide the embedded dossier when it is consumption page is loaded
          // and avoid any flickering. Only hide it when it is a reprompt.
          if (!dossierOpenRequested && isReprompt) {
            handleEmbeddedDossierVisibility(false);
          }
        });
      },
      dossierFeature: {
        visExport: {
          enabled: false,
          excel: false,
          pdf: false,
          csv: false,
        },
      },
    };

    if (microstrategy?.dossier) {
      const embeddedDossier = await microstrategy.dossier.create(props);
      this.embeddedDossier = embeddedDossier;

      if (selectedViz && visualizationInfo) {
        const { pageKey, chapterKey, visualizationKey } = visualizationInfo;

        const chapterList = embeddedDossier.getChapterList();

        const selectedPageNodeKey = chapterList
          .find((chapter: any) => chapter.nodeKey.includes(chapterKey))
          .children.find((page: any) => page.nodeKey.includes(pageKey)).nodeKey;

        const selectedPage = embeddedDossier.getPageByNodeKey(selectedPageNodeKey);

        await embeddedDossier.navigateToPage(selectedPage);

        await this.restoreVizSelection(visualizationKey);
      }

      handleEmbeddedDossierLoad();
    } else {
      console.warn(ErrorMessages.MICROSTRATEGY_API_MISSING);
    }
  };

  async restoreVizSelection(visualizationKey: string): Promise<void> {
    try {
      this.retryCounter++;
      await this.embeddedDossier.selectViz(visualizationKey);
    } catch (error) {
      if (this.retryCounter > VIZ_SELECTION_RETRY_LIMIT) {
        console.error(error);
      } else {
        await new Promise(resolve => {
          setTimeout(resolve, VIZ_SELECTION_RETRY_DELAY);
        });
        await this.restoreVizSelection(visualizationKey);
      }
    }
  }

  /**
   * Update the instanceId in dossierData and also in parent component.
   * InstanceId is changing as result of reset button click, switch to
   * bookmark or new prompts answers given.
   *
   * @param newInstanceId
   */
  instanceIdChangeHandler(newInstanceId: string): void {
    const { handleInstanceIdChange }: any = this.props;
    this.dossierData.instanceId = newInstanceId;
    handleInstanceIdChange(newInstanceId);
  }

  /**
   * Update the promptsAnswers in dossierData and also in parent component.
   * Update the selectedViz in parent component in case of simple reprompt
   * to keep the import button enabled.
   *
   * * @param {Object} promptsAnswersPayloadObject - answers sent from embedded api, entered by user.
   */
  async promptsAnsweredHandler(promptsAnswersPayloadObject: any): Promise<void> {
    const { handlePromptAnswer }: any = this.props;
    const dupPromptsAnswersPayloadObject = { ...promptsAnswersPayloadObject };

    // Create reference to current prompted object's answers. This function called again after
    // nested re-prompting the dossier, so we need to keep previous answers along with new ones.
    // previousPromptLevelAnswers will be a collection of answers for each prompt level.
    const previousPromptLevelAnswers = this.dossierData?.promptsAnswers?.[0]?.answers || [];

    // Combined the new answers with the previous ones for the current prompt object.
    dupPromptsAnswersPayloadObject.answers = embeddedDossierHelper.combineArraysByObjectKey(
      previousPromptLevelAnswers,
      dupPromptsAnswersPayloadObject.answers
    );

    // If not defined or null then create new array with promptsAnswers as first element;
    // otherwise add new promptsAnswers to the array
    this.dossierData.promptsAnswers = [dupPromptsAnswersPayloadObject];

    // Persist in Redux only the answers for the current prompt object.
    handlePromptAnswer(this.dossierData.promptsAnswers);
    if (this.embeddedDossier) {
      const payload = await this.embeddedDossier.getSelectedVizKeys();
      if (Object.keys(payload).length > 0) {
        this.onVizSelectionHandler(payload);
      }
    }
  }

  render(): React.JSX.Element {
    return (
      /*
      Height needs to be passed for container because without it, embedded api will set default height: 600px;
      We need to calculate actual height, regarding the size of other elements:
      58px for header, 19px for header and title margin and 68px for buttons.
      */
      <div ref={this.container} className='dossier-iframe' />
    );
  }
}

const mapStateToProps = (state: RootState): any => {
  const {
    navigationTree,
    popupReducer,
    sessionReducer: { attrFormPrivilege, envUrl, authToken },
    officeReducer,
    answersReducer,
    popupStateReducer,
    repromptsQueueReducer,
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    promptObjects,
    dossierOpenRequested,
    isPrompted,
  } = navigationTree;

  const popupState = popupReducer.editedObject;
  const { promptsAnswers } = state.navigationTree;
  const { supportForms, reusePromptAnswers } = officeReducer;
  const { answers } = answersReducer;
  const isReport =
    popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const isEdit = chosenObjectName === DEFAULT_PROJECT_NAME;
  const editedObject = {
    ...dialogHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege),
  };
  const { isReprompt = false } = popupStateReducer;
  const isMultipleRepromptWithReuse = reusePromptAnswers && repromptsQueueReducer.total > 1;
  const promptKeys = repromptsQueueSelector.selectPromptKeys(state); // Use the selector here
  // Do not specify the instanceId if it is a multiple reprompt because, if it is specified,
  // the embedded dossier will not load the saved prompts and will use the default ones instead, the ones
  // in the definition when it was imported the first time.
  const mstrData = {
    envUrl,
    authToken,
    dossierId: isEdit || isReprompt ? editedObject.chosenObjectId : chosenObjectId,
    projectId: isEdit || isReprompt ? editedObject.projectId : chosenProjectId,
    promptsAnswers: isEdit || isReprompt ? editedObject.promptsAnswers : promptsAnswers,
    visualizationInfo: editedObject.visualizationInfo,
    selectedViz: isEdit || isReprompt ? editedObject.selectedViz : '',
    instanceId: !isMultipleRepromptWithReuse ? editedObject.instanceId : '',
  };
  return {
    mstrData,
    reusePromptAnswers,
    previousPromptsAnswers: answers,
    promptObjects,
    dossierOpenRequested,
    isPrompted,
    repromptsQueue: { ...repromptsQueueReducer },
    promptKeys,
    isMultipleRepromptWithReuse,
    isReprompt,
  };
};

// @ts-expect-error
export const EmbeddedDossier = connect(mapStateToProps)(EmbeddedDossierNotConnected);
