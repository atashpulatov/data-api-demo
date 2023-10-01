/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Empty } from '@mstr/connector-components/';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { popupHelper } from '../../popup/popup-helper';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from '../utils/script-injection-helper';
import { handleLoginExcelDesktopInWindows } from '../utils/embedded-helper';
import './dossier.css';

import { prepareGivenPromptAnswers, preparePromptedDossier } from '../../helpers/prompts-handling-helper';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';

const { microstrategy, Office } = window;

const { createDossierInstance, rePromptDossier, isPrompted, } = mstrObjectRestService;

const VIZ_SELECTION_RETRY_DELAY = 200; // ms
const VIZ_SELECTION_RETRY_LIMIT = 10;

export default class EmbeddedDossierNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.msgRouter = null;
    this.onVizSelectionHandler = this.onVizSelectionHandler.bind(this);
    this.dossierData = { promptsAnswers: props.mstrData.promptsAnswers, };
    this.promptsAnsweredHandler = this.promptsAnsweredHandler.bind(this);
    this.instanceIdChangeHandler = this.instanceIdChangeHandler.bind(this);
    this.restoreVizSelection = this.restoreVizSelection.bind(this);
    this.onEmbeddedError = this.onEmbeddedError.bind(this);
    this.retryCounter = 0;
    this.embeddedDossier = null;
    this.state = { loadingFrame: true };
    this.promptsAnswered = props.promptsAnswered;
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
      this.msgRouter.removeEventhandler(EventType.ON_ERROR, this.onEmbeddedError);
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
      if (iframe.focusEventListenerAdded === false) {
        iframe.focusEventListenerAdded = true;
        iframe.addEventListener('focus', scriptInjectionHelper.switchFocusToElementOnWindowFocus);
      }
      // DE160793 - Throw session expired error when dossier redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      handleLoginExcelDesktopInWindows(contentDocument, Office);
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
    const chapterData = payload[payloadChapterKey];
    const [payloadVisKey] = Object.keys(chapterData);

    this.dossierData = {
      ...this.dossierData,
      chapterKey: payloadChapterKey,
      visualizationKey: payloadVisKey
    };

    handleSelection(this.dossierData);
  }

  /**
   * Handles the event throwed after new error in embedded dossier.
   * Retrives the error type (based on title).
   * If error type is not a notification - handles it by closing the window
   *
   * @param {Object} error - payload throwed by embedded.api after the error occured
   */
  // eslint-disable-next-line class-methods-use-this
  onEmbeddedError(error) {
    const { title } = error;
    if (title !== 'Notification') {
      // TODO: improve this, so it doesn't depend on i18n
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      popupHelper.handlePopupErrors(error);
    }
  }

  /**
   * This function handles the instance creation of the Dossier.
   * If the instanceId is provided, it will be used to create the Dossier's instance.
   * Otherwise, a new instance will be created.
   * @param {*} instanceId
   * @param {*} projectId
   * @param {*} dossierId
   * @returns
   */
  handleInstanceId = async (instanceId, projectId, dossierId) => {
    if (instanceId) {
      return { mid: instanceId };
    }

    const body = { disableManipulationsAutoSaving: true, persistViewState: true };
    const instance = await createDossierInstance(projectId, dossierId, body);

    // Checking if the dossier is prompted and update the status accordingly
    const isPromptedResponse = await isPrompted(dossierId, projectId, mstrObjectEnum.mstrObjectType.dossier.name);
    instance.status = isPromptedResponse.isPrompted ? 2 : 1;

    return instance;
  };

  /**
   * This function handles the preparation of the Dossier's instance to apply previous answers if necessary.
   * @param {*} instance
   * @param {*} dossierId
   * @param {*} projectId
   * @param {*} givenPromptsAnswers
   * @returns
   */
  prepareAndHandlePromptAnswers = async (instance, dossierId, projectId, givenPromptsAnswers) => {
    // Prepare the Dossier's instance to apply previous answers if necessary.
    if (givenPromptsAnswers.length > 0 && givenPromptsAnswers[0].answers.length > 0) {
      // Proceed with answering prompts if there are prompts to answer, including nested prompts.
      instance = await preparePromptedDossier(instance, dossierId, projectId, givenPromptsAnswers);
    }
    return instance;
  };

  loadEmbeddedDossier = async (container) => {
    const {
      mstrData,
      handleEmbeddedDossierLoad,
      reusePromptAnswers,
      previousPromptsAnswers,
      dossierOpenRequested,
      promptObjects,
    } = this.props;
    const {
      envUrl, authToken, dossierId, projectId, promptsAnswers,
      instanceId, selectedViz, visualizationInfo
    } = mstrData;
    let instance = {};
    try {
      instance = await this.handleInstanceId(instanceId, projectId, dossierId);

      // Declared variables to determine whether importing a report/dossier is taking place and
      // whether there are previous prompt answers to handle
      const isImportedObjectPrompted = promptObjects && promptObjects.length > 0;
      const handlePreviousAnswersAtImport = dossierOpenRequested && reusePromptAnswers
        && previousPromptsAnswers && previousPromptsAnswers.length > 0
        && isImportedObjectPrompted;

      // Update givenPromptsAnswers collection with previous prompt answers if importing a report/dossier
      const givenPromptsAnswers = handlePreviousAnswersAtImport ? prepareGivenPromptAnswers(promptObjects, previousPromptsAnswers) : { ...promptsAnswers };

      instance = await this.prepareAndHandlePromptAnswers(instance, dossierId, projectId, givenPromptsAnswers);

      // Open Prompts' dialog if there are prompts to answer when importing a report/dossier.
      if (dossierOpenRequested && reusePromptAnswers && isImportedObjectPrompted) {
        // Re-prompt the Dossier's instance to show the prompts dialog.
        const resp = await rePromptDossier(
          dossierId,
          instance.mid,
          projectId
        );

        instance.mid = resp.mid;
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

    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    const props = {
      instance,
      serverURL,
      applicationID: projectId,
      objectID: dossierId,
      enableCustomAuthentication: true,
      customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
      enableResponsive: true,
      reportInLibraryFeature: { enabled: false },
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
        edit: false,
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
      onMsgRouterReadyHandler: ({ MsgRouter }) => {
        this.msgRouter = MsgRouter;
        this.msgRouter.registerEventHandler(EventType.ON_VIZ_SELECTION_CHANGED, this.onVizSelectionHandler);
        this.msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, this.promptsAnsweredHandler);
        this.msgRouter.registerEventHandler(EventType.ON_DOSSIER_INSTANCE_ID_CHANGE, this.instanceIdChangeHandler);
        this.msgRouter.registerEventHandler(EventType.ON_ERROR, this.onEmbeddedError);
      },
      dossierFeature: {
        visExport: {
          enabled: false,
          excel: false,
          pdf: false,
          csv: false,
        }
      }
    };

    if (microstrategy && microstrategy.dossier) {
      const embeddedDossier = await microstrategy.dossier.create(props);
      this.embeddedDossier = embeddedDossier;

      if (selectedViz && visualizationInfo) {
        const { pageKey, chapterKey, visualizationKey } = visualizationInfo;

        const chapterList = embeddedDossier.getChapterList();

        const selectedPageNodeKey = chapterList
          .find(chapter => chapter.nodeKey.includes(chapterKey))
          .children
          .find(page => page.nodeKey.includes(pageKey))
          .nodeKey;

        const selectedPage = embeddedDossier.getPageByNodeKey(selectedPageNodeKey);

        await embeddedDossier.navigateToPage(selectedPage);

        await this.restoreVizSelection(visualizationKey);
      }

      this.setState({ loadingFrame: false });
      handleEmbeddedDossierLoad();
    } else {
      console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment');
    }
  };

  async restoreVizSelection(visualizationKey) {
    try {
      this.retryCounter++;
      await this.embeddedDossier.selectViz(visualizationKey);
    } catch (error) {
      if (this.retryCounter > VIZ_SELECTION_RETRY_LIMIT) {
        console.error(error);
      } else {
        await new Promise(resolve => setTimeout(resolve, VIZ_SELECTION_RETRY_DELAY));
        await this.restoreVizSelection(visualizationKey);
      }
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
  * Update the promptsAnswers in dossierData and also in parent component.
  * Update the selectedViz in parent component in case of simple reprompt
  * to keep the import button enabled.
  *
  * @param {Array} promptsAnswers
  */
  async promptsAnsweredHandler(promptsAnswers) {
    const { handlePromptAnswer, mstrData } = this.props;

    // Create reference to previous answers. This function called again after
    // nested re-prompting the dossier, so we need to keep previous answers along with new ones
    const tempAnswers = this.dossierData.promptsAnswers?.answers ? this.dossierData.promptsAnswers.answers : [];
    promptsAnswers.answers = [...tempAnswers, ...promptsAnswers.answers];

    // Get the answers applied to the current dossier's instance from the server.
    // Need to incorporate these answers because they're formatted differently than the ones
    // returned by the Embedded API. The REST API endpoint expects the answers to be in a
    // different format than the Embedded API.
    const promptsAnsDef = await mstrObjectRestService.getObjectPrompts(mstrData.dossierId, mstrData.projectId, this.dossierData.instanceId, true);

    // Append the server's version of the answers to the promptsAnswers object.
    // This version of answers will be used to invoke the REST API endpoint when
    // importing or re-prompting a report/dossier.
    promptsAnsDef && promptsAnswers?.answers?.forEach((answer) => {
      const answerDef = promptsAnsDef.find((prompt) => prompt.key === answer.key);
      answerDef && (answer.answers = answerDef.answers) && (answer.type = answerDef.type);
    });

    this.dossierData.promptsAnswers = promptsAnswers;
    handlePromptAnswer(promptsAnswers);

    // dossierData should eventually be removed as data should be gathered via REST from report, not dossier
    // this.promptsAnswered({ dossierData: this.dossierData, promptsAnswers });

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
          className="dossier-iframe" />
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
    promptsAnswers: PropTypes.array || PropTypes.object || null,
    selectedViz: PropTypes.string,
    visualizationInfo: PropTypes.shape({
      chapterKey: PropTypes.string,
      pageKey: PropTypes.string,
      visualizationKey: PropTypes.string,
    }),
  }),
  handleSelection: PropTypes.func,
  handlePromptAnswer: PropTypes.func,
  handleInstanceIdChange: PropTypes.func,
  handleIframeLoadEvent: PropTypes.func,
  handleEmbeddedDossierLoad: PropTypes.func,
  reusePromptAnswers: PropTypes.bool,
  previousPromptsAnswers: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    useDefault: PropTypes.bool,
    values: PropTypes.arrayOf(PropTypes.string)
  })),
  dossierOpenRequested: PropTypes.bool,
  promptObjects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.shape({})),
    type: PropTypes.string,
  })),
  promptsAnswered: PropTypes.func,
};

EmbeddedDossierNotConnected.defaultProps = {
  mstrData: {
    envUrl: 'no env url',
    authToken: null,
    dossierId: 'default id',
    projectId: 'default id',
    instanceId: 'default id',
    promptsAnswers: null,
    selectedViz: '',
  },
  handleSelection: () => { },
};

const mapStateToProps = (state) => {
  const {
    navigationTree,
    popupReducer,
    sessionReducer: { attrFormPrivilege, envUrl, authToken },
    officeReducer,
    answersReducer,
    popupStateReducer,
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    promptObjects,
    dossierOpenRequested,
  } = navigationTree;
  const popupState = popupReducer.editedObject;
  const { promptsAnswers } = state.navigationTree;
  const { supportForms, reusePromptAnswers } = officeReducer;
  const { answers } = answersReducer;
  const isReport = popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
  const editedObject = { ...(popupHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege)) };
  const { isReprompt } = popupStateReducer;
  const mstrData = {
    envUrl,
    authToken,
    dossierId: isEdit || isReprompt ? editedObject.chosenObjectId : chosenObjectId,
    projectId: isEdit || isReprompt ? editedObject.projectId : chosenProjectId,
    promptsAnswers: isEdit || isReprompt ? editedObject.promptsAnswers : promptsAnswers,
    visualizationInfo: editedObject.visualizationInfo,
    selectedViz: isEdit || isReprompt ? editedObject.selectedViz : '',
    instanceId: editedObject.instanceId,
  };
  return {
    mstrData,
    reusePromptAnswers,
    previousPromptsAnswers: answers,
    promptObjects,
    dossierOpenRequested
  };
};

const mapDispatchToProps = { promptsAnswered: navigationTreeActions.promptsAnswered, };

export const EmbeddedDossier = connect(mapStateToProps, mapDispatchToProps)(EmbeddedDossierNotConnected);
