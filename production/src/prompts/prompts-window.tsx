import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { ObjectWindowTitle, PageByConfiguration } from '@mstr/connector-components';
import { Spinner } from '@mstr/rc';

import { authenticationHelper } from '../authentication/authentication-helper';
import { dialogHelper } from '../dialog/dialog-helper';
import { dialogViewSelectorHelper } from '../dialog/dialog-view-selector-helper';
import scriptInjectionHelper from '../embedded/utils/script-injection-helper';
import {
  prepareGivenPromptAnswers,
  preparePromptedReport,
} from '../helpers/prompts-handling-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { EXTEND_SESSION, sessionHelper } from '../storage/session-helper';

import { RootState } from '../store';

import { DialogCommands } from '../dialog/dialog-controller-types';
import { PageByDisplayType } from '../page-by/page-by-types';
import {
  EditedObject,
  MstrData,
  PopupState,
} from '../redux-reducer/popup-reducer/popup-reducer-types';
import { RepromptsQueueState } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-types';
import { SessionState } from '../redux-reducer/session-reducer/session-reducer-types';

import { DialogButtons } from '../dialog/dialog-buttons/dialog-buttons';
import i18n from '../i18n';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { repromptsQueueSelector } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';
import { settingsReducerSelectors } from '../redux-reducer/settings-reducer/settings-reducer-selectors';
import { PromptsContainer } from './prompts-container';
import { ErrorMessages } from '../error/constants';
import { ObjectImportType } from '../mstr-object/constants';

import '../home/home.scss';
import '../index.scss';
import './prompts-window.scss';

interface PromptsWindowProps {
  promptsAnswered?: (...args: any) => void;
  cancelImportRequest?: () => void;
  onPopupBack?: () => void;
  mstrData?: MstrData;
  popupState?: PopupState;
  session?: SessionState;
  editedObject?: EditedObject;
  reusePromptAnswers?: boolean;
  previousPromptsAnswers?: any[]; // Replace 'any' with the appropriate type
  importRequested?: boolean;
  isPreparedDataRequested?: boolean;
  promptObjects?: any[]; // Replace 'any' with the appropriate type
  repromptsQueue?: RepromptsQueueState;
  promptKeys?: string[];
  isMultipleRepromptWithReuse?: boolean;
  setImportType?: (importType: ObjectImportType) => void;
  importType?: ObjectImportType;
}

const { microstrategy } = window;
const { deleteDossierInstance } = mstrObjectRestService;

export const PromptsWindowNotConnected: React.FC<PromptsWindowProps> = props => {
  const {
    mstrData,
    popupState,
    editedObject,
    promptsAnswered,
    session,
    cancelImportRequest,
    onPopupBack,
    reusePromptAnswers,
    previousPromptsAnswers,
    importRequested,
    promptObjects,
    isPreparedDataRequested,
    isMultipleRepromptWithReuse,
    repromptsQueue,
    promptKeys,
    setImportType,
    importType,
  } = props;
  const { chosenObjectId, chosenObjectName } = mstrData;
  // isReprompt will be true for both Edit AND Reprompt workflows
  // isEdit will only be true for the Edit workflow
  const { isReprompt, isEdit } = popupState;

  const { importType: editedObjectImportType } = editedObject;

  if (editedObjectImportType && importType !== editedObjectImportType) {
    setImportType(editedObjectImportType);
  }

  const newPromptsAnswers = useRef([]);
  const [isPromptLoading, setIsPromptLoading] = useState(true);
  const [embeddedDocument, setEmbeddedDocument] = useState(null);

  const pageByDisplaySetting = useSelector(settingsReducerSelectors.selectPageByDisplaySetting);

  const [t] = useTranslation('common', { i18n });

  const closePopup = (): void => {
    const message = { command: DialogCommands.COMMAND_CANCEL };
    dialogHelper.officeMessageParent(message);
  };

  const prolongSession = sessionHelper.installSessionProlongingHandler(closePopup);

  const messageReceived = useCallback(
    (message: any = {}) => {
      if (message.data && message.data.value && message.data.value.iServerErrorCode) {
        const newErrorObject = {
          status: message.data.value.statusCode,
          response: {
            body: {
              code: message.data.value.errorCode,
              iServerCode: message.data.value.iServerErrorCode,
              message: message.data.value.message,
            },
            text: JSON.stringify({
              code: message.data.value.errorCode,
              iServerCode: message.data.value.iServerErrorCode,
              message: message.data.value.message,
            }),
          },
        };
        dialogHelper.handlePopupErrors(newErrorObject);
      }
      const { data: postMessage, origin } = message;
      const { origin: targetOrigin } = window;
      if (origin === targetOrigin && postMessage === EXTEND_SESSION) {
        prolongSession();
      }
    },
    [prolongSession]
  );

  useEffect(() => {
    window.addEventListener('message', messageReceived);

    return () => window.removeEventListener('message', messageReceived);
  }, [messageReceived]);

  /**
   * Handler that is called when a prompt is answered in the Prompts dialog (UI)
   * when 'Run' or 'Apply' button is clicked. It only returns prompt answers manually
   * provided by the user while interacting with the prompts dialog.
   *
   * @param {*} newAnswer prompt answers entered by the user.
   */
  const promptAnsweredHandler = (newAnswer: any): void => {
    setIsPromptLoading(true);
    if (newPromptsAnswers.current.length > 0) {
      const newArray = [...newPromptsAnswers.current, newAnswer];
      newPromptsAnswers.current = newArray;
    } else {
      // Initialize newPromptsAnswers with the new answer.
      newPromptsAnswers.current = [newAnswer];
    }
  };

  const promptLoadedHandler = (): void => {
    setIsPromptLoading(false);
  };

  /**
   * Handles the event thrown after new error in embedded dossier.
   * Retrives the error type (based on title).
   * If error type is not a notification - handles it by closing the window
   *
   * @param error - payload thrown by embedded.api after the error occured
   */
  const onEmbeddedError = (error: any): void => {
    if (error.title !== 'Notification') {
      // TODO: improve this, so it doesn't depend on i18n
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      dialogHelper.handlePopupErrors(error);
    }
  };

  const initializeImportForReprompt = async (
    chosenObjectIdLocal: string,
    projectId: string,
    pageByConfigurations?: PageByConfiguration[][],
    currentAnswers?: any[]
  ): Promise<void> => {
    dialogHelper.officeMessageParent({
      command: DialogCommands.COMMAND_ON_UPDATE,
      chosenObjectId: chosenObjectIdLocal,
      projectId,
      chosenObjectSubtype: editedObject.chosenObjectSubtype,
      body: dialogViewSelectorHelper.createBody(
        editedObject.selectedAttributes,
        editedObject.selectedMetrics,
        editedObject.selectedFilters,
        // @ts-expect-error
        editedObject.instanceId
      ),
      importType: editedObject.importType,
      chosenObjectName: editedObject.chosenObjectName,
      objectWorkingId: editedObject.objectWorkingId,
      instanceId: editedObject.instanceId,
      promptsAnswers: currentAnswers || newPromptsAnswers.current,
      isPrompted: !!currentAnswers.length || !!newPromptsAnswers.current.length,
      subtotalsInfo: editedObject.subtotalsInfo,
      displayAttrFormNames: editedObject.displayAttrFormNames,
      pageByData: editedObject.pageByData,
      promptKeys,
      pageByConfigurations,
    });
  };
  /**
   * This function is called at the end of the Reprompt (only Reprompt, not Edit) workflow,
   * after user applies new answers. It will bypass the Edit Filters step and update the Excel data
   * with the newly-provided prompt answers. If any previous filters were applied to the imported Report,
   * they will be persisted.
   * @param {string} chosenObjectIdLocal - ID of the Report that was imported into Excel
   * @param {string} projectId - ID of the Project that the Report belongs to
   * @returns {void}
   */
  const finishRepromptWithoutEditFilters = useCallback(
    (chosenObjectIdLocal: string, projectId: string, dossierData: any, currentAnswers: any[]) => {
      // for the Reprompt workflow only, skip edit filter screen.
      if (!isReprompt || isEdit) {
        return;
      }

      if (editedObject.pageByData && pageByDisplaySetting === PageByDisplayType.SELECT_PAGES) {
        dialogViewSelectorHelper.handleRequestPageByModalOpen({
          ...props,
          objectId: chosenObjectIdLocal,
          projectId,
          dossierData,
          promptsAnswers: currentAnswers,
          importCallback: (pageByConfigurations: PageByConfiguration[][]) =>
            initializeImportForReprompt(chosenObjectIdLocal, projectId, pageByConfigurations),
        } as any);
      } else {
        initializeImportForReprompt(chosenObjectIdLocal, projectId, null, currentAnswers);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      editedObject.chosenObjectSubtype,
      editedObject.selectedAttributes,
      editedObject.selectedMetrics,
      editedObject.selectedFilters,
      editedObject.instanceId,
      editedObject.chosenObjectName,
      editedObject.subtotalsInfo,
      editedObject.displayAttrFormNames,
      isEdit,
      isReprompt,
    ]
  );

  /**
   *
   * @param {*} promptObjs - prompts from instance if the object is being imported otherwise from the object
   * reducer based on the condition checked in prompt-window's loadEmbeddedDossier: updatedPromptObjects
   * @param {*} previousAnswers - answers from the reducer
   * @param {*} shouldUseSavedPromptAnswers
   * @returns
   */
  const prepareAndHandlePromptAnswers = useCallback(
    (promptObjs: any, previousAnswers: any, shouldUseSavedPromptAnswers: boolean) => {
      if (shouldUseSavedPromptAnswers) {
        return prepareGivenPromptAnswers(promptObjs, previousAnswers);
      }
      if (mstrData.promptsAnswers?.length > 0) {
        return mstrData.promptsAnswers;
      }
      return editedObject.promptsAnswers;
    },
    [mstrData.promptsAnswers, editedObject.promptsAnswers]
  );

  const collectPromptKeys = (promptObjs: any[], keys: string[] = []): string[] => {
    promptObjs.forEach(promptObject => {
      if (!keys.includes(promptObject?.key)) {
        keys.push(promptObject?.key);
      }
    });
    return keys;
  };

  const loadEmbeddedDossier = useCallback(
    async (localContainer: any) => {
      const chosenObjectIdLocal = chosenObjectId || editedObject.chosenObjectId;
      const projectId = mstrData.chosenProjectId || editedObject.projectId;
      const { envUrl, authToken } = session;

      // Declared variables to determine whether importing a report/dossier is taking place and
      // whether there are previous prompt answers to handle
      const hasPreviousPromptAnswers = previousPromptsAnswers && previousPromptsAnswers.length > 0;
      const hasPromptObjects = promptObjects && promptObjects.length > 0;
      const hasImportOrPrepareDataRequest = importRequested || isPreparedDataRequested;

      const isImportOrPrepateWithPrevAnswers =
        hasImportOrPrepareDataRequest && hasPreviousPromptAnswers && hasPromptObjects;

      // Determine whether importing a report/dossier or preparing data on a report has previous answers
      // along with making sure re-use prompt answers setting is enabled and prompt objects are available
      const isImportingOrPreparingDataWithPreviousPromptAnswers =
        reusePromptAnswers && isImportOrPrepateWithPrevAnswers;

      try {
        let msgRouter: any = null;
        const serverURL = envUrl.slice(0, envUrl.lastIndexOf('/api'));
        // delete last occurence of '/api' from the enviroment url
        const { CustomAuthenticationType } = microstrategy.dossier;
        const { EventType } = microstrategy.dossier;

        const documentProps: any = {
          serverURL,
          applicationID: projectId,
          objectID: chosenObjectIdLocal,
          enableCustomAuthentication: true,
          customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
          enableResponsive: true,
          reportInLibraryFeature: { enabled: false },

          getLoginToken() {
            return Promise.resolve(authToken);
          },
          placeholder: localContainer,
          onMsgRouterReadyHandler: ({ MsgRouter }: any) => {
            msgRouter = MsgRouter;
            msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, promptAnsweredHandler);
            msgRouter.registerEventHandler(EventType.ON_PROMPT_LOADED, promptLoadedHandler);
            msgRouter.registerEventHandler(EventType.ON_ERROR, onEmbeddedError);
          },
        };
        let givenPromptsAnswers: any[];
        const allPromptKeys = collectPromptKeys(editedObject.promptsAnswers[0]?.answers);
        const areAllKeysPresent = allPromptKeys.every(key => promptKeys.includes(key));
        const openPromptDialog = !areAllKeysPresent && isMultipleRepromptWithReuse;
        // Replace the instance with the one from the prompt answers resolved for importing prompted report/dossier
        // or preparing data on a report if re-use prompt answers setting is enabled and there are previous prompt answers
        if (isReprompt || isImportOrPrepateWithPrevAnswers || isMultipleRepromptWithReuse) {
          // If it is multiple re-prompt, then we need to replaced edited report's answers in definition
          // with saved prompt answers if any.
          const answersFromEditedObject = editedObject.promptsAnswers?.[0]?.answers?.length
            ? editedObject.promptsAnswers[0].answers
            : [];
          const answersFromPromptObjects = promptObjects?.length > 0 ? promptObjects : [];
          const updatedPromptObjects = isMultipleRepromptWithReuse
            ? answersFromEditedObject
            : answersFromPromptObjects;
          // Update givenPromptsAnswers collection with previous prompt answers if importing
          // a report/dossier or preparing data on a report; and reusePromptAnswers flag is enabled.
          // Indicate to try to use saved prompt answers if any when multiple reprompt is in progress.
          givenPromptsAnswers = prepareAndHandlePromptAnswers(
            updatedPromptObjects,
            previousPromptsAnswers,
            isImportingOrPreparingDataWithPreviousPromptAnswers || isMultipleRepromptWithReuse
          );

          documentProps.instance = await preparePromptedReport(
            chosenObjectIdLocal,
            projectId,
            givenPromptsAnswers,
            previousPromptsAnswers,
            openPromptDialog
          );
        }

        microstrategy.dossier.create(documentProps).then(async (dossierPage: any) => {
          const [chapter, objectId, instanceId, visualizations] = await Promise.all([
            dossierPage?.getCurrentChapter(),
            dossierPage?.getDossierId(),
            dossierPage?.getDossierInstanceId(),
            dossierPage?.getCurrentPageVisualizationList(),
          ]);

          const dossierData = {
            chapterKey: chapter.nodeKey,
            dossierId: objectId,
            instanceId,
            visualizationKey: visualizations[0].key,
            isReprompt,
          };

          // Remove event handlers first.
          msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, promptAnsweredHandler);
          msgRouter.removeEventhandler(EventType.ON_PROMPT_LOADED, promptLoadedHandler);
          msgRouter.removeEventhandler(EventType.ON_ERROR, onEmbeddedError);
          // Get the new answers from the prompts dialog otherwise from the givenPromptsAnswers.
          const currentAnswers =
            [...newPromptsAnswers.current].length > 0
              ? [...newPromptsAnswers.current]
              : givenPromptsAnswers;

          deleteDossierInstance(projectId, objectId, instanceId);

          // dossierData should eventually be removed as data should be gathered via REST from report, not dossier
          promptsAnswered({ dossierData, promptsAnswers: currentAnswers });

          finishRepromptWithoutEditFilters(
            chosenObjectIdLocal,
            projectId,
            dossierData,
            currentAnswers
          );
        });
        // add keys to the promptKeys
        promptKeys.push(...allPromptKeys.filter(key => !promptKeys.includes(key)));
      } catch (error) {
        console.error({ error });
        dialogHelper.handlePopupErrors(error);
      }
    },
    [
      chosenObjectId,
      editedObject,
      mstrData.chosenProjectId,
      session,
      previousPromptsAnswers,
      promptObjects,
      importRequested,
      isPreparedDataRequested,
      reusePromptAnswers,
      isReprompt,
      isMultipleRepromptWithReuse,
      prepareAndHandlePromptAnswers,
      promptKeys,
      promptsAnswered,
      finishRepromptWithoutEditFilters,
    ]
  );

  /**
   * This should run the embedded dossier and pass instance ID to the plugin
   * Session status is checked, and log out is performed if session expired.
   */
  const handleRun = async (): Promise<void> => {
    try {
      await authenticationHelper.validateAuthToken();
      if (embeddedDocument) {
        const runButton = embeddedDocument.getElementsByClassName('mstrPromptEditorButtonRun')[0];
        if (runButton) {
          runButton.click();
        }
      }
    } catch (error) {
      dialogHelper.handlePopupErrors(error);
    }
  };

  /**
   * This function is called after a child (iframe) is added into mbedded dossier container
   */
  const onIframeLoad = (iframe: any): void => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      if (iframe.focusEventListenerAdded === false) {
        iframe.focusEventListenerAdded = true;
        iframe.addEventListener('focus', scriptInjectionHelper.switchFocusToElementOnWindowFocus);
      }
      setEmbeddedDocument(contentDocument);
      if (!scriptInjectionHelper.isLoginPage(contentDocument)) {
        scriptInjectionHelper.applyStyle(contentDocument, 'promptsWindow.css');
        scriptInjectionHelper.applyFile(contentDocument, 'javascript/embeddingsessionlib.js');
      }
    });
  };

  const onPromptsContainerMount = useCallback(
    async (localContainer: any) => {
      scriptInjectionHelper.watchForIframeAddition(localContainer, onIframeLoad);

      if (!microstrategy?.dossier) {
        console.warn(ErrorMessages.MICROSTRATEGY_API_MISSING);
        return;
      }

      await loadEmbeddedDossier(localContainer);
    },
    [loadEmbeddedDossier]
  );

  const handleBack = (): void => {
    cancelImportRequest();
    onPopupBack();
  };

  let objectName;

  if (editedObject?.pageByData) {
    objectName = editedObject.definition?.sourceName;
  } else {
    objectName = editedObject.chosenObjectName || chosenObjectName;
  }

  return (
    <div className='prompts-window'>
      <ObjectWindowTitle
        objectType={mstrObjectEnum.mstrObjectType.report.name}
        objectName={objectName}
        isReprompt={isReprompt}
        isEdit={isEdit}
        index={repromptsQueue.index}
        total={repromptsQueue.total}
      />
      <Spinner className='loading-spinner' type='large'>
        {t('Loading...')}
      </Spinner>
      <PromptsContainer postMount={onPromptsContainerMount} />
      <DialogButtons
        handleOk={handleRun}
        handleCancel={closePopup}
        hideSecondary
        handleBack={!isReprompt && handleBack}
        disableActiveActions={isPromptLoading}
      />
    </div>
  );
};

export const mapStateToProps = (state: RootState): any => {
  const {
    navigationTree,
    popupStateReducer,
    popupReducer,
    sessionReducer,
    officeReducer,
    answersReducer,
    repromptsQueueReducer,
  } = state;
  const popupState = popupReducer.editedObject;
  const {
    promptsAnswers,
    importSubtotal,
    importRequested,
    isPreparedDataRequested,
    promptObjects,
    ...mstrData
  } = navigationTree;
  const { answers } = answersReducer;
  const { supportForms, reusePromptAnswers } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport =
    popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const promptKeys = repromptsQueueSelector.selectPromptKeys(state); // Use the selector here

  // Check whether prepared data is requested for import and includes prompt objects
  const hasPreparedRequestPromptObjects =
    isPreparedDataRequested && popupStateReducer.isPrompted?.promptObjects?.length > 0;

  // Resolve prompt objects to be used, if prepared data is requested for import
  // and prompt objects are not included in the navigation tree state, then return
  // the prompt objects from the popup state reducer if any or empty array if none.
  const promptObjectsResolved =
    promptObjects ||
    (hasPreparedRequestPromptObjects ? popupStateReducer.isPrompted.promptObjects : []);

  return {
    // @ts-expect-error
    ...state.promptsPopup,
    mstrData,
    importSubtotal,
    editedObject: {
      ...dialogHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege),
    },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
    reusePromptAnswers,
    previousPromptsAnswers: answers,
    importRequested,
    importType: popupStateReducer.importType,
    promptObjects: promptObjectsResolved, // Prompt objects to be used for import
    isPreparedDataRequested, // State flag indicating whether prepared data is requested for import
    repromptsQueue: { ...repromptsQueueReducer },
    isMultipleRepromptWithReuse: reusePromptAnswers && repromptsQueueReducer.total > 1,
    promptKeys,
  };
};

const mapDispatchToProps = {
  promptsAnswered: navigationTreeActions.promptsAnswered,
  cancelImportRequest: navigationTreeActions.cancelImportRequest,
  onPopupBack: popupStateActions.onPopupBack,
  preparePromptedReport: popupActions.preparePromptedReport,
  requestPageByModalOpen: navigationTreeActions.requestPageByModalOpen,
  startImport: navigationTreeActions.startImport,
  setImportType: popupStateActions.setImportType,
};

export const PromptsWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromptsWindowNotConnected);
