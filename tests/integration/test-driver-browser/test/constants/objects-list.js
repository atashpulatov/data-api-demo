export const objectsList = {
  reports: {
    blankReport: 'Blank Report',
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
    detailsReport: '0 -- Response Predictor Dataset',
    report1_5M: '1,5M Sales Records',
    filtered: 'All data filtered',
    secureDataFiltering: 'Revenue by Region and Category - secure data',
    secureDataAlwaysWorking: 'Secure data - always working',
    nestedPrompt: 'Report with nested prompt',
    over100k: '100010 rows report',
    marginReport: 'Report 1048576 rows',
    numberFormating: 'Number Formatting',
    grpahReport: 'report graph',
    gridReport: 'Grid/graph',
    basicSubtotalsReport: 'Report Totals Subtotals 1',
    categorySubCategory: 'CategorySubCategoryQuarter',
    withoutSubtotals: {
      basicReport: 'Report without subtotals',
      reportBasedOnIntelligentCube: 'Report based on cube without subtotals',
      promptedReport: 'Prompted report without subtotals',
      reportWithCrosstabs: 'Report with crosstab and without subtotals',
      promptedReportWithCrosstabs: 'Prompted report with crosstab and without subtotals',
      dataset: '100 Sales Records.csv'
    },
    longReportWithInvalidCharacters: {
      sourceName: '01. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&\'()*+,-:;<=>@/`testtesttes/km123456',
      excelTableNameStart: '_01___________________________________Report_for_testing_binding_and_special_characters',
      excelTableFullName: '_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_TIMESTAMP'
    },
    basic01Report: {
      sourceName: '01 Basic Report',
      excelTableNameStart: '_01_Basic_Report',
      excelTableFullName: '_01_Basic_Report_TIMESTAMP'
    }
  },

  datasets: {
    datasetSQL: 'DATA_IMPORT_SQL_STATEMENT',
    basicDataset: '100_dataset',
    notPublished: 'not published dataset',
    cubeLimitProject: 'Limit Project 1,5M Sales Records.csv',
    notSupportedCube: 'multi table cube',
    salesRecords1k: '1k Sales Records.csv',
  },

  dossiers: {
    complexDossier: {
      name: 'Complex dossier (20 visualizations)',
      timeToOpen: 10000,
      // TODO: Pages
      visualizations: {
        heatMap: '#mstr191',
        grid: '#mstr227',
        barChart: '#mstr271',
        lineChart: '#mstr444',
        areaChart: '#mstr421',
        bubbleChart: '#mstr490',
        pieChart: '#mstr310',
        comboChart: '#mstr557',
        geospatialService: '#mstr338',
        network: '#mstr631',
        histogram: '#mstr131',
        boxPlot: '#mstr212',
        waterfall: '#mstr248',
        map: '#mstr324',
        KPI: '#mstr287',
      },
    },
    visualizationManipulation: {
      name: 'Visualization manipulation',
      visualizations: {
        visualization1: {
          name: '#mstr106',
          gridTableId: '#mstr121',
          getTableItemAt: (firstIndex, secondIndex) => `#mstr149 > table > tbody > tr:nth-child(${firstIndex}) > td:nth-child(${secondIndex})`,
        }
      },
    },
    interactiveDossier: { name: 'Dossier for interactive components', },
    customVisualizations: {
      name: 'Custom Visualizations',
      visualizations: { GoogleTimeline: '#mstr114', }
    },

    userActivityDossier: {
      name: 'User Activity',
      visualizations: {
        accounts: '#mstr162',
        dailyActiveAccounts: '#mstr131',
      }
    },
    promptedDossier: {
      name: 'Prompted dossier',
      visualizations: { vis1: '#mstr106' }
    }
  }
};
