import React from 'react';
import { connect } from 'react-redux';
import { createDossierInstance, answerDossierPrompts } from '../mstr-object/mstr-object-rest-service';
import { selectorProperties } from '../attribute-selector/selector-properties';

const { Office } = window;
const { microstrategy } = window;

export default class _EmbeddedDossier extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    this.loadEmbeddedDossier(this.container.current);
  }

  closePopup = () => {
    const cancelObject = { command: selectorProperties.commandCancel };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  loadEmbeddedDossier = async (container) => {
    const { mstrData } = this.props;
    const { envUrl, token, dossierId, projectId, promptsAnswers } = mstrData;
    const instance = {};

    try {
      instance.mid = await createDossierInstance(projectId, dossierId);
      if (promptsAnswers != null) {
        let count = 0;
        let responseStatus;
        while (count < promptsAnswers.length) {
          responseStatus = await answerDossierPrompts({ objectId: dossierId, projectId, instanceId: instance.mid, promptsAnswers: promptsAnswers[count] });
          if (responseStatus !== 204) {
            throw new Error(responseStatus);
          }
          count++;
        }
      }
    } catch (error) {
      this.closePopup();
      // !TODO: display some custom error message like `bad server response`
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
      dossierFeature: { readoOnly: true },
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
        };
        const { handleSelection } = this.props;
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

export const EmbeddedDossier = connect()(_EmbeddedDossier);
