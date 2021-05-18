import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Empty } from '@mstr/connector-components/';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { popupHelper } from '../popup/popup-helper';
import { DEFAULT_PROJECT_NAME } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from './script-injection-helper';
import './dossier.css';

const { microstrategy, Office } = window;

const { createDossierInstance, answerDossierPrompts } = mstrObjectRestService;

export default class EmbeddedDossierNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.msgRouter = null;
    this.onVizSelectionHandler = this.onVizSelectionHandler.bind(this);
    this.dossierData = { promptsAnswers: props.mstrData.promptsAnswers, };
    this.promptsAnsweredHandler = this.promptsAnsweredHandler.bind(this);
    this.instanceIdChangeHandler = this.instanceIdChangeHandler.bind(this);
    this.embeddedDossier = null;
    this.state = { loadingFrame: true };
  }

  componentDidMount() {
    scriptInjectionHelper.watchForIframeAddition(this.container.current, this.onIframeLoad);
    this.loadEmbeddedDossier(this.container.current);
  }

  componentWillUnmount() {
    if (this.msgRouter) {
      const { EventType } = microstrategy.dossier;
      this.msgRouter.removeEventhandler(EventType.ON_VIZ_SELECTION_CHANGED, this.onVizSelectionHandler);
      this.msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, this.promptsAnsweredHandler);
      this.msgRouter.removeEventhandler(EventType.ON_DOSSIER_INSTANCE_ID_CHANGE, this.instanceIdChangeHandler);
    }
  }

  /**
   * This function is called after the embedded dossier iframe is added into the DOM
   * @param {*} iframe
   */
  onIframeLoad = (iframe) => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      const { handleIframeLoadEvent } = this.props;
      iframe.tabIndex = 0;
      iframe.addEventListener('focus', this.onWindowFocus);
      // DE160793 - Throw session expired error when dossier redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      if (!scriptInjectionHelper.isLoginPage(contentDocument)) {
        // DE158588 - Not able to open dossier in embedding api on excel desktop in windows
        const isOfficeOnline = Office.context ? Office.context.platform === Office.PlatformType.OfficeOnline : false;
        const isIE = /Trident\/|MSIE /.test(window.navigator.userAgent);
        if (!isOfficeOnline && isIE) {
          scriptInjectionHelper.applyFile(contentDocument, 'javascript/mshtmllib.js');
        }
        scriptInjectionHelper.applyFile(contentDocument, 'javascript/embeddingsessionlib.js');
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

  loadEmbeddedDossier = async (container) => {
    const { mstrData, handleEmbeddedDossierLoad } = this.props;
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
      instanceId: instance.mid,
    };

    const serverURL = envUrl.slice(0, envUrl.lastIndexOf('/api'));
    // delete last occurence of '/api' from the enviroment url
    let selectedVizChecked = selectedViz;
    if (selectedViz && visualizationInfo) {
      const { chapterKey, visualizationKey } = visualizationInfo;
      selectedVizChecked = `${chapterKey}:${visualizationKey}`;
    }
    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    const props = {
      instance,
      serverURL,
      applicationID: projectId,
      objectID: dossierId,
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
        shareDossier: false,
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
        this.msgRouter.registerEventHandler(EventType.ON_VIZ_SELECTION_CHANGED, this.onVizSelectionHandler);
        this.msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, this.promptsAnsweredHandler);
        this.msgRouter.registerEventHandler(EventType.ON_DOSSIER_INSTANCE_ID_CHANGE, this.instanceIdChangeHandler);
      },
    };
    if (microstrategy && microstrategy.dossier) {
      microstrategy.dossier
        .create(props)
        .then(dossier => {
          if (selectedViz && visualizationInfo) {
            const { pageKey, chapterKey } = visualizationInfo;

            const selectedPageNodeKey = dossier
              .getChapterList()
              .find(chapter => chapter.nodeKey.includes(chapterKey))
              .children
              .find(page => page.nodeKey.includes(pageKey))
              .nodeKey;

            dossier.navigateToPage(dossier.getPageByNodeKey(selectedPageNodeKey));
          }
          this.embeddedDossier = dossier;
          this.setState({ loadingFrame: false });
          handleEmbeddedDossierLoad();
        });
    } else {
      console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment');
    }
  }

  /**
  * Update the instanceId in dossierData and also in parent component.
  * InstanceId is changing as result of reset button click, switch to
  * bookmark or new prompts answers given.
  *
  * @param {String} newInstanceId
  */
  instanceIdChangeHandler(newInstanceId) {
    const { handleInstanceIdChange } = this.props;
    this.dossierData.instanceId = newInstanceId;
    handleInstanceIdChange(newInstanceId);
  }

  /**
   * When focused on iframe switch focus to the Table of Contents button.
   * The user cannot see that the iframe is focused on and will expect to see ToC button highlighted.
   *
   * @param {FocusEvent} focusEvent
   */
  onWindowFocus = (focusEvent) => {
    const tableOfContentsButton = focusEvent.target.contentDocument.getElementsByClassName('icon-tb_toc_n')[0];
    if (tableOfContentsButton) {
      tableOfContentsButton.focus();
    }
  }

  /**
  * Update the promptsAnswers in dossierData and also in parent component.
  * Update the selectedViz in parent component in case of simple reprompt
  * to keep the import button enabled.
  *
  * @param {Array} promptsAnswers
  */
  async promptsAnsweredHandler(promptsAnswers) {
    const { handlePromptAnswer } = this.props;
    this.dossierData.promptsAnswers = promptsAnswers;
    handlePromptAnswer(promptsAnswers);

    if (this.embeddedDossier) {
      const payload = await this.embeddedDossier.getSelectedVizKeys();
      if (Object.keys(payload).length > 0) {
        this.onVizSelectionHandler(payload);
      }
    }
  }

  render() {
    const { loadingFrame } = this.state;
    return (
      /*
      Height needs to be passed for container because without it, embedded api will set default height: 600px;
      We need to calculate actual height, regarding the size of other elements:
      58px for header, 19px for header and title margin and 68px for buttons.
      */
      <>
        {loadingFrame && <Empty isLoading />}
        <div
          ref={this.container}
          style={{
            position: 'relative',
            top: '0',
            left: '0',
            height: 'calc(100vh - 145px)',
            minHeight: 'calc(100vh - 145px)',
            maxHeight: 'calc(100vh - 145px)',
          }} />
      </>
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
    visualizationInfo: PropTypes.shape({
      chapterKey: PropTypes.string,
      pageKey: PropTypes.string,
      visualizationKey: PropTypes.string,
    })
  }),
  handleSelection: PropTypes.func,
  handlePromptAnswer: PropTypes.func,
  handleInstanceIdChange: PropTypes.func,
  handleIframeLoadEvent: PropTypes.func,
  handleEmbeddedDossierLoad: PropTypes.func,
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
  const isReport = popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
  const editedObject = { ...(popupHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege)) };
  const mstrData = {
    envUrl,
    authToken,
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
