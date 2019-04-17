/* eslint-disable */
import React, { Component } from 'react';
import '../index.css';
import '../home/home.css';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { MutationObserver, WatchForChildrenRemoval, WatchForChildrenAddition } from 'react-mutation-observer';
import { PromptsContainer } from './PromptsContainer';
/* eslint-enable */

export class PromptsWindow extends Component {
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
        const { authToken, projectId } = this.state.session;
        //const container = this.container.current;
        const url = `https://localhost:8443/consume/app/${projectId}/${this.state.reportId}`;
        const CustomAuthenticationType = microstrategy.dossier.CustomAuthenticationType;
        const dossierPageState = await microstrategy.dossier.create({
            url: url,
            enableCustomAuthentication: true,
            customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
            enableResponsive: true,
            // Following function is our default implementation, user could provide his/her own implementation
            getLoginToken: function () {
                return Promise.resolve(authToken);
            },
            placeholder: container
        });
        console.log(dossierPageState);
        
        /*.then((dossierPageState) => {
            // TODO: Check if there is a better api call for the currentPageKey
            const currentPageKey = dossierPageState.children[0].getCurrentPage().nodeKey;
            
            const docId = dossierPageState.getDocId();
            const dossierInstanceId = dossierPageState.getDossierInstanceId()

            this.setState({
                loading: false,
                currentPageKey,
                dossierInstanceId,
                docId
            });
        });*/
        
    }

    handleOk = () => {
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

    handleCancel = () => {
        const cancelObject = {
            command: selectorProperties.commandCancel,
        };
        Office.context.ui.messageParent(JSON.stringify(cancelObject));
    }

    onTriggerUpdate = (body) => {
        const updateObject = {
            command: selectorProperties.commandOnUpdate,
            body,
        };
        Office.context.ui.messageParent(JSON.stringify(updateObject));
    };

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

    componentDidMount = async () => {
        //console.log('parent');
        //await this.loadEmbeddedDossier();
        //this.applyStyle();
    }

    /**
     * resets triggerUpdate property to false in order to allow re-pressing OK button
     * should be called every time OK is pressed but selector popup should not close
     */
    resetTriggerUpdate = () => {
        this.setState({ triggerUpdate: false, loading: false });
    };

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
                <PopupButtons
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    loading={this.state.loading} />
                </div>
            </div>
        );
    }
}