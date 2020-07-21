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
