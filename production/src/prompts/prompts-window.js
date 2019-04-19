/* eslint-disable */
import React, { Component } from 'react';
import '../index.css';
import '../home/home.css';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { WatchForChildrenAddition } from 'react-mutation-observer';
import { PromptsContainer } from './prompts-container';
import { PromptWindowButtons } from './prompts-window-buttons';
import { actions } from '../navigation/navigation-tree-actions';
import { connect } from 'react-redux';
/* eslint-enable */

export class _PromptsWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: {
                USE_PROXY: false,
                url: this.props.parsed.envUrl,
                authToken: this.props.parsed.token,
                projectId: this.props.parsed.projectId,
            },
            reportId: this.props.parsed.reportId,
            triggerUpdate: false,
            loading: true,
            currentPageKey: '',
            dossierInstanceId: '',
            docId: '',
            // The one below is not needed, but can be useful if we need to ensure the sessionId and authToken match
            sessionId: ''
        };

        this.container = React.createRef();
        this.outerCont = React.createRef();
    }    

    loadEmbeddedDossier = async (container) => {
        if (!this.state.loading){
            return;
        }
        const { authToken, projectId } = this.state.session;
        //const container = this.container.current;
        const url = `https://localhost:8443/consume/app/${projectId}/${this.state.reportId}`;
        const CustomAuthenticationType = microstrategy.dossier.CustomAuthenticationType;

        microstrategy.dossier.create({
            url: url,
            enableCustomAuthentication: true,
            customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
            enableResponsive: true,
            // Following function is our default implementation, user could provide his/her own implementation
            getLoginToken: function () {
                return Promise.resolve(authToken);
            },
            placeholder: container
        }).then((dossierPageState) => {
            // TODO: Check if there is a better api call for the currentPageKey
            //const currentPageKey = dossierPageState.children[0].getCurrentPage().nodeKey;
            
            //const docId = dossierPageState.getDocId();
            const dossierInstanceId = dossierPageState.getDossierInstanceId()

            const data = {
                instanceId: dossierInstanceId
            }

            this.props.requestImport(data);
        });     
    }

    /**
     * This should run the embedded dossier and pass instance ID to the plugin
     */
    handleRun = () => {
        this.setState({ triggerUpdate: true, loading: true });
        const okObject = {
            command: selectorProperties.commandOk,
            // body,
            instanceId: this.state.dossierInstanceId,
            objectId: this.state.reportId,
            docId: this.state.docId,
            currentPageKey: this.state.currentPageKey
        };
        Office.context.ui.messageParent(JSON.stringify(okObject));
    }

    /**
     * This function applies an external css file to a document 
     */
    applyStyle = (_document, styleSheetLocation) => {
        console.log('applyStyle');
        const cssLink = document.createElement('link');
        cssLink.href = styleSheetLocation;
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        if (_document){
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
    onIframeLoad = (container) => {
        console.log('onIframeLoad');
        if (container.child && container.child.nodeName === 'IFRAME'){
            const iframe = container.child;
            //iframe.onloadOrg = iframe.onload;
            iframe.addEventListener('load', () => {
                console.log('iframe loaded');
                const embeddedDocument = iframe.contentDocument;
                if (!this.isLoginPage(embeddedDocument)){
                    const cssLocation = window.location.href
                        .substring(0, window.location.href.indexOf('?'))
                        .replace('popup.html', 'promptsWindow.css');
                    this.applyStyle(embeddedDocument, cssLocation);
                }
            });
            //const promptsPage = container.child.contentDocument;
            //console.log(promptsPage);
        }
    };

    render() {
        return (
            <div
                style={{ position: 'relative' }}
                ref={this.outerCont}
            >
                <WatchForChildrenAddition 
                    onAddition={this.onIframeLoad.bind(this)}>
                    <PromptsContainer 
                        postMount = {this.loadEmbeddedDossier}
                    />
                </WatchForChildrenAddition>
                
                <div style={{ position: 'absolute', bottom: '0'}}>
                <PromptWindowButtons
                    handleRun={this.handleRun}
                    handleCancel={this.props.handleBack} />
                </div>
            </div>
        );
    };
}

export const mapStateToProps = (state) => {
    return {...state.promptsPopup};
};

export const PromptsWindow = connect(mapStateToProps, actions)(_PromptsWindow);

