/* eslint-disable no-undef */
/* eslint-disable valid-jsdoc */
import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {PromptsContainer} from './prompts-container';
import {PromptWindowButtons} from './prompts-window-buttons';
import {actions} from '../navigation/navigation-tree-actions';
import {connect} from 'react-redux';

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
      currentPageKey: '',
      dossierInstanceId: '',
      docId: '',
      // The one below is not needed, but can be useful if we need to ensure the sessionId and authToken match
      sessionId: '',
    };

    this.container = React.createRef();
    this.outerCont = React.createRef();
  }

    loadEmbeddedDossier = (container) => {
      if (!this.state.loading) {
        return;
      }

      const {authToken, projectId} = this.state.session;
      const libraryUrl = this.state.session.url.replace('api', 'app');

      let msgRouter = null;
      let promptAnswers = null;
      const promptAnsweredHandler = function(_promptAnswers) {
        if (!_promptAnswers) {
          return;
        }
        if (promptAnswers) {
          promptAnswers.push(_promptAnswers);
        } else {
          promptAnswers = [_promptAnswers];
        }
      };
      const url = `${libraryUrl}/${projectId}/${this.state.reportId}`;
      const CustomAuthenticationType = microstrategy.dossier.CustomAuthenticationType;
      const EventType = microstrategy.dossier.EventType;

      microstrategy.dossier
          .create({
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
                  promptAnsweredHandler
              );
              // We should remember to unregister this handler once the page loads
            },
          })
          .then(async (dossierPage) => {
            const chapter = await dossierPage.getCurrentChapter();
            const docId = await dossierPage.getDossierId();
            const dossierInstanceId = await dossierPage.getDossierInstanceId();
            const visuzalisations = await dossierPage.getCurrentPageVisualizationList();

            const dossierData = {
              chapterKey: chapter.nodeKey,
              dossierId: docId,
              instanceId: dossierInstanceId,
              visualizationKey: visuzalisations[0].key,
            };

            msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, promptAnsweredHandler);

            this.props.requestImport({dossierData, promptAnswers});// TEMP - dossierData should eventually be removed as data should be gathered via REST from report instance, not dossier
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
              handleRun={this.handleRun} />
          </div>
        </div>
      );
    };
}

export const mapStateToProps = (state) => {
  return {...state.promptsPopup};
};

export const PromptsWindow = connect(mapStateToProps, actions)(_PromptsWindow);
