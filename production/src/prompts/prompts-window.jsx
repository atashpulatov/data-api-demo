import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from '../embedded/utils/script-injection-helper';
import { selectorProperties } from '../attribute-selector/selector-properties';
import '../home/home.css';
import '../index.css';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { PromptsContainer } from './prompts-container';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { popupHelper } from '../popup/popup-helper';
import { sessionHelper, EXTEND_SESSION } from '../storage/session-helper';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';

const { microstrategy } = window;
const {
  createInstance,
  createDossierBasedOnReport,
  rePromptDossier,
  answerDossierPrompts,
  getDossierStatus,
  deleteDossierInstance,
} = mstrObjectRestService;
const postAnswerDossierPrompts = answerDossierPrompts;

export const PromptsWindowNotConnected = (props) => {
  const {
    mstrData, popupState, editedObject, promptsAnswered, session, cancelImportRequest, onPopupBack,
    previousPromptsAnswers, importRequested, promptObjects,
  } = props;
  const { chosenObjectId } = mstrData;
  const { isReprompt } = popupState;

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

  const reusePromptAnswers = true; // TODO: update with proper flag value
  let givenPromptsAnswers = mstrData.promptsAnswers || editedObject.promptsAnswers;
  const loading = true;

  // Declared variables to determine whether importing a report/dossier is taking place and
  // whether there are previous prompt answers to handle
  const areTherePreviousPromptAnswers = previousPromptsAnswers && previousPromptsAnswers.length;
  const isImportedObjectPrompted = promptObjects && promptObjects.length;
  const isEditedObjectPrompted = editedObject.promptsAnswers && editedObject.promptsAnswers.length;

  const isImportingWithPreviousPromptAnswers = importRequested && reusePromptAnswers
    && areTherePreviousPromptAnswers && isImportedObjectPrompted;
  // Update givenPromptsAnswers collection with previous prompt answers if importing a report/dossier
  if (isImportingWithPreviousPromptAnswers) {
    givenPromptsAnswers = [{ messageName: 'New Dossier', answers: [] }];
    previousPromptsAnswers.forEach((previousAnswer) => {
      const previousPromptIndex = promptObjects.findIndex(
        (promptObject) => promptObject && promptObject.key === previousAnswer.key
      );

      if (previousPromptIndex >= 0) {
        givenPromptsAnswers[0].answers.push(previousAnswer);
      }
    });
  }

  const isEditingWithPreviousPromptAnswers = isReprompt && reusePromptAnswers
  && areTherePreviousPromptAnswers && isEditedObjectPrompted;
  // Update givenPromptsAnswers collection with previous prompt answers if editing a report/dossier
  if (isEditingWithPreviousPromptAnswers) {
    if (givenPromptsAnswers && givenPromptsAnswers.length
        && givenPromptsAnswers[0].answers && givenPromptsAnswers[0].answers.length) {
      givenPromptsAnswers[0].answers = givenPromptsAnswers[0].answers.map(answer => {
        const matchingPreviousPromptAnswer = previousPromptsAnswers.find(
          previousAnswer => previousAnswer.key === answer.key
        );
        return matchingPreviousPromptAnswer || answer;
      });
    }
  }

  useEffect(() => {
    window.addEventListener('message', messageReceived);

    return (() => window.removeEventListener('message', messageReceived));
  }, [messageReceived]);

  const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

  const answerDossierPromptsHelper = useCallback(async (instanceDefinition, objectId, projectId, promptsAnswers) => {
    const instanceId = instanceDefinition.mid;
    let currentInstanceDefinition = instanceDefinition;
    let count = 0;
    while (currentInstanceDefinition.status === 2 && count < promptsAnswers.length) {
      const config = {
        objectId,
        projectId,
        instanceId: currentInstanceDefinition.mid,
        promptsAnswers: promptsAnswers[count]
      };
      await postAnswerDossierPrompts(config);
      if (count === promptsAnswers.length - 1) {
        let dossierStatusResponse = await getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);
        while (dossierStatusResponse.statusCode === 202) {
          await sleep(1000);
          dossierStatusResponse = await getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);
        }
        currentInstanceDefinition = dossierStatusResponse.body;
      }
      count += 1;
    }
    return instanceId;
  }, []);

  const preparePromptedReport = useCallback(async (chosenObjectIdLocal, projectId, promptsAnswers) => {
    const config = { objectId: chosenObjectIdLocal, projectId };
    const instanceDefinition = await createInstance(config);
    const { instanceId } = instanceDefinition;
    let dossierInstanceDefinition = await createDossierBasedOnReport(chosenObjectIdLocal, instanceId, projectId);
    if (dossierInstanceDefinition.status === 2) {
      dossierInstanceDefinition = await answerDossierPromptsHelper(
        dossierInstanceDefinition,
        chosenObjectIdLocal,
        projectId,
        promptsAnswers
      );
    }

    dossierInstanceDefinition = await rePromptDossier(chosenObjectIdLocal, dossierInstanceDefinition, projectId);
    dossierInstanceDefinition.id = chosenObjectIdLocal;

    return dossierInstanceDefinition;
  }, [answerDossierPromptsHelper]);

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

  const loadEmbeddedDossier = useCallback(async (localContainer) => {
    if (!loading) {
      return;
    }

    const chosenObjectIdLocal = chosenObjectId || editedObject.chosenObjectId;
    const projectId = mstrData.chosenProjectId || editedObject.projectId; // FIXME: potential problem with projectId
    const { envUrl, authToken } = session;

    let instanceDefinition;
    const instance = {};
    try {
      if (givenPromptsAnswers) {
        instanceDefinition = await preparePromptedReport(chosenObjectIdLocal, projectId, givenPromptsAnswers);
        instance.id = instanceDefinition && instanceDefinition.id; // '00000000000000000000000000000000';
        instance.mid = instanceDefinition && instanceDefinition.mid;
      }

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
      if (isReprompt || (importRequested && areTherePreviousPromptAnswers && isImportedObjectPrompted)) {
        documentProps.instance = instance;
      }

      if (!microstrategy || !microstrategy.dossier) {
        console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment');
        return;
      }

      microstrategy.dossier
        .create(documentProps)
        .then(async (dossierPage) => {
          const chapter = await dossierPage.getCurrentChapter();
          const objectId = await dossierPage.getDossierId();
          const instanceId = await dossierPage.getDossierInstanceId();
          const visuzalisations = await dossierPage.getCurrentPageVisualizationList();

          const dossierData = {
            chapterKey: chapter.nodeKey,
            dossierId: objectId,
            instanceId,
            visualizationKey: visuzalisations[0].key,
            isReprompt
          };

          // Since the dossier is no needed anymore after intercepting promptsAnswers, we can try removing the instanace
          deleteDossierInstance(projectId, objectId, instanceId);

          msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, promptAnsweredHandler);
          msgRouter.removeEventhandler(EventType.ON_PROMPT_LOADED, promptLoadedHandler);

          // dossierData should eventually be removed as data should be gathered via REST from report, not dossier
          promptsAnswered({ dossierData, promptsAnswers: newPromptsAnswers.current });
        });
    } catch (error) {
      console.error({ error });
      popupHelper.handlePopupErrors(error);
    }
  }, [chosenObjectId, editedObject.chosenObjectId, editedObject.projectId, givenPromptsAnswers,
    isReprompt, loading, mstrData.chosenProjectId, preparePromptedReport, promptsAnswered, session,
    areTherePreviousPromptAnswers, importRequested, isImportedObjectPrompted]);

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
    await loadEmbeddedDossier(localContainer);
  }, [loadEmbeddedDossier]);

  const handleBack = () => {
    cancelImportRequest();
    onPopupBack();
  };

  return (
    <div
      style={{ position: 'relative' }}
    >
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
  }),
  session: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
  }),
  editedObject: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projectId: PropTypes.string,
    promptsAnswers: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  previousPromptsAnswers: PropTypes.arrayOf(PropTypes.shape({})),
  importRequested: PropTypes.bool,
  promptObjects: PropTypes.arrayOf(PropTypes.shape({})),
};

export const mapStateToProps = (state) => {
  const {
    navigationTree, popupStateReducer, popupReducer, sessionReducer, officeReducer, answersReducer
  } = state;
  const popupState = popupReducer.editedObject;
  const {
    promptsAnswers, importSubtotal, importRequested, promptObjects, ...mstrData
  } = navigationTree;
  const { answers } = answersReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport = popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    ...state.promptsPopup,
    mstrData,
    importSubtotal,
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege)) },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
    previousPromptsAnswers: answers,
    importRequested,
    promptObjects,
  };
};

const mapDispatchToProps = {
  promptsAnswered: navigationTreeActions.promptsAnswered,
  cancelImportRequest: navigationTreeActions.cancelImportRequest,
  onPopupBack: popupStateActions.onPopupBack,
};

export const PromptsWindow = connect(mapStateToProps, mapDispatchToProps)(PromptsWindowNotConnected);
