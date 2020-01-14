/* eslint-disable no-await-in-loop */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import {popupHelper} from '../popup/popup-helper';

const { microstrategy } = window;

const { createDossierInstance, answerDossierPrompts } = mstrObjectRestService;

export default class _EmbeddedDossier extends React.Component {
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
    this.loadEmbeddedDossier(this.container.current);
  }

  componentWillUnmount() {
    this.msgRouter.removeEventhandler('onVizSelectionChanged', this.onVizSelectionHandler);
    this.msgRouter.removeEventhandler('onPromptAnswered', this.promptsAnsweredHandler);
  }

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
    const { mstrData } = this.props;
    const { envUrl, authToken, dossierId, projectId, promptsAnswers, instanceId, selectedViz } = mstrData;
    const instance = {};
    try {
      if (instanceId) {
        instance.mid = instanceId;
      } else {
        instance.mid = await createDossierInstance(projectId, dossierId);
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
      popupHelper.handlePopupErrors(error);
    }

    this.dossierData = {
      ...this.dossierData,
      preparedInstanceId: instance.mid,
    };

    const libraryUrl = envUrl.replace('api', 'app');

    const url = `${libraryUrl}/${projectId}/${dossierId}`;
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
      dossierFeature: { readoOnly: true, },
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
      selectedViz,
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
      <div ref={this.container} style={{ position: 'relative', top: '0', left: '0', height: 'calc(100vh - 135px)' }} />
    );
  }
}

_EmbeddedDossier.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    dossierId: PropTypes.string,
    projectId: PropTypes.string,
    instanceId: PropTypes.string,
    promptsAnswers: PropTypes.array || null,
    selectedViz: PropTypes.string,
  }),
  handleSelection: PropTypes.func,
  handlePromptAnswer: PropTypes.func
};

_EmbeddedDossier.defaultProps = {
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

export const EmbeddedDossier = connect()(_EmbeddedDossier);
