import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';

describe('GetVisualizationInfo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const dossierName = 'dossierName';
  const chapterName = 'chapterName';
  const chapterKey = 'chapterKey';
  const pageName = 'pageName';
  const pageKey = 'pageKey';
  const visualizationKey = 'visualizationKey';
  const panelStackKey = 'panelStackKey';
  const panelKey = 'panelKey';
  const nestedPanelStackKey = 'nestedPanelStackKey';
  const nestedPanelKey = 'nestedPanelKey';
  const projectId = 'projectId';
  const objectId = 'objectId';
  const dossierInstance = 'dossierInstanceId';

  const expectedVisualizationInfoWithoutPanelStacks = {
    chapterKey,
    pageKey,
    visualizationKey,
    dossierStructure: {
      dossierName,
      chapterName,
      pageName,
    },
    panelStackTree: [],
  };

  const expectedVisualizationInfoWithPanelStacks = {
    ...expectedVisualizationInfoWithoutPanelStacks,
    panelStackTree: [{ panelStackKey, panelKey }],
  };

  const expectedVisualizationInfoWithNestedPanelStacks = {
    ...expectedVisualizationInfoWithPanelStacks,
    panelStackTree: [{ panelStackKey, panelKey }, { panelStackKey: nestedPanelStackKey, panelKey: nestedPanelKey }],
  };

  const dossierDefinitionWithoutPanelStacks = {
    name: dossierName,
    chapters: [{
      key: chapterKey,
      name: chapterName,
      pages: [{
        key: pageKey,
        name: pageName,
        visualizations: [
          {
            key: visualizationKey
          }
        ]
      }]
    }]
  };

  const dossierDefinitionWithoutPanelStacksAndExpectedVisualization = {
    name: dossierName,
    chapters: [{
      key: chapterKey,
      name: chapterName,
      pages: [{
        key: pageKey,
        name: pageName,
        visualizations: []
      }]
    }]
  };

  const dossierDefinitionWithPanelStacks = {
    name: dossierName,
    chapters: [{
      key: chapterKey,
      name: chapterName,
      pages: [{
        key: pageKey,
        name: pageName,
        visualizations: [],
        panelStacks: [{
          key: panelStackKey,
          panels: [{
            key: panelKey,
            visualizations: [{
              key: visualizationKey
            }],
          }]
        }]
      }]
    }]
  };

  const dossierDefinitionWithPanelStacksAndWithoutExpectedVisualization = {
    name: dossierName,
    chapters: [{
      key: chapterKey,
      name: chapterName,
      pages: [{
        key: pageKey,
        name: pageName,
        visualizations: [],
        panelStacks: [{
          key: panelStackKey,
          panels: [{
            key: panelKey,
            visualizations: [],
          }]
        }]
      }]
    }]
  };

  const dossierDefinitionWithNestedPanelStacks = {
    name: dossierName,
    chapters: [{
      key: chapterKey,
      name: chapterName,
      pages: [{
        key: pageKey,
        name: pageName,
        visualizations: [],
        panelStacks: [{
          key: panelStackKey,
          panels: [{
            key: panelKey,
            visualizations: [],
            panelStacks: [{
              key: nestedPanelStackKey,
              panels: [{
                key: nestedPanelKey,
                visualizations: [{
                  key: visualizationKey
                }],
              }]
            }],
          }]
        }]
      }]
    }]
  };

  const dossierDefinitionWithNestedPanelStacksAndWithoutExpectedVisualization = {
    name: dossierName,
    chapters: [{
      key: chapterKey,
      name: chapterName,
      pages: [{
        key: pageKey,
        name: pageName,
        visualizations: [],
        panelStacks: [{
          key: panelStackKey,
          panels: [{
            key: panelKey,
            visualizations: [],
            panelStacks: [{
              key: nestedPanelStackKey,
              panels: [{
                key: nestedPanelKey,
                visualizations: [],
              }]
            }],
          }]
        }]
      }]
    }]
  };

  it.each`
  dossierDefinition | expectedVisualizationInfo

  ${dossierDefinitionWithoutPanelStacks}                                    | ${expectedVisualizationInfoWithoutPanelStacks}
  ${dossierDefinitionWithoutPanelStacksAndExpectedVisualization}            | ${null}
  ${dossierDefinitionWithPanelStacks}                                       | ${expectedVisualizationInfoWithPanelStacks}
  ${dossierDefinitionWithPanelStacksAndWithoutExpectedVisualization}        | ${null}
  ${dossierDefinitionWithNestedPanelStacks}                                 | ${expectedVisualizationInfoWithNestedPanelStacks}
  ${dossierDefinitionWithNestedPanelStacksAndWithoutExpectedVisualization}  | ${null}

  `('should call getVisualizationInfo and get expectedVisualizationInfo for each of the dossier definitions', async ({ dossierDefinition, expectedVisualizationInfo }) => {
  // given
  jest.spyOn(mstrObjectRestService, 'getDossierInstanceDefinition').mockResolvedValue(dossierDefinition);
  // when
  const newVisualizationInfo = await mstrObjectRestService
    .getVisualizationInfo(projectId, objectId, visualizationKey, dossierInstance);
    // then
  expect(newVisualizationInfo).toStrictEqual(expectedVisualizationInfo);
});
});
