import { generateReportFilterText } from './object-filter-helper';
import { ReportFiltersDefinition } from './object-filter-helper-types';

describe('generateReportFilterText', () => {
  it('should generate the correct text for report filters', () => {
    // given
    const filterData = {
      dataSource: {
        filter: {
          tokens: [
            { type: 'character', value: '%' },
            { type: 'function', value: 'Not' },
            { type: 'character', value: '(' },
            { type: 'other', value: 'filter1' },
            { type: 'function', value: 'And' },
            { type: 'other', value: 'filter2' },
            { type: 'character', value: ')' },
          ],
        },
        dataTemplate: {
          units: [
            {
              type: 'metrics',
              limit: {
                tokens: [
                  { type: 'character', value: '%' },
                  { type: 'function', value: 'Not' },
                  { type: 'character', value: '(' },
                  { type: 'other', value: 'limit1' },
                  { type: 'function', value: 'Or' },
                  { type: 'other', value: 'limit2' },
                  { type: 'character', value: ')' },
                ],
              },
            },
            { type: 'other_type_to_be_ignored' },
          ],
        },
      },
      grid: {
        viewFilter: {
          tokens: [
            { type: 'character', value: '%' },
            { type: 'function', value: 'Not' },
            { type: 'character', value: '(' },
            { type: 'other', value: 'viewFilter1' },
            { type: 'function', value: 'Or' },
            { type: 'other', value: 'viewFilter2' },
            { type: 'character', value: ')' },
          ],
        },
        viewTemplate: {
          columns: {
            units: [
              {
                type: 'metrics',
                elements: [
                  {
                    limit: {
                      text: 'reference1 > 10',
                      tokens: [
                        [
                          {
                            'value': '%',
                            'type': 'character',
                          },
                          {
                            'value': 'Reference1',
                            'type': 'object_reference',
                          },
                          {
                            'value': '>',
                            'type': 'character',
                          },
                          {
                            'value': '10',
                            'type': 'integer',
                          },
                        ],
                      ],
                    },
                  },
                  {
                    limit: {
                      text: 'reference2 > 10',
                      tokens: [
                        [
                          {
                            'value': '%',
                            'type': 'character',
                          },
                          {
                            'value': 'Reference2',
                            'type': 'object_reference',
                          },
                          {
                            'value': '>',
                            'type': 'character',
                          },
                          {
                            'value': '10',
                            'type': 'integer',
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
              {
                type: 'other_type_to_be_ignored',
              },
            ],
          },
        },
      },
    } as ReportFiltersDefinition;

    // when
    const result = generateReportFilterText(filterData);
    console.log(result);
    // then
    expect(result.reportFilterText).toBe('Not ( filter1 And filter2 )');
    expect(result.reportLimitsText).toBe('Not ( limit1 Or limit2 )');
    expect(result.viewFilterText).toBe('Not ( viewFilter1 Or viewFilter2 )');
    expect(result.metricLimitsText).toBe('( reference1 > 10 ) And ( reference2 > 10 )');
  });
});
