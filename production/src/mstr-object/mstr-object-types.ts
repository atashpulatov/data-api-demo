type FolderType = {
  type: 8;
  subtypes: [2048];
  name: 'folder';
  request: 'folders';
};

type ReportType = {
  type: 3;
  subtypes: [768, 769, 774];
  name: 'report';
  request: 'reports';
};

type DatasetType = {
  type: 3;
  subtypes: [776, 779];
  name: 'dataset';
  request: 'cubes';
};

type DossierType = {
  type: 55;
  subtypes: [14081];
  name: 'dossier';
  request: 'dossiers';
};

type VisualizationType = {
  type: 'undefined';
  subtypes: 'undefined';
  name: 'visualization';
  request: 'visualizations';
};

export type MstrObjectTypes =
  | FolderType
  | ReportType
  | DatasetType
  | DossierType
  | VisualizationType;

export enum VisualizationTypes {
  GRID = 'grid',
  COMPOUND_GRID = 'compound_grid',
  BAR_CHART = 'bar_chart',
  LINE_CHART = 'line_chart',
  AREA_CHART = 'area_chart',
  BUBBLE_CHART = 'bubble_chart',
  PIE_CHART = 'pie_chart',
  RING_CHART = 'ring_chart',
  COMBO_CHART = 'combo_chart',
  HISTOGRAM = 'histogram',
  BOX_PLOT = 'box_plot',
  WATERFALL = 'waterfall',
  GOOGLE_MAP = 'google_map',
  KPI = 'kpi',
  HEAT_MAP = 'heat_map',
  GEOSPATIAL_SERVICE = 'geosptial_service',
  NETWORK = 'network',
  IMAGE_LAYOUT = 'image_layout',
  ESRI_MAP = 'esri_map',
  MICROCHARTS = 'microcharts',
}
