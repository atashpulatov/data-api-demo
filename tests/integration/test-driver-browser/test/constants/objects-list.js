export const objectsList = {
  reports: {
    reportWithLongName: 'Report with very long name - This is a very long text to know what happens when plugging is dealing with files with such a long name it is important to see if it will add three dots at the end or if it is going to display the whole text',
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
    allPrompt: 'Report with all type of prompts (except nested)',
    grpahReport: 'report graph',
    gridReport: 'Grid/graph',
    basicSubtotalsReport: 'Report Totals Subtotals 1',
    categorySubCategory: 'CategorySubCategoryQuarter',
    reportToSortAttributeAndMetrics: 'Report with attributes and metrics to sort',
    mergedHeaderReport: 'Merged Header Report',
    PromptedReportWithandWithoutSubtotals: 'Prompted report with attributes with and without subtotals',
    withoutSubtotals: {
      basicReport: 'Report without subtotals',
      reportBasedOnIntelligentCubeWithoutSubtotals: 'Report based on cube without subtotals',
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
    },
    bindingInternationalisation: {
      polish: {
        sourceName: '01. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Polish Pójdźże, kiń tę chmurność w głąb flaszy!',
        excelTableNameStart: '_01___________________________________Polish_Pójdźże__kiń_tę_chmurność_w_głąb_flaszy_',
        excelTableFullName: '_01___________________________________Polish_Pójdźże__kiń_tę_chmurność_w_głąb_flaszy__TIMESTAMP'
      },
      german: {
        sourceName: '02. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» German Zwölf große Boxkämpfer jagen Viktor quer über den Sylter Deich',
        excelTableNameStart: '_02___________________________________German_Zwölf_große_Boxkämpfer_jagen_Viktor_quer_über_den_Sylter_Deich',
        excelTableFullName: '_02___________________________________German_Zwölf_große_Boxkämpfer_jagen_Viktor_quer_über_den_Sylter_Deich_TIMESTAMP'
      },
      french: {
        sourceName: '03. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» french Voyez le brick géant que j’examine près du wharf',
        excelTableNameStart: '_03___________________________________french_Voyez_le_brick_géant_que_j’examine_près_du_wharf',
        excelTableFullName: '_03___________________________________french_Voyez_le_brick_géant_que_j’examine_près_du_wharf_TIMESTAMP'
      },
      spanish: {
        sourceName: '04. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» spanish La cigüeña tocaba cada vez mejor el saxofón y el búho pedía kiwi y queso',
        excelTableNameStart: '_04___________________________________spanish_La_cigüeña_tocaba_cada_vez_mejor_el_saxofón_y_el_búho_pedía_kiwi_y_queso',
        excelTableFullName: '_04___________________________________spanish_La_cigüeña_tocaba_cada_vez_mejor_el_saxofón_y_el_búho_pedía_kiwi_y_queso_TIMESTAMP'
      },
      japanese: {
        sourceName: '05. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Japanese いろはにほへと　ちりぬるを　わかよたれそ　つねならむ　うゐのおくやま　けふこえて　あさきゆめみし　ゑひもせす 色は匂へど　散りぬるを　我が世誰ぞ　常ならむ　有為の奥山　今日越えて　浅き夢見じ　酔ひもせず（ん）',
        excelTableNameStart: '_05___________________________________Japanese_いろはにほへと　ちりぬるを　わかよたれそ　つねならむ　うゐのおくやま　けふこえて　あさきゆめみし　ゑひもせす_色は匂へど　散りぬるを　我が世誰ぞ　常ならむ　有為の奥山　今日越えて　浅き夢見じ　酔ひもせず（ん）',
        excelTableFullName: '_05___________________________________Japanese_いろはにほへと　ちりぬるを　わかよたれそ　つねならむ　うゐのおくやま　けふこえて　あさきゆめみし　ゑひもせす_色は匂へど　散りぬるを　我が世誰ぞ　常ならむ　有為の奥山　今日越えて　浅き夢見じ　酔ひもせず（ん）_TIMESTAMP'
      },
      chineseTraditional: {
        sourceName: '06. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Chinese Traditional 視野無限廣，窗外有藍天',
        excelTableNameStart: '_06___________________________________Chinese_Traditional_視野無限廣，窗外有藍天',
        excelTableFullName: '_06___________________________________Chinese_Traditional_視野無限廣，窗外有藍天_TIMESTAMP'
      },
      korean: {
        sourceName: '07. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» korean 키스의 고유조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다',
        excelTableNameStart: '_07___________________________________korean_키스의_고유조건은_입술끼리_만나야_하고_특별한_기술은_필요치_않다',
        excelTableFullName: '_07___________________________________korean_키스의_고유조건은_입술끼리_만나야_하고_특별한_기술은_필요치_않다_TIMESTAMP'
      },
      danish: {
        sourceName: '08. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Danish Høj bly gom vandt fræk sexquiz på wc',
        excelTableNameStart: '_08___________________________________Danish_Høj_bly_gom_vandt_fræk_sexquiz_på_wc',
        excelTableFullName: '_08___________________________________Danish_Høj_bly_gom_vandt_fræk_sexquiz_på_wc_TIMESTAMP'
      },
      portuguese: {
        sourceName: '09. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Portuguese À noite, vovô Kowalsky vê o ímã cair no pé do pingüim queixoso e vovó põe açúcar no chá de tâmaras do jabuti feliz',
        excelTableNameStart: '_09___________________________________Portuguese_À_noite__vovô_Kowalsky_vê_o_ímã_cair_no_pé_do_pingüim_queixoso_e_vovó_põe_açúcar_no_chá_de_tâmaras_do_jabuti_feliz',
        excelTableFullName: '_09___________________________________Portuguese_À_noite__vovô_Kowalsky_vê_o_ímã_cair_no_pé_do_pingüim_queixoso_e_vovó_põe_açúcar_no_chá_de_tâmaras_do_jabuti_feliz_TIMESTAMP'
      },
      swedish: {
        sourceName: '10. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Swedish Flygande bäckasiner söka hwila på mjuka tuvor',
        excelTableNameStart: '_10___________________________________Swedish_Flygande_bäckasiner_söka_hwila_på_mjuka_tuvor',
        excelTableFullName: '_10___________________________________Swedish_Flygande_bäckasiner_söka_hwila_på_mjuka_tuvor_TIMESTAMP'
      },
      chineseSimplified: {
        sourceName: '11. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Chinese Simplified 中国智造，慧及全球 0123456789',
        excelTableNameStart: '_11___________________________________Chinese_Simplified_中国智造，慧及全球_0123456789',
        excelTableFullName: '_11___________________________________Chinese_Simplified_中国智造，慧及全球_0123456789_TIMESTAMP'
      },
    },
    BasicReportWBrand: 'Basic Report with brand',
  },

  datasets: {
    datasetSQL: 'DATA_IMPORT_SQL_STATEMENT',
    basicDataset: '100_dataset',
    notPublished: 'not published dataset',
    cubeLimitProject: '500k Sales Records.csv',
    notSupportedCube: 'multi table cube',
    salesRecords1k: '1k Sales Records.csv',
    salesData: 'Sales Data',
  },

  dossiers: {
    nested: {
      name: 'Dossier with all prompts (incl. nested)',
      prompt1: '#id_mstr105',
      prompt2: '#id_mstr142_txt',
      prompt3: '#id_mstr238ListContainer > div.mstrListBlockItem',
      prompt4: '#id_mstr198_txt',
      prompt5: '#id_mstr68 > table > tbody > tr:nth-child(7) > td.mstrPromptTOCListItemTitle > span',
      prompt6: '#id_mstr249_txt',
      prompt7: '#id_mstr243_txt',
      prompt8: '#id_mstr255_txt',
      prompt9: '#id_mstr68 > table > tbody > tr:nth-child(10) > td.mstrPromptTOCListItemTitle > span',
      prompt10: '#id_mstr263_txt',
      prompt11: '#mstr129',
    },
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
    },
    oneMillionAndLongName: {
      name: '1 MILION rows This is a very long name for a dossier so that we can test how we display long path to dossier visualisationsNew Dossier',
      visualization: '#mstr106'
    },
  },
};
