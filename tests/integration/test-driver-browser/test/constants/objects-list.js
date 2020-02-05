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
        heatMap: '#mstr191',
        grid: '#mstr227',
        barChart: '#mstr271',
        lineChart: '#mstr459',
        areaChart: '#mstr436',
        bubbleChart: '#mstr505',
        pieChart: '#mstr310',
        comboChart: '#mstr572',
        geospatialService: '#mstr338',
        network: '#mstr646',
        histogram: '#mstr131',
        boxPlot: '#mstr212',
        waterfall: '#mstr248',
        map: '#mstr324',
        KPI: '#mstr287',
      },
    },
    visualizationManipulation:{
      name:'Visualization manipulation',
      visualizations: {
        visualization1 : {
          name: '#mstr106',
          gridTableId:'#mstr121',
          yearAttribute:'#mstr121 > table > tbody > tr:nth-child(1) > td:nth-child(1)',
          profitMetric:'#mstr121 > table > tbody > tr:nth-child(1) > td:nth-child(3)',
          revenueMetric:'#mstr121 > table > tbody > tr:nth-child(1) > td:nth-child(4)',
        }
      },
    },
    interactiveDossier: { name: 'Dossier for interactive components', },
  }
};
