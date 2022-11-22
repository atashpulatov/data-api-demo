import React, { Component } from 'react';
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

export class PromptsWindowNotConnected extends Component {
  constructor(props) {
    super(props);
    const { mstrData, popupState, editedObject } = props;
    this.state = {
      chosenObjectId: mstrData.chosenObjectId,
      loading: true,
      isReprompt: popupState.isReprompt,
      givenPromptsAnswers: mstrData.promptsAnswers || editedObject.promptsAnswers,
      newPromptsAnswers: [],
      isPromptLoading: true,
    };
    const { installSessionProlongingHandler } = sessionHelper;
    this.prolongSession = installSessionProlongingHandler(this.closePopup);
    this.container = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.messageReceived);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageReceived);
  }

  sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

  preparePromptedReport = async (chosenObjectId, projectId, promptsAnswers) => {
    const config = { objectId: chosenObjectId, projectId };
    const instanceDefinition = await createInstance(config);
    const { instanceId } = instanceDefinition;
    let dossierInstanceDefinition = await createDossierBasedOnReport(chosenObjectId, instanceId, projectId);
    if (dossierInstanceDefinition.status === 2) {
      dossierInstanceDefinition = await this.answerDossierPrompts(
        dossierInstanceDefinition,
        chosenObjectId,
        projectId,
        promptsAnswers
      );
    }

    dossierInstanceDefinition = await rePromptDossier(chosenObjectId, dossierInstanceDefinition, projectId);
    dossierInstanceDefinition.id = chosenObjectId;

    return dossierInstanceDefinition;
  }

  answerDossierPrompts = async (instanceDefinition, objectId, projectId, promptsAnswers) => {
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
          await this.sleep(1000);
          dossierStatusResponse = await getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);
        }
        currentInstanceDefinition = dossierStatusResponse.body;
      }
      count += 1;
    }
    return instanceId;
  }

  promptAnsweredHandler = (newAnswer) => {
    this.setState({ isPromptLoading: true });
    const { newPromptsAnswers } = this.state;
    if (newPromptsAnswers.length > 0) {
      const newArray = [...newPromptsAnswers, newAnswer];
      this.setState({ newPromptsAnswers: newArray });
    } else {
      this.setState({ newPromptsAnswers: [newAnswer] });
    }
  }

  promptLoadedHandler = () => {
    this.setState({ isPromptLoading: false });
  }

  loadEmbeddedDossier = async (container) => {
    const { loading, chosenObjectId, isReprompt } = this.state;
    if (!loading) {
      return;
    }
    const { givenPromptsAnswers } = this.state;
    const {
      promptsAnswered, mstrData, session, editedObject
    } = this.props;
    const chosenObjectIdLocal = chosenObjectId || editedObject.chosenObjectId;
    const projectId = mstrData.chosenProjectId || editedObject.projectId; // FIXME: potential problem with projectId
    const { envUrl, authToken } = session;

    let instanceDefinition;
    const instance = {};
    try {
      if (givenPromptsAnswers) {
        instanceDefinition = await this.preparePromptedReport(chosenObjectIdLocal, projectId, givenPromptsAnswers);
        instance.id = instanceDefinition && instanceDefinition.id; // '00000000000000000000000000000000';
        instance.mid = instanceDefinition && instanceDefinition.mid;
      }

      let msgRouter = null;
      const serverURL = envUrl.slice(0, envUrl.lastIndexOf('/api'));
      // delete last occurence of '/api' from the enviroment url
      const { CustomAuthenticationType } = microstrategy.dossier;
      const { EventType } = microstrategy.dossier;

      const props = {
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
        placeholder: container,
        onMsgRouterReadyHandler: ({ MsgRouter }) => {
          msgRouter = MsgRouter;
          msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, this.promptAnsweredHandler);
          msgRouter.registerEventHandler(EventType.ON_PROMPT_LOADED, this.promptLoadedHandler);

          // TODO: We should remember to unregister this handler once the page loads
        },
      };

      if (isReprompt) {
        props.instance = instance;
      }

      if (!microstrategy || !microstrategy.dossier) {
        console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment');
        return;
      }

      microstrategy.dossier
        .create(props)
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

          msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, this.promptAnsweredHandler);
          msgRouter.removeEventhandler(EventType.ON_PROMPT_LOADED, this.promptLoadedHandler);

          const { newPromptsAnswers } = this.state;
          // dossierData should eventually be removed as data should be gathered via REST from report, not dossier
          promptsAnswered({ dossierData, promptsAnswers: newPromptsAnswers });
        });
    } catch (error) {
      console.error({ error });
      popupHelper.handlePopupErrors(error);
    }
  }

  /**
   * This should run the embedded dossier and pass instance ID to the plugin
   * Session status is checked, and log out is performed if session expired.
   */
  handleRun = async () => {
    try {
      await authenticationHelper.validateAuthToken();
      if (this.embeddedDocument) {
        const runButton = this.embeddedDocument.getElementsByClassName('mstrPromptEditorButtonRun')[0];
        if (runButton) {
          runButton.click();
        }
      }
    } catch (error) {
      popupHelper.handlePopupErrors(error);
    }
  }

  closePopup = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  };

  /**
   * This function is called after a child (iframe) is added into mbedded dossier container
   */
  onIframeLoad = (iframe) => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      if (iframe.focusEventListenerAdded === false) {
        iframe.focusEventListenerAdded = true;
        iframe.addEventListener('focus', scriptInjectionHelper.switchFocusToElementOnWindowFocus);
      }
      this.embeddedDocument = contentDocument;
      if (!scriptInjectionHelper.isLoginPage(contentDocument)) {
        scriptInjectionHelper.applyStyle(contentDocument, 'promptsWindow.css');
        scriptInjectionHelper.applyFile(contentDocument, 'javascript/embeddingsessionlib.js');
      }
    });
  }

  messageReceived = (message = {}) => {
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
      this.prolongSession();
    }
  }

  onPromptsContainerMount = (container) => {
    scriptInjectionHelper.watchForIframeAddition(container, this.onIframeLoad);
    this.loadEmbeddedDossier(container);
  }

  handleBack = () => {
    const { cancelImportRequest, onPopupBack } = this.props;
    cancelImportRequest();
    onPopupBack();
  }

  render() {
    const { isReprompt, isPromptLoading } = this.state;
    return (
      <div
        style={{ position: 'relative' }}
      >
        <PromptsContainer
          postMount={this.onPromptsContainerMount}
        />
        <PopupButtons
          handleOk={this.handleRun}
          handleCancel={this.closePopup}
          hideSecondary
          handleBack={!isReprompt && this.handleBack}
          useImportAsRunButton
          disableActiveActions={isPromptLoading}
        />
      </div>
    );
  }
}

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
