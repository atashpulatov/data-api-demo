import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {PromptsContainer} from './prompts-container';
import {PromptWindowButtons} from './prompts-window-buttons';
import {actions} from '../navigation/navigation-tree-actions';
import {connect} from 'react-redux';
import {mstrObjectRestService} from '../mstr-object/mstr-object-rest-service';
import {selectorProperties} from '../attribute-selector/selector-properties';

const Office = window.Office;
const microstrategy = window.microstrategy;

export class _PromptsWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {
        USE_PROXY: false,
        url: this.props.mstrData.envUrl,
        authToken: this.props.mstrData.token,
        projectId: this.props.mstrData.projectId,
      },
      reportId: this.props.mstrData.reportId,
      triggerUpdate: false,
      loading: true,
      isReprompt: props.mstrData.isReprompt,
      promptsAnswers: props.mstrData.promptsAnswers,
      currentPageKey: '',
      dossierInstanceId: '',
      docId: '',
      // The one below is not needed, but can be useful if we need to ensure the sessionId and authToken match
      sessionId: '',
    };

    this.container = React.createRef();
    this.outerCont = React.createRef();
  }

  preparePromptedReportInstance = async (reportId, projectId, promptsAnswers) => {
    const instanceDefinition = await mstrObjectRestService.createInstance(reportId, projectId, true, null);
    let dossierInstanceDefinition = await mstrObjectRestService.createDossierBasedOnReport(reportId, instanceDefinition.instanceId, projectId);
    if (dossierInstanceDefinition.status === 2) {
      dossierInstanceDefinition = await this.answerDossierPrompts(dossierInstanceDefinition, reportId, projectId, promptsAnswers);
    }

    dossierInstanceDefinition = await mstrObjectRestService.rePromptDossier(reportId, dossierInstanceDefinition, projectId);
    dossierInstanceDefinition.id = reportId;

    return dossierInstanceDefinition;
  }

  answerDossierPrompts = async (instanceDefinition, objectId, projectId, promptsAnswers) => {
    const instanceId = instanceDefinition.mid;
    let count = 0;
    while (instanceDefinition.status === 2) {
      await mstrObjectRestService.answerDossierPrompts(objectId, projectId, instanceDefinition.mid, promptsAnswers[count]);
      instanceDefinition = await mstrObjectRestService.getDossierStatus(objectId, instanceDefinition.mid, projectId);
      count++;
    }
    return instanceId;
  }

  loadEmbeddedDossier = async (container) => {
    if (!this.state.loading) {
      return;
    }

    const {authToken, projectId} = this.state.session;
    const libraryUrl = this.state.session.url.replace('api', 'app');

    let instanceDefinition;
    const instance = {};
    if (this.state.isReprompt) {
      instanceDefinition = await this.preparePromptedReportInstance(this.state.reportId, projectId, this.state.promptsAnswers);
      instance.id = instanceDefinition.id; // '00000000000000000000000000000000';
      instance.mid = instanceDefinition.mid;
    }

    let msgRouter = null;
    let promptsAnswers = null;
    const promptsAnsweredHandler = function(_promptsAnswers) {
      if (!_promptsAnswers) {
        return;
      }
      if (promptsAnswers) {
        promptsAnswers.push(_promptsAnswers);
      } else {
        promptsAnswers = [_promptsAnswers];
      }
    };
    const url = `${libraryUrl}/${projectId}/${this.state.reportId}`;
    const CustomAuthenticationType = microstrategy.dossier.CustomAuthenticationType;
    const EventType = microstrategy.dossier.EventType;

    const props = {
      url: url,
      enableCustomAuthentication: true,
      customAuthenticationType:
        CustomAuthenticationType.AUTH_TOKEN,
      enableResponsive: true,

      getLoginToken: function() {
        return Promise.resolve(authToken);
      },
      placeholder: container,
      onMsgRouterReadyHandler: ({MsgRouter}) => {
        msgRouter = MsgRouter;
        msgRouter.registerEventHandler(
          EventType.ON_PROMPT_ANSWERED,
          promptsAnsweredHandler
        );
        // TODO: We should remember to unregister this handler once the page loads
      },
    };

    if (this.state.isReprompt) {
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
          instanceId: instanceId,
          visualizationKey: visuzalisations[0].key,
        };

        // Since the dossier is no needed anymore after intercepting promptsAnswers, we can try removing the instanace
        mstrObjectRestService.deleteDossierInstance(projectId, objectId, instanceId);

        msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, promptsAnsweredHandler);
        this.props.promptsAnswered({dossierData, promptsAnswers});// TEMP - dossierData should eventually be removed as data should be gathered via REST from report instance, not dossier
      });
  }

  /**
   * This should run the embedded dossier and pass instance ID to the plugin
   */
  handleRun = () => {
    if (this.embeddedDocument) {
      const runButton = this.embeddedDocument.getElementsByClassName('mstrPromptEditorButtonRun')[0];
      runButton && runButton.click();
    }
  }
  closePopup = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
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
          + window.location.pathname.replace('popup.html', 'promptsWindow.css');
        this.applyStyle(embeddedDocument, cssLocation);
      }
    });
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
    const config = {childList: true};
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
    return (
      <div
        style={{position: 'relative'}}
        ref={this.outerCont}
      >
        <PromptsContainer
          postMount={this.onPromptsContainerMount}
        />

        <div style={{position: 'absolute', bottom: '0'}}>
          <PromptWindowButtons
            handleBack={this.props.handleBack}
            handleRun={this.handleRun}
            isReprompt={this.state.isReprompt}
            closePopup={this.closePopup}
          />
        </div>
      </div>
    );
  };
}

export const mapStateToProps = (state) => {
  return {...state.promptsPopup};
};

export const PromptsWindow = connect(mapStateToProps, actions)(_PromptsWindow);

