export const reportV2 = {
  id: '0ED85DEE11E9772400000080EFC5116D',
  name: 'airline-sample-data--tabular-with-multiform',
  instanceId: '23058A7E11E98B7620BF0080EF15AAB5',
  status: 1,
  source: {
    id: '9A27E1B011E97721088D0080EFA5D16E',
    name: 'airline-sample-data--with-multiform',
  },
  definition: {
    grid: {
      crossTab: true,
      metricsPosition: {
        axis: 'columns',
        index: 1,
      },
      rows: [
        {
          id: '9BC4691C11E97721AF570080EF55306C',
          name: 'Year',
          type: 'attribute',
          forms: [
            {
              id: '45C11FA478E745FEA08D781CEA190FE5',
              name: 'ID',
              dataType: 33,
              baseFormType: 3,
            },
          ],
          elements: [
            {
              id: 'h2009;9BC4691C11E97721AF570080EF55306C',
              formValues: [
                '2009',
              ],
            },
            {
              id: 'h2010;9BC4691C11E97721AF570080EF55306C',
              formValues: [
                '2010',
              ],
            },
          ],
        },
        {
          id: '9BC470B011E977217DA10080EF55306D',
          name: 'Month',
          type: 'attribute',
          forms: [
            {
              id: '45C11FA478E745FEA08D781CEA190FE5',
              name: 'ID',
              dataType: 33,
              baseFormType: 3,
            },
          ],
          elements: [
            {
              id: 'hJanuary;9BC470B011E977217DA10080EF55306D',
              formValues: [
                'January',
              ],
            },
            {
              id: 'hFebruary;9BC470B011E977217DA10080EF55306D',
              formValues: [
                'February',
              ],
            },
            {
              id: 'hMarch;9BC470B011E977217DA10080EF55306D',
              formValues: [
                'March',
              ],
            },
            {
              id: 'j1;9BC470B011E977217DA10080EF55306D',
              subtotal: true,
              formValues: [
                'Total',
              ],
            },
          ],
        },
      ],
      columns: [
        {
          id: '1D5F4A7811E97722F1050080EF65506C',
          name: 'Origin Airport',
          type: 'attribute',
          forms: [
            {
              id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
              name: 'DESC',
              dataType: 33,
              baseFormType: 3,
            },
            {
              id: '45C11FA478E745FEA08D781CEA190FE5',
              name: 'ID',
              dataType: 33,
              baseFormType: 2,
            },
          ],
          elements: [
            {
              id: 'h1;1D5F4A7811E97722F1050080EF65506C',
              formValues: [
                'BWI',
                '1',
              ],
            },
            {
              id: 'h2;1D5F4A7811E97722F1050080EF65506C',
              formValues: [
                'DCA',
                '2',
              ],
            },
          ],
        },
        {
          id: '00000000000000000000000000000000',
          name: 'Metrics',
          type: 'templateMetrics',
          elements: [
            {
              id: '9BC486D611E977217DA10080EF55306D',
              name: 'Flights Delayed',
              type: 'Metric',
              min: 0,
              max: 10000,
              dataType: 6,
              numberFormatting: {
                category: 7,
                decimalPlaces: 0,
                formatString: '0',
              },
            },
            {
              id: '9BC4944611E977217DA10080EF55306D',
              name: 'Avg Delay (min)',
              type: 'Metric',
              min: 0,
              max: 10000,
              dataType: 6,
              numberFormatting: {
                category: 7,
                decimalPlaces: 0,
                formatString: '0',
              },
            },
            {
              id: '9BC4778611E977217DA10080EF55306D',
              name: 'On-Time',
              type: 'Metric',
              min: 0,
              max: 10000,
              dataType: 6,
              numberFormatting: {
                category: 7,
                decimalPlaces: 0,
                formatString: '0',
              },
            },
          ],
        },
      ],
      pageBy: [
        {
          id: '9BC4544A11E97721AF570080EF55306C',
          name: 'Airline Name',
          type: 'attribute',
          forms: [
            {
              id: '45C11FA478E745FEA08D781CEA190FE5',
              name: 'ID',
              dataType: 33,
              baseFormType: 3,
            },
          ],
          elements: [
            {
              id: 'hComair Inc.;9BC4544A11E97721AF570080EF55306C',
              formValues: [
                'Comair Inc.',
              ],
            },
            {
              id: 'hMesa Airlines Inc.;9BC4544A11E97721AF570080EF55306C',
              formValues: [
                'Mesa Airlines Inc.',
              ],
            },
          ],
        },
        {
          id: '9BC4625A11E97721AF570080EF55306C',
          name: 'Day of Week',
          type: 'attribute',
          forms: [
            {
              id: '45C11FA478E745FEA08D781CEA190FE5',
              name: 'ID',
              dataType: 33,
              baseFormType: 3,
            },
          ],
          elements: [
            {
              id: 'hMonday;9BC4625A11E97721AF570080EF55306C',
              formValues: [
                'Monday',
              ],
            },
            {
              id: 'hTuesday;9BC4625A11E97721AF570080EF55306C',
              formValues: [
                'Tuesday',
              ],
            },
          ],
        },
      ],
      sorting: {
        rows: [],
        columns: [],
      },
      thresholds: [],
    },
  },
  data: {
    currentPageBy: [
      0,
      0,
    ],
    paging: {
      current: 8,
      total: 8,
      offset: 0,
      limit: 100,
    },
    headers: {
      rows: [
        [
          0,
          0,
        ],
        [
          0,
          1,
        ],
        [
          0,
          2,
        ],
        [
          0,
          3,
        ],
        [
          1,
          0,
        ],
        [
          1,
          1,
        ],
        [
          1,
          2,
        ],
        [
          1,
          3,
        ],
      ],
      columns: [
        [
          0,
          0,
          0,
          1,
          1,
          1,
        ],
        [
          0,
          1,
          2,
          0,
          1,
          2,
        ],
      ],
    },
    metricValues: {
      raw: [
        [
          3139,
          17046.02,
          4543,
          2406,
          20915.41,
          3449,
        ],
        [
          1829,
          12610.65,
          5163,
          1749,
          14718.59,
          3704,
        ],
        [
          2977,
          15654.78,
          5248,
          2053,
          17608.82,
          3782,
        ],
        [
          7945,
          45311.46,
          14954,
          6208,
          53242.82,
          10935,
        ],
        [
          2940,
          15611.76,
          4808,
          1699,
          19524.66,
          4262,
        ],
        [
          2376,
          13586.74,
          4355,
          1591,
          17466.5,
          3682,
        ],
        [
          3294,
          17830.76,
          5140,
          1993,
          18595.95,
          4349,
        ],
        [
          8610,
          47029.27,
          14303,
          5283,
          55587.11,
          12293,
        ],
      ],
      formatted: [
        [
          '3139',
          '17,046.02',
          '4543',
          '2406',
          '20,915.41',
          '3449',
        ],
        [
          '1829',
          '12,610.65',
          '5163',
          '1749',
          '14,718.59',
          '3704',
        ],
        [
          '2977',
          '15,654.78',
          '5248',
          '2053',
          '17,608.82',
          '3782',
        ],
        [
          '7945',
          '45,311.46',
          '14954',
          '6208',
          '53,242.82',
          '10935',
        ],
        [
          '2940',
          '15,611.76',
          '4808',
          '1699',
          '19,524.66',
          '4262',
        ],
        [
          '2376',
          '13,586.74',
          '4355',
          '1591',
          '17,466.50',
          '3682',
        ],
        [
          '3294',
          '17,830.76',
          '5140',
          '1993',
          '18,595.95',
          '4349',
        ],
        [
          '8610',
          '47,029.27',
          '14303',
          '5283',
          '55,587.11',
          '12293',
        ],
      ],
      extras: [
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
        [
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
          { mi: 0, },
          { mi: 1, },
          { mi: 2, },
        ],
      ],
    },
  },
};

export const reportWithMetricsInRows = {
  name: 'Report with metrics in rows',
  id: '26004D7411EA33B224A40080EF7547C0',
  instanceId: 'F085A9A411EACCB9C0BD0080EFA5B1CA',
  status: 1,
  definition: {
    grid: {
      crossTab: true,
      metricsPosition: {
        axis: 'rows',
        index: 2
      },
      rows: [
        {
          name: 'Region',
          id: '8D679D4B11D3E4981000E787EC6DE8A4',
          type: 'attribute',
          forms: [
            {
              id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
              name: 'DESC',
              dataType: 'varChar',
              baseFormCategory: 'DESC',
              baseFormType: 'text'
            }
          ],
          elements: [
            {
              formValues: [
                'Central'
              ],
              id: 'h4;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Mid-Atlantic'
              ],
              id: 'h2;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Northeast'
              ],
              id: 'h1;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Northwest'
              ],
              id: 'h6;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'South'
              ],
              id: 'h5;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Southeast'
              ],
              id: 'h3;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Southwest'
              ],
              id: 'h7;8D679D4B11D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Web'
              ],
              id: 'h12;8D679D4B11D3E4981000E787EC6DE8A4'
            }
          ]
        },
        {
          name: 'Category',
          id: '8D679D3711D3E4981000E787EC6DE8A4',
          type: 'attribute',
          forms: [
            {
              id: 'CCFBE2A5EADB4F50941FB879CCF1721C',
              name: 'DESC',
              dataType: 'nVarChar',
              baseFormCategory: 'DESC',
              baseFormType: 'text'
            }
          ],
          elements: [
            {
              formValues: [
                'Books'
              ],
              id: 'h1;8D679D3711D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Electronics'
              ],
              id: 'h2;8D679D3711D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Movies'
              ],
              id: 'h3;8D679D3711D3E4981000E787EC6DE8A4'
            },
            {
              formValues: [
                'Music'
              ],
              id: 'h4;8D679D3711D3E4981000E787EC6DE8A4'
            }
          ]
        },
        {
          name: 'Metrics',
          id: '00000000000000000000000000000000',
          type: 'templateMetrics',
          elements: [
            {
              name: 'Profit',
              id: '4C051DB611D3E877C000B3B2D86C964F',
              type: 'metric',
              min: 9154.9189,
              max: 1053304.9179999996,
              dataType: 'double',
              numberFormatting: {
                category: 1,
                decimalPlaces: 0,
                thousandSeparator: true,
                currencySymbol: '$',
                currencyPosition: 0,
                formatString: '"$"#,##0;("$"#,##0)',
                negativeType: 3
              }
            },
            {
              name: 'Revenue',
              id: '4C05177011D3E877C000B3B2D86C964F',
              type: 'metric',
              min: 129175.15,
              max: 5962708.600000001,
              dataType: 'double',
              numberFormatting: {
                category: 1,
                decimalPlaces: 0,
                thousandSeparator: true,
                currencySymbol: '$',
                currencyPosition: 0,
                formatString: '"$"#,##0',
                negativeType: 1
              }
            },
            {
              name: 'Cost',
              id: '7FD5B69611D5AC76C000D98A4CC5F24F',
              type: 'metric',
              min: 101145.122,
              max: 4909403.682000001,
              dataType: 'double',
              numberFormatting: {
                category: 1,
                decimalPlaces: 0,
                thousandSeparator: true,
                currencySymbol: '$',
                currencyPosition: 0,
                formatString: '"$"#,##0',
                negativeType: 1
              }
            }
          ]
        }
      ],
      columns: [],
      pageBy: [],
      subtotals: {
        defined: false,
        visible: true
      },
      sorting: {
        rows: [],
        columns: []
      },
      thresholds: []
    }
  },
  data: {
    currentPageBy: [],
    paging: {
      total: 96,
      current: 96,
      offset: 0,
      limit: 20000
    },
    headers: {
      rows: [
        [
          0,
          0,
          0
        ],
        [
          0,
          0,
          1
        ],
        [
          0,
          0,
          2
        ],
        [
          0,
          1,
          0
        ],
        [
          0,
          1,
          1
        ],
        [
          0,
          1,
          2
        ],
        [
          0,
          2,
          0
        ],
        [
          0,
          2,
          1
        ],
        [
          0,
          2,
          2
        ],
        [
          0,
          3,
          0
        ],
        [
          0,
          3,
          1
        ],
        [
          0,
          3,
          2
        ],
        [
          1,
          0,
          0
        ],
        [
          1,
          0,
          1
        ],
        [
          1,
          0,
          2
        ],
        [
          1,
          1,
          0
        ],
        [
          1,
          1,
          1
        ],
        [
          1,
          1,
          2
        ],
        [
          1,
          2,
          0
        ],
        [
          1,
          2,
          1
        ],
        [
          1,
          2,
          2
        ],
        [
          1,
          3,
          0
        ],
        [
          1,
          3,
          1
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          0,
          0
        ],
        [
          2,
          0,
          1
        ],
        [
          2,
          0,
          2
        ],
        [
          2,
          1,
          0
        ],
        [
          2,
          1,
          1
        ],
        [
          2,
          1,
          2
        ],
        [
          2,
          2,
          0
        ],
        [
          2,
          2,
          1
        ],
        [
          2,
          2,
          2
        ],
        [
          2,
          3,
          0
        ],
        [
          2,
          3,
          1
        ],
        [
          2,
          3,
          2
        ],
        [
          3,
          0,
          0
        ],
        [
          3,
          0,
          1
        ],
        [
          3,
          0,
          2
        ],
        [
          3,
          1,
          0
        ],
        [
          3,
          1,
          1
        ],
        [
          3,
          1,
          2
        ],
        [
          3,
          2,
          0
        ],
        [
          3,
          2,
          1
        ],
        [
          3,
          2,
          2
        ],
        [
          3,
          3,
          0
        ],
        [
          3,
          3,
          1
        ],
        [
          3,
          3,
          2
        ],
        [
          4,
          0,
          0
        ],
        [
          4,
          0,
          1
        ],
        [
          4,
          0,
          2
        ],
        [
          4,
          1,
          0
        ],
        [
          4,
          1,
          1
        ],
        [
          4,
          1,
          2
        ],
        [
          4,
          2,
          0
        ],
        [
          4,
          2,
          1
        ],
        [
          4,
          2,
          2
        ],
        [
          4,
          3,
          0
        ],
        [
          4,
          3,
          1
        ],
        [
          4,
          3,
          2
        ],
        [
          5,
          0,
          0
        ],
        [
          5,
          0,
          1
        ],
        [
          5,
          0,
          2
        ],
        [
          5,
          1,
          0
        ],
        [
          5,
          1,
          1
        ],
        [
          5,
          1,
          2
        ],
        [
          5,
          2,
          0
        ],
        [
          5,
          2,
          1
        ],
        [
          5,
          2,
          2
        ],
        [
          5,
          3,
          0
        ],
        [
          5,
          3,
          1
        ],
        [
          5,
          3,
          2
        ],
        [
          6,
          0,
          0
        ],
        [
          6,
          0,
          1
        ],
        [
          6,
          0,
          2
        ],
        [
          6,
          1,
          0
        ],
        [
          6,
          1,
          1
        ],
        [
          6,
          1,
          2
        ],
        [
          6,
          2,
          0
        ],
        [
          6,
          2,
          1
        ],
        [
          6,
          2,
          2
        ],
        [
          6,
          3,
          0
        ],
        [
          6,
          3,
          1
        ],
        [
          6,
          3,
          2
        ],
        [
          7,
          0,
          0
        ],
        [
          7,
          0,
          1
        ],
        [
          7,
          0,
          2
        ],
        [
          7,
          1,
          0
        ],
        [
          7,
          1,
          1
        ],
        [
          7,
          1,
          2
        ],
        [
          7,
          2,
          0
        ],
        [
          7,
          2,
          1
        ],
        [
          7,
          2,
          2
        ],
        [
          7,
          3,
          0
        ],
        [
          7,
          3,
          1
        ],
        [
          7,
          3,
          2
        ]
      ],
      columns: []
    },
    metricValues: {
      raw: [
        [
          81331.078
        ],
        [
          376835.95
        ],
        [
          295504.8719999998
        ],
        [
          619713.9809999996
        ],
        [
          3506062.25
        ],
        [
          2886348.2689999994
        ],
        [
          37008.9714999996
        ],
        [
          589356.5
        ],
        [
          552347.5285000002
        ],
        [
          26268.7386000005
        ],
        [
          557111.55
        ],
        [
          530842.8113999993
        ],
        [
          72793.727
        ],
        [
          337656
        ],
        [
          264862.2729999999
        ],
        [
          545693.4061999999
        ],
        [
          3106940.3000000003
        ],
        [
          2561246.893799999
        ],
        [
          32295.6129999998
        ],
        [
          518969.3499999999
        ],
        [
          486673.737
        ],
        [
          22300.8293000001
        ],
        [
          489049.4
        ],
        [
          466748.5707
        ],
        [
          139931.5520000002
        ],
        [
          646421.2500000001
        ],
        [
          506489.6979999999
        ],
        [
          1053304.9179999996
        ],
        [
          5962708.600000001
        ],
        [
          4909403.682000001
        ],
        [
          63070.5464999999
        ],
        [
          1001561.0499999999
        ],
        [
          938490.5035000001
        ],
        [
          44424.6753000017
        ],
        [
          943723.6500000001
        ],
        [
          899298.9746999977
        ],
        [
          28030.028
        ],
        [
          129175.15
        ],
        [
          101145.122
        ],
        [
          217311.2240000001
        ],
        [
          1234849.9
        ],
        [
          1017538.6759999997
        ],
        [
          12489.3355
        ],
        [
          200893.65
        ],
        [
          188404.3144999999
        ],
        [
          9154.9189
        ],
        [
          196268.5
        ],
        [
          187113.5810999999
        ],
        [
          86805.53
        ],
        [
          406110.1000000002
        ],
        [
          319304.5699999999
        ],
        [
          653980.0087999997
        ],
        [
          3741752.65
        ],
        [
          3087772.6411999995
        ],
        [
          38841.0449999995
        ],
        [
          636053.8500000002
        ],
        [
          597212.8050000003
        ],
        [
          27329.4282000009
        ],
        [
          605363.7
        ],
        [
          578034.271799999
        ],
        [
          36619.361
        ],
        [
          170444.65
        ],
        [
          133825.289
        ],
        [
          271833.0579999999
        ],
        [
          1552007.4000000001
        ],
        [
          1280174.3419999997
        ],
        [
          16337.1695
        ],
        [
          264285.8499999999
        ],
        [
          247948.6804999999
        ],
        [
          11885.7424000001
        ],
        [
          253213.15
        ],
        [
          241327.4075999998
        ],
        [
          60696.999
        ],
        [
          280796.4500000001
        ],
        [
          220099.4509999999
        ],
        [
          453973.4927999997
        ],
        [
          2562059.8
        ],
        [
          2108086.3071999997
        ],
        [
          27574.1469999999
        ],
        [
          435871.15
        ],
        [
          408297.0030000001
        ],
        [
          19086.5703000001
        ],
        [
          415404.3000000001
        ],
        [
          396317.7296999998
        ],
        [
          63070.0770000002
        ],
        [
          292654.9
        ],
        [
          229584.8229999997
        ],
        [
          473792.7087999997
        ],
        [
          2724921.95
        ],
        [
          2251129.2412000005
        ],
        [
          27081.6485000007
        ],
        [
          451952.05
        ],
        [
          424870.4014999992
        ],
        [
          19593.1005000014
        ],
        [
          433233.1499999999
        ],
        [
          413640.0494999987
        ]
      ]
    }
  }
};
