class VisualizationInfoService {
  constructor() {
    this.getVisualizationInfo = this.getVisualizationInfo.bind(this);
    this.prepareVisualizationInfoObject = this.prepareVisualizationInfoObject.bind(this);
    this.parseVisualizations = this.parseVisualizations.bind(this);
    this.parsePanelStacks = this.parsePanelStacks.bind(this);
    this.parseDossierPage = this.parseDossierPage.bind(this);
  }

  init = (mstrObjectRestService) => {
    this.mstrObjectRestService = mstrObjectRestService;
  }

  /**
   * Get visualization key, page key, chapter key, dossier structure with names and panel stack tree.
   * from dossier hierarchy. In case if visualization key is not found in dossier, it returns null.
   *
   * Exceptions are handled by callers.
   *
   * @param {String} projectId
   * @param {String} objectId
   * @param {String} visualizationKey visualization id
   * @param {Object} dossierInstance dossier instance id
   * @returns {Object} Contains info for visualization or null if visualization key is not found
   */
  async getVisualizationInfo(projectId, objectId, visualizationKey, dossierInstance) {
    const dossierDefinition = await this.mstrObjectRestService
      .getDossierInstanceDefinition(projectId, objectId, dossierInstance);

    for (const chapter of dossierDefinition.chapters) {
      const chapterData = { name: chapter.name, key: chapter.key };
      for (const page of chapter.pages) {
        const vizInfo = this.parseDossierPage(page, visualizationKey, chapterData, dossierDefinition.name);
        if (vizInfo) { return vizInfo; }
      }
    }

    return null;
  }

  /**
   * Converts given data to visualization info object
   * @param {String} chapterData.key key of parsed chapter
   * @param {String} chapterData.name name of parsed chapter
   * @param {String} pageData.key key of parsed page
   * @param {String} pageData.name name of parsed page
   * @param {String} visualizationKey key of visualization which script is looking for
   * @param {String} dossierName name of parsed dossier
   * @param {Array<Object} panelStackTree array of panel stacks and panels key which indicates parsed panel
   * @returns {Object} visualization info object
   */
  // eslint-disable-next-line class-methods-use-this
  prepareVisualizationInfoObject(chapterData, pageData, visualizationKey, dossierName, panelStackTree) {
    return {
      chapterKey: chapterData.key,
      pageKey: pageData.key,
      visualizationKey,
      dossierStructure: {
        chapterName: chapterData.name,
        dossierName,
        pageName: pageData.name,
      },
      panelStackTree,
    };
  }

  /**
   * Parses given visualizations from dossier page or panel to find visualization with given key.
   * @param {Array<Object>} visualizations arrray of visualizations being parsed
   * @param {String} chapterData.key key of parsed chapter
   * @param {String} chapterData.name name of parsed chapter
   * @param {String} pageData.key key of parsed page
   * @param {String} pageData.name name of parsed page
   * @param {String} visualizationKey key of visualization which script is looking for
   * @param {String} dossierName name of parsed dossier
   * @param {Array<Object} panelStackTree array of panel stacks and panels key which indicates parsed panel
   * @returns {Object} Visualization info or null.
   */
  parseVisualizations(visualizations, chapterData, pageData, visualizationKey, dossierName, panelStackTree) {
    for (const visualization of visualizations) {
      if (visualization.key === visualizationKey) {
        return this.prepareVisualizationInfoObject(
          chapterData, pageData, visualizationKey, dossierName, panelStackTree
        );
      }
    }

    return null;
  }

  /**
   * Recursivly parses given panel stacks from dossier page to find visualization with given key
   * and persist its location in the dossier.
   * @param {Array<Object>} givenPanelStacks arrray of panel stacks being parsed
   * @param {String} visualizationKey key of visualization which script is looking for
   * @param {String} chapterData.key key of parsed chapter
   * @param {String} chapterData.name name of parsed chapter
   * @param {String} pageData.key key of parsed page
   * @param {String} pageData.name name of parsed page
   * @param {String} dossierName name of parsed dossier
   * @param {Array<Object} panelStackTree array of panel stacks and panels key which indicates parsed panel
   * @returns {Object} Visualization info or null.
   */
  parsePanelStacks(givenPanelStacks, visualizationKey, chapterData, pageData, dosierName, panelStackTree) {
    for (const panelStack of givenPanelStacks) {
      for (const panel of panelStack.panels) {
        const panelLocation = { panelKey: panel.key, panelStackKey: panelStack.key };
        const newPanelStackTree = [...panelStackTree, panelLocation];

        if (panel.visualizations) {
          const vizInfo = this.parseVisualizations(
            panel.visualizations, chapterData, pageData, visualizationKey, dosierName, newPanelStackTree
          );
          if (vizInfo) { return vizInfo; }
        }

        if (panel.panelStacks) {
          const vizInfo = this.parsePanelStacks(
            panel.panelStacks, visualizationKey, chapterData, pageData, dosierName, newPanelStackTree
          );
          if (vizInfo) { return vizInfo; }
        }
      }
    }

    return null;
  }


  /**
   * Parses given page from dossier chapter to find visualization with given key.
   * @param {Object} page page of dossier which is being parsed
   * @param {String} visualizationKey key of visualization which script is looking for
   * @param {String} chapterData.key key of parsed chapter
   * @param {String} chapterData.name name of parsed chapter
   * @param {String} dossierName name of parsed dossier
   * @returns {Object} Visualization info or null.
   */
  parseDossierPage(page, visualizationKey, chapterData, dossierName) {
    const pageData = { name: page.name, key: page.key };

    if (page.visualizations) {
      const vizInfo = this.parseVisualizations(
        page.visualizations, chapterData, pageData, visualizationKey, dossierName, []
      );
      if (vizInfo) { return vizInfo; }
    }

    if (page.panelStacks) {
      const vizInfo = this.parsePanelStacks(
        page.panelStacks, visualizationKey, chapterData, pageData, dossierName, []
      );
      if (vizInfo) { return vizInfo; }
    }

    return null;
  }
}

export const visualizationInfoService = new VisualizationInfoService();
