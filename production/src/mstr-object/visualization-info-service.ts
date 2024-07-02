import { mstrObjectRestService } from './mstr-object-rest-service';
import { generateDossierFilterText } from './object-filter-helper';

import { VisualizationInfo } from '../types/object-types';

class VisualizationInfoService {
  /**
   * Get visualization key, page key, chapter key, dossier structure with names from dossier hierarchy.
   * In case if visualization key is not found in dossier, it returns null.
   *
   * Exceptions are handled by callers.
   *
   * @param projectId
   * @param objectId
   * @param visualizationKey visualization id
   * @param dossierInstance dossier instance id
   * @returns A promise that resolves to an object containing the visualization information (null if visualization key is not found) and view filter text.
   */
  async getVisualizationInfo(
    projectId: string,
    objectId: string,
    visualizationKey: string,
    dossierInstance: any
  ): Promise<{ vizInfo: VisualizationInfo; viewFilterText: string }> {
    const dossierDefinition = await mstrObjectRestService.getDossierInstanceDefinition(
      projectId,
      objectId,
      dossierInstance
    );

    let vizInfo = null;
    let currentChapter = null;

    for (const chapter of dossierDefinition.chapters) {
      const chapterData = { name: chapter.name, key: chapter.key };
      for (const page of chapter.pages) {
        if (!vizInfo) {
          vizInfo = this.parseDossierPage(
            page,
            visualizationKey,
            chapterData,
            dossierDefinition.name
          );
        }
        if (!currentChapter && chapter.key === dossierDefinition.currentChapter) {
          currentChapter = chapter;
        }
      }
    }

    return {
      vizInfo,
      viewFilterText: generateDossierFilterText(dossierDefinition, currentChapter?.key),
    };
  }

  /**
   * Converts given data to visualization info object
   * @param chapterData.key key of parsed chapter
   * @param chapterData.name name of parsed chapter
   * @param pageData.key key of parsed page
   * @param pageData.name name of parsed page
   * @param visualizationKey key of visualization which script is looking for
   * @param dossierName name of parsed dossier
   * @returns visualization info object
   */
  prepareVisualizationInfoObject(
    chapterData: any,
    pageData: any,
    visualizationKey: any,
    dossierName: string
  ): VisualizationInfo {
    return {
      chapterKey: chapterData.key,
      pageKey: pageData.key,
      visualizationKey,
      dossierStructure: {
        chapterName: chapterData.name,
        dossierName,
        pageName: pageData.name,
      },
    };
  }

  /**
   * Parses given visualizations from dossier page or panel to find visualization with given key.
   * @param visualizations arrray of visualizations being parsed
   * @param chapterData.key key of parsed chapter
   * @param chapterData.name name of parsed chapter
   * @param pageData.key key of parsed page
   * @param pageData.name name of parsed page
   * @param visualizationKey key of visualization which script is looking for
   * @param dossierName name of parsed dossier
   * @returns Visualization info or null.
   */
  parseVisualizations(
    visualizations: any[],
    chapterData: any,
    pageData: any,
    visualizationKey: string,
    dossierName: string
  ): VisualizationInfo {
    for (const visualization of visualizations) {
      if (visualization.key === visualizationKey) {
        return this.prepareVisualizationInfoObject(
          chapterData,
          pageData,
          visualizationKey,
          dossierName
        );
      }
    }

    return null;
  }

  /**
   * Recursively parses given panel stacks from dossier page to find visualization with given key.
   * @param givenPanelStacks arrray of panel stacks being parsed
   * @param visualizationKey key of visualization which script is looking for
   * @param chapterData.key key of parsed chapter
   * @param chapterData.name name of parsed chapter
   * @param pageData.key key of parsed page
   * @param pageData.name name of parsed page
   * @param dossierName name of parsed dossier
   * @returns Visualization info or null.
   */
  parsePanelStacks(
    givenPanelStacks: any[],
    visualizationKey: string,
    chapterData: any,
    pageData: any,
    dosierName: string
  ): VisualizationInfo {
    for (const panelStack of givenPanelStacks) {
      for (const panel of panelStack.panels) {
        if (panel.visualizations) {
          const vizInfo = this.parseVisualizations(
            panel.visualizations,
            chapterData,
            pageData,
            visualizationKey,
            dosierName
          );
          if (vizInfo) {
            return vizInfo;
          }
        }

        if (panel.panelStacks) {
          const vizInfo = this.parsePanelStacks(
            panel.panelStacks,
            visualizationKey,
            chapterData,
            pageData,
            dosierName
          );
          if (vizInfo) {
            return vizInfo;
          }
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
  parseDossierPage(
    page: any,
    visualizationKey: string,
    chapterData: any,
    dossierName: string
  ): VisualizationInfo {
    const pageData = { name: page.name, key: page.key };

    if (page.visualizations) {
      const vizInfo = this.parseVisualizations(
        page.visualizations,
        chapterData,
        pageData,
        visualizationKey,
        dossierName
      );
      if (vizInfo) {
        return vizInfo;
      }
    }

    if (page.panelStacks) {
      const vizInfo = this.parsePanelStacks(
        page.panelStacks,
        visualizationKey,
        chapterData,
        pageData,
        dossierName
      );
      if (vizInfo) {
        return vizInfo;
      }
    }

    return null;
  }
}

export const visualizationInfoService = new VisualizationInfoService();
