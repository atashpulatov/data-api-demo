class MstrObjectType {
  mstrObjectType = {
    folder: {
      type: 8,
      subtypes: [2048],
      name: 'folder',
      request: 'folders',
    },
    report: {
      type: 3,
      subtypes: [768, 769, 774],
      name: 'report',
      request: 'reports',
    },
    dataset: {
      type: 3,
      subtypes: [776, 779],
      name: 'dataset',
      request: 'cubes',
    },
    dossier: {
      type: 55,
      subtypes: [14081],
      name: 'dossier',
      request: 'dossiers',
    },
    visualization: {
      type: 'undefined',
      subtypes: 'undefined',
      name: 'visualization',
      request: 'visualizations',
    },
  };

  visualizationType = {
    GRID: 'grid',
    COMPOUND_GRID: 'compound_grid',
    BAR_CHART: 'bar_chart',
    LINE_CHART: 'line_chart',
    AREA_CHART: 'area_chart',
    BUBBLE_CHART: 'bubble_chart',
    PIE_CHART: 'pie_chart',
    RING_CHART: 'ring_chart',
    COMBO_CHART: 'combo_chart',
    HISTOGRAM: 'histogram',
    BOX_PLOT: 'box_plot',
    WATERFALL: 'waterfall',
    GOOGLE_MAP: 'google_map',
    KPI: 'kpi',
    HEAT_MAP: 'heat_map',
    GEOSPATIAL_SERVICE: 'geosptial_service',
    NETWORK: 'network',
    IMAGE_LAYOUT: 'image_layout',
    ESRI_MAP: 'esri_map',
    MICROCHARTS: 'microcharts',
  };

  getMstrTypeBySubtype = (objectSubtype = null) => Object.values(this.mstrObjectType).find(
    (type) => type.subtypes.indexOf(objectSubtype) !== -1
  );

  getMstrTypeByName = (typeName) => {
    let checkedType;
    if (typeName.name) {
      checkedType = typeName.name;
    } else {
      checkedType = typeName;
    }
    return Object.values(this.mstrObjectType).find(
      (type) => type.name === checkedType.toLowerCase(),
    );
  };
}

const mstrObjectType = new MstrObjectType();
export default mstrObjectType;
