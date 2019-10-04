import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createDossierInstance, answerDossierPrompts } from '../mstr-object/mstr-object-rest-service';

const { microstrategy } = window;

export default class _EmbeddedDossier extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    this.loadEmbeddedDossier(this.container.current);
  }

  loadEmbeddedDossier = async (container) => {
    const { mstrData, handleSelection, handlePopupErrors } = this.props;
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
    };

    microstrategy.dossier
      .create(props)
      .then(async (dossierPage) => {
        // Workaround until embedding api enables onVisSelection event
        const chapter = await dossierPage.getCurrentChapter();
        const visuzalisations = await dossierPage.getCurrentPageVisualizationList();
        const dossierData = {
          chapterKey: chapter.nodeKey,
          visualizationKey: (visuzalisations.length > 0) ? visuzalisations[0].key : '',
          promptsAnswers,
          preparedInstanceId: instance.mid,
        };
        handleSelection(dossierData);
        // Workaround end.

        // !TODO: dossierPage.addEventListener('onVisSelection', handleSelection);
      });
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
