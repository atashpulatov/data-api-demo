import { parseColumnSets, calculateColumnHeaderHeight, parseColumnSetHeaders, parseMetricValues, parseCompoundGrid } from '../../mstr-object/mstr-compound-grid-handler';
import regularCompoundJSON from './compound-grid/Regular Compound Grid.json';
import onlyAttrCompoundJSON from './compound-grid/Compound Grid with Only Attribute on Row.json';
import metricsInRowCompoundJSON from './compound-grid/Compound Grid with Metrics on Row.json';
import oneEmptyCompoundJSON from './compound-grid/Compound Grid with Empty Column Set.json';
import officeConverterServiceV2 from '../../office/office-converter-service-v2';

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

  it.skip('should group metric values into a single array', () => {
    // given
    const { metricValues, paging } = regularCompoundJSON.data;

    const expected1stRow = [null, null, null, 83891.267, 159665.636, 122315.7, null];

    // when
    const metrics = parseMetricValues(metricValues.columnSets, paging.current);

    // then
    expect(metrics[0]).toEqual(expected1stRow);
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
    const headers = parseColumnSetHeaders(columnSetHeaders, columnSetsDefinition);

    // then
    expect(headers).toEqual(expectedHeaders);
  });

  it.skip('should parse compoundGrid into crosstab structure', () => {
    // given9
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));

    // when
    const normalizedCompound = parseCompoundGrid(response);

    // then
    expect(normalizedCompound.visualizationType).toEqual('compound_grid');
    expect(normalizedCompound.definition.grid.columnSets).toBeUndefined();
    expect(normalizedCompound.data.headers.columnSets).toBeUndefined();
    expect(normalizedCompound.data.metricValues.columnSets).toBeUndefined();
    expect(normalizedCompound.definition.grid.columns).toHaveLength(4);
    expect(normalizedCompound.data.metricValues.raw).toHaveLength(7);
    expect(normalizedCompound.data.metricValues.raw[0]).toHaveLength(7);
  });

  it.skip('should be compatible with office converter service', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));

    // when
    const normalizedCompound = parseCompoundGrid(response);
    const mstrTable = officeConverterServiceV2.createTable(normalizedCompound);

    // then
    expect(mstrTable).toEqual({});
  });
});
