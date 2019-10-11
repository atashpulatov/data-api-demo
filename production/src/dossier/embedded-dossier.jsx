import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createDossierInstance, answerDossierPrompts } from '../mstr-object/mstr-object-rest-service';

const { microstrategy } = window;

export default class _EmbeddedDossier extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.msgRouter = null;
    this.eventHandler = this.eventHandler.bind(this);
    this.dossierData = {};
  }

  componentDidMount() {
    this.loadEmbeddedDossier(this.container.current);
  }

  componentWillUnmount() {
    this.msgRouter.removeEventhandler('onVizSelectionChanged', this.eventHandler);
  }

  loadEmbeddedDossier = async (container) => {
    const { mstrData, handlePopupErrors } = this.props;
    const { envUrl, token, dossierId, projectId, promptsAnswers } = mstrData;
    const instance = {};
    try {
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
    } catch (e) {
      handlePopupErrors(e)
    }

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
        return Promise.resolve(token);
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
        reprompt: false,
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
        addToLibrary: false,
      },
      enableVizSelection: true,
      onMsgRouterReadyHandler: ({ MsgRouter }) => {
        this.msgRouter = MsgRouter;
        this.msgRouter.registerEventHandler('onVizSelectionChanged', this.eventHandler);
      },
    };

    microstrategy.dossier
      .create(props)
      .then(async () => {
        this.dossierData = {
          promptsAnswers,
          preparedInstanceId: instance.mid,
        };
      });
  }

  /**
   * Handles the event throwed after new vizualization selection.
   * Retrives the selected vizualizationKey and chapterKey.
   * Passes new data to parent component by handleSelection function.
   *
   * @param {Object} payload - payload throwed by embedded.api after the visualization was selected
   */
  eventHandler(payload) {
    const { handleSelection } = this.props;
    const { 0: payloadChapterKey } = Object.keys(payload);
    const { 0: payloadVisKey } = Object.keys(payload[payloadChapterKey]);
    this.dossierData = {
      ...this.dossierData,
      chapterKey: payloadChapterKey,
      visualizationKey: payloadVisKey
    }
    handleSelection(this.dossierData);
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
    token: PropTypes.string,
    dossierId: PropTypes.string,
    projectId: PropTypes.string,
    promptsAnswers: PropTypes.array || null
  }),
  handleSelection: PropTypes.func,
  handlePopupErrors: PropTypes.func
};

_EmbeddedDossier.defaultProps = {
  mstrData: {
    envUrl: 'no env url',
    token: null,
    dossierId: 'default id',
    projectId: 'default id',
    promptsAnswers: null
  },
  handleSelection: () => { },
  handlePopupErrors: () => { }
};

export const EmbeddedDossier = connect()(_EmbeddedDossier);
