import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Empty } from '@mstr/connector-components/lib/empty/empty';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from '../embedded/utils/script-injection-helper';
import { selectorProperties } from '../attribute-selector/selector-properties';
import '../home/home.css';
import '../index.css';
import './prompts-window.scss';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { PromptsContainer } from './prompts-container';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { popupHelper } from '../popup/popup-helper';
import { popupViewSelectorHelper } from '../popup/popup-view-selector-helper';
import { sessionHelper, EXTEND_SESSION } from '../storage/session-helper';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { prepareGivenPromptAnswers, preparePromptedReport, mergeAnswersWithPromptsDefined } from '../helpers/prompts-handling-helper';
import { PromptsWindowTitle } from './prompts-window-title';

const { microstrategy } = window;
const { deleteDossierInstance } = mstrObjectRestService;

export const PromptsWindowNotConnected = (props) => {
  const {
    mstrData, popupState, editedObject, promptsAnswered, session, cancelImportRequest, onPopupBack,
    reusePromptAnswers, previousPromptsAnswers, importRequested, promptObjects, isPreparedDataRequested, repromptsQueue,
    isMultipleRepromptWithReuse,
  } = props;
  const { chosenObjectId } = mstrData;
  // isReprompt will be true for both Edit AND Reprompt workflows
  // isEdit will only be true for the Edit workflow
  const { isReprompt, isEdit } = popupState;

  const { installSessionProlongingHandler } = sessionHelper;

  const newPromptsAnswers = useRef([]);
  const [isPromptLoading, setIsPromptLoading] = useState(true);
  const [embeddedDocument, setEmbeddedDocument] = useState(null);

  const closePopup = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  };

  const prolongSession = installSessionProlongingHandler(closePopup);

  const messageReceived = useCallback((message = {}) => {
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
            message: message.data.value.message
          }),
        }
      };
      popupHelper.handlePopupErrors(newErrorObject);
    }
    const { data: postMessage, origin } = message;
    const { origin: targetOrigin } = window;
    if (origin === targetOrigin && postMessage === EXTEND_SESSION) {
      prolongSession();
    }
  }, [prolongSession]);

  useEffect(() => {
    window.addEventListener('message', messageReceived);

    return (() => window.removeEventListener('message', messageReceived));
  }, [messageReceived]);

  const promptAnsweredHandler = (newAnswer) => {
    setIsPromptLoading(true);
    if (newPromptsAnswers.current.length > 0) {
      const newArray = [...newPromptsAnswers.current, newAnswer];
      newPromptsAnswers.current = newArray;
    } else {
      newPromptsAnswers.current = [newAnswer];
    }
  };

  const promptLoadedHandler = () => {
    setIsPromptLoading(false);
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
  const finishRepromptWithoutEditFilters = useCallback((chosenObjectIdLocal, projectId) => {
    // for the Reprompt workflow only, skip edit filter screen.
    if (!isReprompt || isEdit) {
      return;
    }

    popupHelper.officeMessageParent({
      command: selectorProperties.commandOnUpdate,
      chosenObjectId: chosenObjectIdLocal,
      projectId,
      chosenObjectSubtype: editedObject.chosenObjectSubtype,
      body: popupViewSelectorHelper.createBody(
        editedObject.selectedAttributes, editedObject.selectedMetrics,
        editedObject.selectedFilters, editedObject.instanceId
      ),
      chosenObjectName: editedObject.chosenObjectName,
      instanceId: editedObject.instanceId,
      promptsAnswers: newPromptsAnswers.current,
      isPrompted: !!newPromptsAnswers.current.length,
      subtotalsInfo: editedObject.subtotalsInfo,
      displayAttrFormNames: editedObject.displayAttrFormNames
    });
  }, [editedObject.chosenObjectSubtype, editedObject.selectedAttributes, editedObject.selectedMetrics,
    editedObject.selectedFilters, editedObject.instanceId, editedObject.chosenObjectName,
    editedObject.subtotalsInfo, editedObject.displayAttrFormNames, isEdit, isReprompt]);

  /**
   *
   * @param {*} promptObjs
   * @param {*} previousAnswers
   * @param {*} shouldUseSavedPromptAnswers
   * @returns
   */
  const prepareAndHandlePromptAnswers = useCallback(
    (promptObjs, previousAnswers, shouldUseSavedPromptAnswers) => {
      if (shouldUseSavedPromptAnswers) {
        return prepareGivenPromptAnswers(promptObjs, previousAnswers);
      }

      return mstrData.promptsAnswers || editedObject.promptsAnswers;
    }, [mstrData.promptsAnswers, editedObject.promptsAnswers]
  );

  const loadEmbeddedDossier = useCallback(async (localContainer) => {
    const chosenObjectIdLocal = chosenObjectId || editedObject.chosenObjectId;
    const projectId = mstrData.chosenProjectId || editedObject.projectId; // FIXME: potential problem with projectId
    const { envUrl, authToken } = session;

    // Declared variables to determine whether importing a report/dossier is taking place and
    // whether there are previous prompt answers to handle
    const hasPreviousPromptAnswers = previousPromptsAnswers && previousPromptsAnswers.length > 0;
    const hasPromptObjects = promptObjects && promptObjects.length > 0;
    const hasImportOrPrepareDataRequest = importRequested || isPreparedDataRequested;

    const isImportOrPrepateWithPrevAnswers = hasImportOrPrepareDataRequest
    && hasPreviousPromptAnswers && hasPromptObjects;

    // Determine whether importing a report/dossier or preparing data on a report has previous answers
    // along with making sure re-use prompt answers setting is enabled and prompt objects are available
    const isImportingOrPreparingDataWithPreviousPromptAnswers = reusePromptAnswers
      && isImportOrPrepateWithPrevAnswers;

    try {
      let msgRouter = null;
      const serverURL = envUrl.slice(0, envUrl.lastIndexOf('/api'));
      // delete last occurence of '/api' from the enviroment url
      const { CustomAuthenticationType } = microstrategy.dossier;
      const { EventType } = microstrategy.dossier;

      const documentProps = {
        serverURL,
        applicationID: projectId,
        objectID: chosenObjectIdLocal,
        enableCustomAuthentication: true,
        customAuthenticationType:
          CustomAuthenticationType.AUTH_TOKEN,
        enableResponsive: true,
        reportInLibraryFeature: { enabled: false },

        getLoginToken() {
          return Promise.resolve(authToken);
        },
        placeholder: localContainer,
        onMsgRouterReadyHandler: ({ MsgRouter }) => {
          msgRouter = MsgRouter;
          msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, promptAnsweredHandler);
          msgRouter.registerEventHandler(EventType.ON_PROMPT_LOADED, promptLoadedHandler);

          // TODO: We should remember to unregister this handler once the page loads
        },
      };

      // Replace the instance with the one from the prompt answers resolved for importing prompted report/dossier
      // or preparing data on a report if re-use prompt answers setting is enabled and there are previous prompt answers
      if (isReprompt || isImportOrPrepateWithPrevAnswers || isMultipleRepromptWithReuse) {
        // If it is multiple re-prompt, then we need to replaced edited report's answers in definition
        // with saved prompt answers if any.
        const updatedPromptObjects = isMultipleRepromptWithReuse ? editedObject.promptsAnswers[0].answers
          : promptObjects;

        // Update givenPromptsAnswers collection with previous prompt answers if importing
        // a report/dossier or preparing data on a report; and reusePromptAnswers flag is enabled.
        // Indicate to try to use saved prompt answers if any when multiple reprompt is in progress.
        const givenPromptsAnswers = prepareAndHandlePromptAnswers(
          updatedPromptObjects, previousPromptsAnswers,
          isImportingOrPreparingDataWithPreviousPromptAnswers || isMultipleRepromptWithReuse
        );

        documentProps.instance = await preparePromptedReport(chosenObjectIdLocal, projectId, givenPromptsAnswers);
      }

      microstrategy.dossier
        .create(documentProps)
        .then(async (dossierPage) => {
          const [chapter, objectId, instanceId, visualizations] = await Promise.all([
            dossierPage.getCurrentChapter(),
            dossierPage.getDossierId(),
            dossierPage.getDossierInstanceId(),
            dossierPage.getCurrentPageVisualizationList(),
          ]);

          const dossierData = {
            chapterKey: chapter.nodeKey,
            dossierId: objectId,
            instanceId,
            visualizationKey: visualizations[0].key,
            isReprompt
          };

          // Remove event handlers first.
          msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, promptAnsweredHandler);
          msgRouter.removeEventhandler(EventType.ON_PROMPT_LOADED, promptLoadedHandler);

          // Get the new answers from the prompts dialog.
          const currentAnswers = [...newPromptsAnswers.current];

          // Update answers based on promptsAnsDef to insert JSON answers from server
          // this JSON structure is expected by the REST API endpoint; answers are deeper in the structure
          // than Dossiers.
          await mergeAnswersWithPromptsDefined(objectId, projectId, dossierData.instanceId, currentAnswers);

          // Since the dossier is no needed anymore after intercepting promptsAnswers, we can try removing the instanace
          deleteDossierInstance(projectId, objectId, instanceId);

          // dossierData should eventually be removed as data should be gathered via REST from report, not dossier
          promptsAnswered({ dossierData, promptsAnswers: currentAnswers });

          finishRepromptWithoutEditFilters(chosenObjectIdLocal, projectId);
        });
    } catch (error) {
      console.error({ error });
      popupHelper.handlePopupErrors(error);
    }
  }, [chosenObjectId, editedObject.chosenObjectId, editedObject.projectId,
    isReprompt, mstrData.chosenProjectId, promptsAnswered, prepareAndHandlePromptAnswers,
    session, importRequested, previousPromptsAnswers, promptObjects, reusePromptAnswers,
    finishRepromptWithoutEditFilters, isPreparedDataRequested, isMultipleRepromptWithReuse,
    editedObject.promptsAnswers]);

  /**
   * This should run the embedded dossier and pass instance ID to the plugin
   * Session status is checked, and log out is performed if session expired.
   */
  const handleRun = async () => {
    try {
      await authenticationHelper.validateAuthToken();
      if (embeddedDocument) {
        const runButton = embeddedDocument.getElementsByClassName('mstrPromptEditorButtonRun')[0];
        if (runButton) {
          runButton.click();
        }
      }
    } catch (error) {
      popupHelper.handlePopupErrors(error);
    }
  };

  /**
   * This function is called after a child (iframe) is added into mbedded dossier container
   */
  const onIframeLoad = (iframe) => {
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

  const onPromptsContainerMount = useCallback(async (localContainer) => {
    scriptInjectionHelper.watchForIframeAddition(localContainer, onIframeLoad);

    if (!microstrategy || !microstrategy.dossier) {
      console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment.');
      return;
    }

    await loadEmbeddedDossier(localContainer);
  }, [loadEmbeddedDossier]);

  const handleBack = () => {
    cancelImportRequest();
    onPopupBack();
  };

  // Determine whether Re-prompt title should be shown if queue has more than one item
  const showRepromptTitle = isReprompt && isMultipleRepromptWithReuse;
  const editedObjectName = editedObject.chosenObjectName;

  return (
    <div className="prompts-window">
      <PromptsWindowTitle
        showTitle={showRepromptTitle}
        objectName={editedObjectName}
      />
      <Empty isLoading />
      <PromptsContainer
        postMount={onPromptsContainerMount}
      />
      <PopupButtons
        handleOk={handleRun}
        handleCancel={closePopup}
        hideSecondary
        handleBack={!isReprompt && handleBack}
        useImportAsRunButton
        disableActiveActions={isPromptLoading}
      />
    </div>
  );
};

PromptsWindowNotConnected.propTypes = {
  promptsAnswered: PropTypes.func,
  cancelImportRequest: PropTypes.func,
  onPopupBack: PropTypes.func,
  mstrData: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    chosenProjectId: PropTypes.string,
    promptsAnswers: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  popupState: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    isReprompt: PropTypes.bool,
    isEdit: PropTypes.bool
  }),
  session: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
  }),
  editedObject: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projectId: PropTypes.string,
    promptsAnswers: PropTypes.arrayOf(PropTypes.shape({ answers: PropTypes.arrayOf(PropTypes.shape({})), })),
    chosenObjectSubtype: PropTypes.number,
    chosenObjectName: PropTypes.string,
    instanceId: PropTypes.string,
    subtotalsInfo: PropTypes.shape({ subtotalsAddresses: PropTypes.arrayOf(PropTypes.shape({})) }),
    displayAttrFormNames: PropTypes.string,
    selectedAttributes: PropTypes.arrayOf(PropTypes.string),
    selectedMetrics: PropTypes.arrayOf(PropTypes.string),
    selectedFilters: PropTypes.shape({}) || PropTypes.arrayOf(PropTypes.shape({})),
  }),
  reusePromptAnswers: PropTypes.bool,
  previousPromptsAnswers: PropTypes.arrayOf(PropTypes.shape({})),
  importRequested: PropTypes.bool,
  isPreparedDataRequested: PropTypes.bool,
  promptObjects: PropTypes.arrayOf(PropTypes.shape({})),
  repromptsQueue: PropTypes.shape({
    total: PropTypes.number,
    index: PropTypes.number,
  }),
  isMultipleRepromptWithReuse: PropTypes.bool,
};

export const mapStateToProps = (state) => {
  const {
    navigationTree, popupStateReducer, popupReducer, sessionReducer, officeReducer,
    answersReducer, repromptsQueueReducer,
  } = state;
  const popupState = popupReducer.editedObject;
  const {
    promptsAnswers, importSubtotal, importRequested, isPreparedDataRequested,
    promptObjects, ...mstrData
  } = navigationTree;
  const { answers } = answersReducer;
  const { supportForms, reusePromptAnswers } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport = popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;

  // Check whether prepared data is requested for import and includes prompt objects
  const hasPreparedRequestPromptObjects = (isPreparedDataRequested
    && popupStateReducer.isPrompted?.promptObjects?.length > 0);

  // Resolve prompt objects to be used, if prepared data is requested for import
  // and prompt objects are not included in the navigation tree state, then return
  // the prompt objects from the popup state reducer if any or empty array if none.
  const promptObjectsResolved = promptObjects
  || (hasPreparedRequestPromptObjects ? popupStateReducer.isPrompted.promptObjects : []);

  return {
    ...state.promptsPopup,
    mstrData,
    importSubtotal,
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege)) },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
    reusePromptAnswers,
    previousPromptsAnswers: answers,
    importRequested,
    promptObjects: promptObjectsResolved, // Prompt objects to be used for import
    isPreparedDataRequested, // State flag indicating whether prepared data is requested for import
    repromptsQueue: { ...repromptsQueueReducer },
    isMultipleRepromptWithReuse: reusePromptAnswers && repromptsQueueReducer.total > 1,
  };
};

const mapDispatchToProps = {
  promptsAnswered: navigationTreeActions.promptsAnswered,
  cancelImportRequest: navigationTreeActions.cancelImportRequest,
  onPopupBack: popupStateActions.onPopupBack,
};

export const PromptsWindow = connect(mapStateToProps, mapDispatchToProps)(PromptsWindowNotConnected);
