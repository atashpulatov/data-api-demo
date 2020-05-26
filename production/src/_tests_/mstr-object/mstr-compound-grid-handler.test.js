import { calculateColumnHeaderHeight, parseColumnSets, renderCompoundGridColumnHeaders, renderRows, renderCompoundGridRowHeaders } from '../../mstr-object/mstr-compound-grid-handler';
import regularCompoundJSON from './compound-grid/Regular Compound Grid.json';
import onlyAttrCompoundJSON from './compound-grid/Compound Grid with Only Attribute on Row.json';
import metricsInRowCompoundJSON from './compound-grid/Compound Grid with Metrics on Row.json';
import oneEmptyCompoundJSON from './compound-grid/Compound Grid with Empty Column Set.json';

describe('Compound Grid Handler', () => {
  it('should group columnSets into a single array', () => {
    // given
    const { columnSets } = regularCompoundJSON.definition.grid;
    const expectedLength = 4;

    // when
    const columns = parseColumnSets(columnSets);

    // then
    expect(columns).toHaveLength(expectedLength);
  });

  it('should create table rows from columnSets', () => {
    // given
    const { metricValues, paging } = regularCompoundJSON.data;
    const expected1stRow = [null, null, null, 83891.267, 159665.636, 122315.7, null];
    const expectedLastRow = [6708.9268000006, null, null, null, 308419.5428999996, 237860.2502999999, 176310.18];

    // when
    const metrics = renderRows(metricValues.columnSets, paging.current);

    // then
    expect(metrics[0]).toEqual(expected1stRow);
    expect(metrics.pop()).toEqual(expectedLastRow);
  });

  it('should return empty array when no columnSets are present', () => {
    // given
    const { columnSets } = onlyAttrCompoundJSON.definition.grid;
    const expectedLength = 0;

    // when
    const columns = parseColumnSets(columnSets);

    // then
    expect(columns).toHaveLength(expectedLength);
  });

  it('should calculate bounding height of column headers', () => {
    // given
    const { columnSets } = regularCompoundJSON.data.headers;
    const expectedHeight = 2;

    // when
    const height = calculateColumnHeaderHeight(columnSets);

    // then
    expect(height).toEqual(expectedHeight);
  });

  it('should create normalized column headers', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));
    const { columnSets: columnSetHeaders } = response.data.headers;
    const { columnSets: columnSetsDefinition } = response.definition.grid;

    const expectedHeaders = [
      ['Music', 'Movies', 'Electronics', 'Books', 'Cost', 'Cost', 'Cost'],
      ['Profit', 'Profit', 'Profit', 'Profit', '2016', '2015', '2014']
    ];

    // when
    const headers = renderCompoundGridColumnHeaders(columnSetHeaders, columnSetsDefinition);

    // then
    expect(headers).toEqual(expectedHeaders);
  });

  it('should create normalized row headers', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));
    const { definition, data } = response;
    const { headers } = data;

    const expectedHeaders = [
      ['\'Art & Architecture'],
      ['\'Business'],
      ['\'Cameras'],
      ['\'Kids / Family'],
      ['\'Special Interests'],
      ['\'Alternative'],
      ['\'Country'],
    ];

    // when
    const rowHeaders = renderCompoundGridRowHeaders(headers, definition);

    // then
    expect(rowHeaders).toEqual(expectedHeaders);
  });
});
