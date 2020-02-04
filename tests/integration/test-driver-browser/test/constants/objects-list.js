export const objects = {
  reports: {
    reportXML: 'Report accessing XML file',
    notSupportedFeatures: 'Report with Page by, Advanced Sorting, Thresholds, Outline, Banding, Merge cells & Multiform attributes',
    seasonalReport: 'Seasonal Report',
    basicReport: '100_report',
    metricExpPromptedReport: 'Report with prompt - Expression prompt (Metric Qualification Prompt on Revenue) | Not required | Not default',
    attributeExprPromptedReport: 'Report with prompt - Expression prompt (Attribute Qualification Prompt on Year) | Required | Not default',
    numericPromptedReport: 'Report with prompt - Value prompt - Numeric (Year) | Required | Default answer',
    textPromptedReport: 'Report with prompt - Value prompt - Text (Category) | Not required | Default answer',
    hierarchyExpPromptedReport: 'Report with prompt - Expression prompt (Hierarchy Qualification Prompt) | Not required | Default',
    objectPromptedReport: 'Report with prompt - Object prompt | Required | Default answer',
    valueDayPromptReport: 'Report with prompt - Value prompt - Date (Day) | Required | No default answer',
    bigDecimalPromptedReport: 'Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer',
    attributePromptedReport: 'Report with prompt - Attribute element prompt of Category | Required | Not default',
    hierarchyPromptedReport: 'Report with prompt - Hierarchy prompt | Not required | Default',
    multiplePromptsReport: 'Report with multiple prompts.',
    report1k: '1k report',
    report1_5M: '1,5M Sales Records',
    filtered: 'All data filtered',
    secureDataFiltering: 'Revenue by Region and Category - secure data',
    secureDataAlwaysWorking: 'Secure data - always working',
    nestedPrompt: 'Report with nested prompt',
    over100k: '100010 rows report',
    marginReport: '1048576 rows',
    numberFormating: 'Number Formatting',
    grpahReport: 'report graph',
    gridReport: 'Grid/graph',

  },

  datasets: {
    datasetSQL: 'DATA_IMPORT_SQL_STATEMENT',
    basicDataset: '100_dataset',
    notPublished: 'not published dataset',
    cubeLimitProject: '1,5M Sales Records.csv',
    notSupportedCube: 'multi table cube'
  },

  dossiers: {
    complexDossier: {
      name: 'Complex dossier (20 visualizations)',
      // TODO: Pages
      visualizations: {
        heatMap: '#mstr195',
        grid: '#mstr231',
        barChart: '#mstr275',
        lineChart: '#mstr463',
        areaChart: '#mstr440',
        bubbleChart: '#mstr509',
        pieChart: '#mstr314',
        comboChart: '#mstr576',
        geospatialService: '#mstr342',
        network: '#mstr650',
        histogram: '#mstr135',
        boxPlot: '#mstr216',
        waterfall: '#mstr252',
        map: '#mstr291',
        KPI: '#mstr328',
      },
    },
  },

};
