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
      key: `${chapterKey}_1`,
      name: `${chapterName}_1`,
      pages: [{
        key: `${pageKey}_1`,
        name: `${pageName}_1`,
        visualizations: [
          {
            key: `${visualizationKey}_1`
          }
        ]
      }]
    },
    {
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
      key: `${chapterKey}_1`,
      name: `${chapterName}_1`,
      pages: [{
        key: `${pageKey}_1`,
        name: `${pageName}_1`,
        visualizations: [
          {
            key: `${visualizationKey}_1`
          }
        ]
      }]
    },
    {
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
      key: `${chapterKey}_1`,
      name: `${chapterName}_1`,
      pages: [{
        key: `${pageKey}_1`,
        name: `${pageName}_1`,
        visualizations: [
          {
            key: `${visualizationKey}_1`
          }
        ],
        panelStacks: [{
          key: `${panelStackKey}_1`,
          panels: [{
            key: `${panelKey}_1`,
            visualizations: [{
              key: `${visualizationKey}_2`
            }],
          }]
        }]
      }]
    },
    {
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
      key: `${chapterKey}_1`,
      name: `${chapterName}_1`,
      pages: [{
        key: `${pageKey}_1`,
        name: `${pageName}_1`,
        visualizations: [
          {
            key: `${visualizationKey}_1`
          }
        ],
        panelStacks: [{
          key: `${panelStackKey}_1`,
          panels: [{
            key: `${panelKey}_1`,
            visualizations: [{
              key: `${visualizationKey}_2`
            }],
          }]
        }]
      }]
    },
    {
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
      key: `${chapterKey}_1`,
      name: `${chapterName}_1`,
      pages: [{
        key: `${pageKey}_1`,
        name: `${pageName}_1`,
        visualizations: [{
          key: `${visualizationKey}_1`
        }],
        panelStacks: [{
          key: `${panelStackKey}_1`,
          panels: [{
            key: `${panelKey}_1`,
            visualizations: [{
              key: `${visualizationKey}_2`
            }],
            panelStacks: [{
              key: `${nestedPanelStackKey}_1`,
              panels: [{
                key: `${nestedPanelKey}_1`,
                visualizations: [{
                  key: `${visualizationKey}_3`
                }],
              }]
            }],
          }]
        }]
      }]
    },
    {
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
      key: `${chapterKey}_1`,
      name: `${chapterName}_1`,
      pages: [{
        key: `${pageKey}_1`,
        name: `${pageName}_1`,
        visualizations: [{
          key: `${visualizationKey}_1`
        }],
        panelStacks: [{
          key: `${panelStackKey}_1`,
          panels: [{
            key: `${panelKey}_1`,
            visualizations: [{
              key: `${visualizationKey}_2`
            }],
            panelStacks: [{
              key: `${nestedPanelStackKey}_1`,
              panels: [{
                key: `${nestedPanelKey}_1`,
                visualizations: [{
                  key: `${visualizationKey}_3`
                }],
              }]
            }],
          }]
        }]
      }]
    },
    {
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
  dossierDefinition                                                         | expectedVisualizationInfo                           | testName

  ${dossierDefinitionWithoutPanelStacks}                                    | ${expectedVisualizationInfoWithoutPanelStacks}      | ${'no panel stacks'} 
  ${dossierDefinitionWithoutPanelStacksAndExpectedVisualization}            | ${null}                                             | ${'no panel stacks and no expected visualization'} 
  ${dossierDefinitionWithPanelStacks}                                       | ${expectedVisualizationInfoWithPanelStacks}         | ${'panel stack'} 
  ${dossierDefinitionWithPanelStacksAndWithoutExpectedVisualization}        | ${null}                                             | ${'panel stack and no expected visualization'} 
  ${dossierDefinitionWithNestedPanelStacks}                                 | ${expectedVisualizationInfoWithNestedPanelStacks}   | ${'nested panel stack'} 
  ${dossierDefinitionWithNestedPanelStacksAndWithoutExpectedVisualization}  | ${null}                                             | ${'nested panel stack and no expected visualization'} 

  `('should call getVisualizationInfo and get expectedVisualizationInfo for "$testName" dossier definition', async ({ dossierDefinition, expectedVisualizationInfo }) => {
  // given
  jest.spyOn(mstrObjectRestService, 'getDossierInstanceDefinition').mockResolvedValue(dossierDefinition);
  // when
  const newVisualizationInfo = await mstrObjectRestService.getVisualizationInfo(
    projectId, objectId, visualizationKey, dossierInstance
  );
  // then
  expect(newVisualizationInfo).toStrictEqual(expectedVisualizationInfo);
});
});
