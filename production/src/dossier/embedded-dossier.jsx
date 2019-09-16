import React from 'react';
import { connect } from 'react-redux';

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
    const { mstrData } = this.props;
    const { envUrl, token, dossierId, projectId } = mstrData;
    const libraryUrl = envUrl.replace('api', 'app');

    const url = `${libraryUrl}/${projectId}/${dossierId}`;
    const { CustomAuthenticationType } = microstrategy.dossier;

    const props = {
      url,
      enableCustomAuthentication: true,
      customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
      enableResponsive: true,
      getLoginToken() {
        return Promise.resolve(token);
      },
      placeholder: container,
    };

    microstrategy.dossier
      .create(props)
      .then(async (dossierPage) => {
        // TODO: const chapter = await dossierPage.getCurrentChapter();
        // TODO: const objectId = await dossierPage.getDossierId();
        // TODO: const visuzalisations = await dossierPage.getCurrentPageVisualizationList();
        // TODO: const dossierData = {
        // TODO:   chapterKey: chapter.nodeKey,
        // TODO:   dossierId: objectId,
        // TODO:   visualizationKey: (visuzalisations.length > 0) ? visuzalisations[0].key : '',
        // TODO: };
      });
  }

  render() {
    return (
      <div ref={this.container} />
    );
  }
}

export const EmbeddedDossier = connect()(_EmbeddedDossier);
