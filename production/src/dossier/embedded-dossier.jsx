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
        const chapter = await dossierPage.getCurrentChapter();
        const visuzalisations = await dossierPage.getCurrentPageVisualizationList();
        const dossierData = {
          chapterKey: chapter.nodeKey,
          visualizationKey: (visuzalisations.length > 0) ? visuzalisations[0].key : '',
        };
        const { handleSelection } = this.props;
        handleSelection(dossierData);
      });
  }

  render() {
    return (
      <div ref={this.container} />
    );
  }
}

export const EmbeddedDossier = connect()(_EmbeddedDossier);
