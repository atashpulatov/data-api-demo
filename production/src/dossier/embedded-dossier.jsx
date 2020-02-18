/* eslint-disable no-await-in-loop */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { popupHelper } from '../popup/popup-helper';
import { DEFAULT_PROJECT_NAME } from '../storage/navigation-tree-reducer';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';

const { microstrategy, Office } = window;

const { createDossierInstance, answerDossierPrompts } = mstrObjectRestService;

/**
 * Watches container for child addition and runs callback in case an iframe was added
 * @param {*} container
 * @param {*} callback
 */
export function watchForIframeAddition(container, callback) {
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

export default class EmbeddedDossierNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.msgRouter = null;
    this.onVizSelectionHandler = this.onVizSelectionHandler.bind(this);
    this.dossierData = { promptsAnswers: props.mstrData.promptsAnswers, };
    this.promptsAnsweredHandler = this.promptsAnsweredHandler.bind(this);
    this.embeddedDossier = null;
  }

  componentDidMount() {
    watchForIframeAddition(this.container.current, this.onIframeLoad);
    this.loadEmbeddedDossier(this.container.current);
  }

  componentWillUnmount() {
    if (this.msgRouter) {
      this.msgRouter.removeEventhandler('onVizSelectionChanged', this.onVizSelectionHandler);
      this.msgRouter.removeEventhandler('onPromptAnswered', this.promptsAnsweredHandler);
    }
  }

  /**
   * This function is called after the embedded dossier iframe is added into the DOM
   * @param {*} iframe
   */
  onIframeLoad = (iframe) => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      const { handleLoadEvent } = this.props;
      // DE160793 - Throw session expired error when dossier redirects to login (iframe 'load' event)
      handleLoadEvent();
      // DE158588 - Not able to open dossier in embedding api on excel desktop in windows
      const isOfficeOnline = Office.context ? Office.context.platform === Office.PlatformType.OfficeOnline : false;
      const isIE = /Trident\/|MSIE /.test(window.navigator.userAgent);
      if (!isOfficeOnline && isIE) {
        const fileLocation = window.location.origin
          + window.location.pathname.replace('index.html', 'javascript/mshtmllib.js');
        this.applyFile(contentDocument, fileLocation);
      }
    });
  };

  /**
 * Handles the event throwed after new vizualization selection.
 * Retrives the selected vizualizationKey and chapterKey.
 * Passes new data to parent component by handleSelection function.
 *
 * @param {Object} payload - payload throwed by embedded.api after the visualization was selected
 */
  onVizSelectionHandler(payload) {
    const { handleSelection } = this.props;
    const [payloadChapterKey] = Object.keys(payload);
    const [payloadVisKey] = Object.keys(payload[payloadChapterKey]);
    this.dossierData = {
      ...this.dossierData,
      chapterKey: payloadChapterKey,
      visualizationKey: payloadVisKey
    };
    handleSelection(this.dossierData);
  }

  /**
   * This function applies an external script file to a embedded document
   * @param {*} _document
   * @param {*} fileLocation
   */
  applyFile = (_document, fileLocation) => {
    const script = _document.createElement('script');
    script.src = fileLocation;
    if (_document) {
      const title = _document.head.getElementsByTagName('title')[0];
      _document.head.insertBefore(script, title);
    }
  }

  loadEmbeddedDossier = async (container) => {
    const { mstrData } = this.props;
    const {
      envUrl, authToken, dossierId, projectId, promptsAnswers,
      instanceId, selectedViz, visualizationInfo
    } = mstrData;
    const instance = {};
    try {
      if (instanceId) {
        instance.mid = instanceId;
      } else {
        const body = { disableManipulationsAutoSaving: true, persistViewState: true };
        instance.mid = await createDossierInstance(projectId, dossierId, body);
        if (promptsAnswers != null) {
          let count = 0;
          while (count < promptsAnswers.length) {
            await answerDossierPrompts({
              objectId: dossierId,
              projectId,
              instanceId: instance.mid,
              promptsAnswers: promptsAnswers[count]
            });
            count++;
          }
        }
      }
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      popupHelper.handlePopupErrors(error);
    }

    this.dossierData = {
      ...this.dossierData,
      preparedInstanceId: instance.mid,
    };

    const libraryUrl = envUrl.replace('api', 'app');
    let url = `${libraryUrl}/${projectId}/${dossierId}`;
    let selectedVizChecked = selectedViz;

    if (selectedViz && visualizationInfo) {
      const { chapterKey, pageKey, visualizationKey } = visualizationInfo;
      selectedVizChecked = `${chapterKey}:${visualizationKey}`;
      url = `${libraryUrl}/${projectId}/${dossierId}/${pageKey}`;
    }
    const { CustomAuthenticationType } = microstrategy.dossier;

    const props = {
      instance,
      url,
      enableCustomAuthentication: true,
      customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
      enableResponsive: true,
      getLoginToken() {
        return Promise.resolve(authToken);
      },
      placeholder: container,
      enableCollaboration: false,
      filterFeature: {
        enabled: true,
        edit: true,
        summary: true,
      },
      navigationBar: {
        enabled: true,
        gotoLibrary: false,
        title: true,
        toc: true,
        reset: true,
        reprompt: true,
        share: false,
        comment: false,
        notification: false,
        filter: true,
        options: false,
        search: false,
        bookmark: true,
      },
      optionsFeature: {
        enabled: true,
        help: true,
        logout: true,
        manage: true,
        showTutorials: true,
      },
      shareFeature: {
        enabled: true,
        invite: true,
        link: true,
        email: true,
        export: true,
        download: true,
      },
      tocFeature: { enabled: true, },
      uiMessage: {
        enabled: true,
        addToLibrary: true,
      },
      enableVizSelection: true,
      selectedViz: selectedVizChecked,
      onMsgRouterReadyHandler: ({ MsgRouter }) => {
        this.msgRouter = MsgRouter;
        this.msgRouter.registerEventHandler('onVizSelectionChanged', this.onVizSelectionHandler);
        this.msgRouter.registerEventHandler('onPromptAnswered', this.promptsAnsweredHandler);
      },
    };
    this.embeddedDossier = await microstrategy.dossier.create(props);
  }

  promptsAnsweredHandler(promptsAnswers) {
    const { handlePromptAnswer } = this.props;
    if (this.embeddedDossier) {
      this.embeddedDossier.getDossierInstanceId().then((newInstanceId) => {
        this.dossierData.preparedInstanceId = newInstanceId;
        handlePromptAnswer(promptsAnswers, newInstanceId);
      });
    } else {
      handlePromptAnswer(promptsAnswers);
    }
  }

  render() {
    return (
      /*
      Height needs to be passed for container because without it, embedded api will set default height: 600px;
      We need to calculate actual height, regarding the size of other elements:
      58px for header, 9px for header margin and 68px for buttons
      */
      <div ref={this.container}
           style={{
 position: 'relative', top: '0', left: '0', height: 'calc(100vh - 135px)'
}} />
    );
  }
}

EmbeddedDossierNotConnected.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    dossierId: PropTypes.string,
    projectId: PropTypes.string,
    instanceId: PropTypes.string,
    promptsAnswers: PropTypes.array || null,
    selectedViz: PropTypes.string,
    visualizationInfo: {
      chapterKey: PropTypes.string,
      pageKey: PropTypes.string,
      visualizationKey: PropTypes.string,
    }
  }),
  handleSelection: PropTypes.func,
  handlePromptAnswer: PropTypes.func,
  handleLoadEvent: PropTypes.func
};

EmbeddedDossierNotConnected.defaultProps = {
  mstrData: {
    envUrl: 'no env url',
    authToken: null,
    dossierId: 'default id',
    projectId: 'default id',
    instanceId: 'default id',
    promptsAnswers: null,
    selectedViz: ''
  },
  handleSelection: () => { },
};

const mapStateToProps = (state) => {
  const {
    navigationTree,
    popupReducer,
    sessionReducer: { attrFormPrivilege, envUrl, authToken },
    officeReducer
  } = state;
  const { chosenObjectName, chosenObjectId, chosenProjectId } = navigationTree;
  const popupState = popupReducer.editedObject;
  const { promptsAnswers } = state.navigationTree;
  const { supportForms } = officeReducer;
  const isReport = popupState && popupState.objectType === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
  const editedObject = { ...(popupHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege)) };
  const mstrData = {
    envUrl,
    token: authToken,
    dossierId: isEdit ? editedObject.chosenObjectId : chosenObjectId,
    projectId: isEdit ? editedObject.projectId : chosenProjectId,
    promptsAnswers: isEdit ? editedObject.promptsAnswers : promptsAnswers,
    visualizationInfo: editedObject.visualizationInfo,
    selectedViz: isEdit ? editedObject.selectedViz : '',
    instanceId: editedObject.instanceId,
  };
  return { mstrData };
};

export const EmbeddedDossier = connect(mapStateToProps)(EmbeddedDossierNotConnected);
