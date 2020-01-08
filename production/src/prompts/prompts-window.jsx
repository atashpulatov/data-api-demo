import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectorProperties } from '../attribute-selector/selector-properties';
import '../home/home.css';
import '../index.css';
import { actions } from '../navigation/navigation-tree-actions';
import { PromptsContainer } from './prompts-container';
import { PromptWindowButtons } from './prompts-window-buttons';
import { notificationService } from '../notification/notification-service';
import { Notifications } from '../notification/notifications';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { popupStateActions } from '../popup/popup-state-actions';
import { popupHelper } from '../popup/popup-helper';

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

export class _PromptsWindow extends Component {
  constructor(props) {
    super(props);
    const { mstrData } = props;
    this.state = {
      chosenObjectId: mstrData.chosenObjectId,
      loading: true,
      isReprompt: mstrData.isReprompt,
      promptsAnswers: mstrData.promptsAnswers,
    };

    this.container = React.createRef();
    this.outerCont = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.messageReceived);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageReceived);
  }

  sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

  preparePromptedReportInstance = async (chosenObjectId, projectId, promptsAnswers) => {
    const config = { objectId: chosenObjectId, projectId };
    const instanceDefinition = await createInstance(config);
    let dossierInstanceDefinition = await createDossierBasedOnReport(chosenObjectId, instanceDefinition.instanceId, projectId);
    if (dossierInstanceDefinition.status === 2) {
      dossierInstanceDefinition = await this.answerDossierPrompts(dossierInstanceDefinition, chosenObjectId, projectId, promptsAnswers);
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
      const config = { objectId, projectId, instanceId: currentInstanceDefinition.mid, promptsAnswers: promptsAnswers[count] };
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

  loadEmbeddedDossier = async (container) => {
    const { loading, chosenObjectId, isReprompt } = this.state;
    if (!loading) {
      return;
    }
    let { promptsAnswers } = this.state;
    const { promptsAnswered, mstrData } = this.props;
    const { envUrl, authToken, projectId } = mstrData;
    console.log('loadEmbeddedDossier');
    console.log({ props: this.props });

    let instanceDefinition;
    const instance = {};
    try {
      if (isReprompt) {
        instanceDefinition = await this.preparePromptedReportInstance(chosenObjectId, projectId, promptsAnswers);
        instance.id = instanceDefinition && instanceDefinition.id; // '00000000000000000000000000000000';
        instance.mid = instanceDefinition && instanceDefinition.mid;
      }

      let msgRouter = null;
      promptsAnswers = null;
      const promptsAnsweredHandler = function promptsAnswerFn(_promptsAnswers) {
        if (!_promptsAnswers) {
          return;
        }
        if (promptsAnswers) {
          promptsAnswers.push(_promptsAnswers);
        } else {
          promptsAnswers = [_promptsAnswers];
        }
      };
      const libraryUrl = envUrl.replace('api', 'app');
      const url = `${libraryUrl}/${projectId}/${chosenObjectId}`;
      const { CustomAuthenticationType } = microstrategy.dossier;
      const { EventType } = microstrategy.dossier;

      const props = {
        url,
        enableCustomAuthentication: true,
        customAuthenticationType:
          CustomAuthenticationType.AUTH_TOKEN,
        enableResponsive: true,

        getLoginToken() {
          return Promise.resolve(authToken);
        },
        placeholder: container,
        onMsgRouterReadyHandler: ({ MsgRouter }) => {
          msgRouter = MsgRouter;
          msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, promptsAnsweredHandler);
          // TODO: We should remember to unregister this handler once the page loads
        },
      };

      if (isReprompt) {
        props.instance = instance;
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

          msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, promptsAnsweredHandler);
          promptsAnswered({ dossierData, promptsAnswers });// TEMP - dossierData should eventually be removed as data should be gathered via REST from report instance, not dossier
        });
    } catch (error) {
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
    const { stopLoading } = this.props;
    stopLoading();
    const cancelObject = { command: selectorProperties.commandCancel };
    window.Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  /**
   * This function applies an external css file to a document
   */
  applyStyle = (_document, styleSheetLocation) => {
    const cssLink = document.createElement('link');
    cssLink.href = styleSheetLocation;
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    if (_document) {
      _document.head.appendChild(cssLink);
    }
  }

  /**
   * This function returns false if a document is login page and true otherwise
   */
  isLoginPage = (document) => document.URL.includes('embeddedLogin.jsp');

  /**
   * This function is called after a child (iframe) is added into mbedded dossier container
   */
  onIframeLoad = (iframe) => {
    iframe.addEventListener('load', () => {
      const embeddedDocument = iframe.contentDocument;
      this.embeddedDocument = embeddedDocument;
      if (!this.isLoginPage(embeddedDocument)) {
        const cssLocation = window.location.origin
          + window.location.pathname.replace('index.html', 'promptsWindow.css');
        this.applyStyle(embeddedDocument, cssLocation);
      }
    });
  };

  messageReceived = (message = {}) => {
    if (message.data && message.data.value && message.data.value.iServerErrorCode) {
      notificationService.displayNotification({ type: 'warning', content: 'This object cannot be imported.', details: message.data.value.message });
    }
  };

  onPromptsContainerMount = (container) => {
    this.watchForIframeAddition(container, this.onIframeLoad);
    this.loadEmbeddedDossier(container);
  };

  /**
   * Watches container for child addition and runs callback in case an iframe was added
   * @param {*} container
   * @param {*} callback
   */
  watchForIframeAddition(container, callback) {
    const config = { childList: true };
    const onMutation = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.addedNodes && mutation.addedNodes.length && mutation.addedNodes[0].nodeName === 'IFRAME') {
          const iframe = mutation.addedNodes[0];
          callback(iframe);
        }
      }
    };
    const observer = new MutationObserver(onMutation);
    observer.observe(container, config);
  }

  render() {
    console.log('in render');
    console.log({ props: this.props, state:this.state });
    const { isReprompt } = this.state;
    return (
      <div
        style={{ position: 'relative' }}
        ref={this.outerCont}
      >
        <Notifications />
        <PromptsContainer
          postMount={this.onPromptsContainerMount}
        />

        <div style={{ position: 'absolute', bottom: '0' }}>
          <PromptWindowButtons
            handleRun={this.handleRun}
            isReprompt={isReprompt}
            closePopup={this.closePopup}
          />
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  const { navigationTree, popupStateReducer, popupReducer, sessionReducer } = state;
  const popupState = popupReducer.editedObject;
  const { promptsAnswers, importSubtotal, ...mstrData } = navigationTree;
  return {
    ...state.promptsPopup,
    mstrData,
    importSubtotal,
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers)) },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
  };
};

const mapDispatchToProps = { ...actions, };

export const PromptsWindow = connect(mapStateToProps, mapDispatchToProps)(_PromptsWindow);
