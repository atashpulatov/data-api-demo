import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from '../dossier/script-injection-helper';
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
    mstrData, popupState, editedObject, promptsAnswered, session, cancelImportRequest, onPopupBack
  } = props;
  const { installSessionProlongingHandler } = sessionHelper;

  const [chosenObjectId, setChosenObjectId] = useState(mstrData.chosenObjectId);
  const [loading, setLoading] = useState(false);
  const [isReprompt, setIsReprompt] = useState(popupState.isReprompt);
  const [givenPromptsAnswers, setGivenPromptsAnswers] = useState(mstrData.promptsAnswers || editedObject.promptsAnswers);
  const [newPromptsAnswers, setNewPromptsAnswers] = useState([]);
  const [isPromptLoading, setIsPromptLoading] = useState(true);
  const [embeddedDocument, setEmbeddedDocument] = useState(null);

  const prolongSession = installSessionProlongingHandler(closePopup);
  const container = useRef(null);

  useEffect(() => {
    window.addEventListener('message', messageReceived);

    return (() => window.removeEventListener('message', messageReceived));
  }, [messageReceived]);

  const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

  const preparePromptedReport = async (chosenObjectIdLocal, projectId, promptsAnswers) => {
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
  };

  const answerDossierPromptsHelper = async (instanceDefinition, objectId, projectId, promptsAnswers) => {
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
  };

  const promptAnsweredHandler = (newAnswer) => {
    setIsPromptLoading(true);
    if (newPromptsAnswers.length > 0) {
      const newArray = [...newPromptsAnswers, newAnswer];
      setNewPromptsAnswers(newArray);
    } else {
      setNewPromptsAnswers([newAnswer]);
    }
  };

  const promptLoadedHandler = () => {
    setIsPromptLoading(false);
  };

  const loadEmbeddedDossier = async (localContainer) => {
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

      const props2 = {
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

      if (isReprompt) {
        props2.instance = instance;
      }

      if (!microstrategy || !microstrategy.dossier) {
        console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment');
        return;
      }

      microstrategy.dossier
        .create(props2)
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
          promptsAnswered({ dossierData, promptsAnswers: newPromptsAnswers });
        });
    } catch (error) {
      console.error({ error });
      popupHelper.handlePopupErrors(error);
    }
  };

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

  const closePopup = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
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

  const onPromptsContainerMount = (localContainer) => {
    scriptInjectionHelper.watchForIframeAddition(localContainer, onIframeLoad);
    loadEmbeddedDossier(localContainer);
  };

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
};

export const mapStateToProps = (state) => {
  const {
    navigationTree, popupStateReducer, popupReducer, sessionReducer, officeReducer
  } = state;
  const popupState = popupReducer.editedObject;
  const { promptsAnswers, importSubtotal, ...mstrData } = navigationTree;
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
  };
};

const mapDispatchToProps = {
  promptsAnswered: navigationTreeActions.promptsAnswered,
  cancelImportRequest: navigationTreeActions.cancelImportRequest,
  onPopupBack: popupStateActions.onPopupBack,
};

export const PromptsWindow = connect(mapStateToProps, mapDispatchToProps)(PromptsWindowNotConnected);
