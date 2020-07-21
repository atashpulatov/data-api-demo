import regularCompoundJSON from './compound-grid/Regular Compound Grid.json';
import onlyAttrCompoundJSON from './compound-grid/Compound Grid with Only Attribute on Row.json';
import metricsInRowCompoundJSON from './compound-grid/Compound Grid with Metrics on Row.json';
import oneEmptyCompoundJSON from './compound-grid/Compound Grid with Empty Column Set.json';
import mstrCompoundGridHandler from '../../mstr-object/handler/mstr-compound-grid-handler';

describe('Compound Grid Handler', () => {
  it('should create mstr table object', () => {
    // given
    const response = regularCompoundJSON;
    const expectedProperties = [
      'tableSize',
      'columnInformation',
      'headers',
      'id',
      'isCrosstab',
      'isCrosstabular',
      'name',
      'rows',
      'visualizationType',
      'attributesNames',
      'attributes',
      'metrics',
    ];

    // when
    const table = mstrCompoundGridHandler.createTable(response);
    const properties = Object.keys(table);

    // then
    expect(table).toBeDefined();
    expect(properties).toEqual(expectedProperties);
  });

  it('should return column information', () => {
    // given
    const { definition, data } = regularCompoundJSON;
    const attributeForms = null;
    const expectedLength = 8;
    const expectedSecondColName = 'Profit';

    // when
    const colInformation = mstrCompoundGridHandler.getColumnInformation(definition, data, attributeForms);

    // then
    expect(colInformation).toHaveLength(expectedLength);
    expect(colInformation[0]).toEqual({});
    expect(colInformation[1].name).toEqual(expectedSecondColName);
  });

  it('should return column information with attribute forms', () => {
    // given
    const { definition, data } = regularCompoundJSON;
    const attributeForms = { supportForms: true };
    const expectedLength = 8;
    const expectedAttributeName = 'Subcategory';
    const expectedSecondColName = 'Profit';

    // when
    const colInformation = mstrCompoundGridHandler.getColumnInformation(definition, data, attributeForms);

    // then
    expect(colInformation).toHaveLength(expectedLength);
    expect(colInformation[0].attributeName).toEqual(expectedAttributeName);
    expect(colInformation[1].name).toEqual(expectedSecondColName);
  });

  it('should return final table size', () => {
    // given
    const { data } = regularCompoundJSON;
    const expectedSize = { columns: 7, rows: 7 };

    // when
    const tableSize = mstrCompoundGridHandler.getTableSize(data);

    // then
    expect(tableSize).toEqual(expectedSize);
  });

  it('should return attribute forms names', () => {
    // given
    const { definition } = regularCompoundJSON;
    const attributeForms = null;
    const expectedAttrForms = { rowsAttributes: ['\'Subcategory'] };


    // when
    const attrNames = mstrCompoundGridHandler.getAttributesName(definition, attributeForms);

    // then
    expect(attrNames.rowsAttributes).toBeDefined();
    expect(attrNames).toEqual(expectedAttrForms);
  });

  it('should calculate bounding height of column headers', () => {
    // given
    const { columnSets } = regularCompoundJSON.data.headers;
    const expectedHeight = 2;

    // when
    const height = mstrCompoundGridHandler.calculateColumnHeaderHeight(columnSets);

    // then
    expect(height).toEqual(expectedHeight);
  });

  it('should return rows form response', () => {
    // given
    const response = regularCompoundJSON;
    const expected1stRow = [null, null, null, 83891.267, 159665.636, 122315.7, null];
    const expectedLastRow = [6708.9268000006, null, null, null, 308419.5428999996, 237860.2502999999, 176310.18];

    // when
    const { row } = mstrCompoundGridHandler.getRows(response);

    // then
    expect(row[0]).toEqual(expected1stRow);
    expect(row.pop()).toEqual(expectedLastRow);
  });

  it('should return subtotal information', () => {
    // given
    const response = regularCompoundJSON;
    const expectedSubtotals = [];

    // when
    const subtotals = mstrCompoundGridHandler.getSubtotalsInformation(response);

    // then
    expect(subtotals).toEqual(expectedSubtotals);
  });

  it('should render rows form data in chosen format', () => {
    // given
    const { data } = regularCompoundJSON;
    const expected1stRow = ['', '', '', '$83,891', '$159,666', '$122,316', ''];
    const expectedLastRow = ['$6,709', '', '', '', '$308,420', '$237,860', '$176,310'];

    // when
    const rows = mstrCompoundGridHandler.renderRows(data, 'formatted');

    // then
    expect(rows[0]).toEqual(expected1stRow);
    expect(rows.pop()).toEqual(expectedLastRow);
  });

  it('should get compound grid headers', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));
    const expectedProperties = ['rows', 'columns', 'subtotalAddress'];

    const expectedColHeaders = [
      ['Music', 'Movies', 'Electronics', 'Books', 'Cost', 'Cost', 'Cost'],
      ['Profit', 'Profit', 'Profit', 'Profit', '2016', '2015', '2014']
    ];
    const expectedRowHeaders = [
      ['\'Art & Architecture'],
      ['\'Business'],
      ['\'Cameras'],
      ['\'Kids / Family'],
      ['\'Special Interests'],
      ['\'Alternative'],
      ['\'Country']];

    // when
    const headers = mstrCompoundGridHandler.getHeaders(response);

    // then
    expect(Object.keys(headers)).toEqual(expectedProperties);
    expect(headers.rows).toEqual(expectedRowHeaders);
    expect(headers.columns).toEqual(expectedColHeaders);
  });

  it('should render table titles', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));
    const { data: { headers }, definition } = response;
    const expectedLength = 7;

    const expectedFirstTitleName = 'Subcategory';

    // when
    const titles = mstrCompoundGridHandler.renderCompoundGridRowTitles(headers, definition);

    // then
    expect(titles).toHaveLength(expectedLength);
    expect(titles[0][0].name).toEqual(expectedFirstTitleName);
  });

  it('should render row headers', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));
    const { data: { headers }, definition } = response;
    const expectedLength = 7;

    const expectedFirstTitleName = ['Art & Architecture'];

    // when
    const titles = mstrCompoundGridHandler.renderCompoundGridRowHeaders(headers, definition);

    // then
    expect(titles).toHaveLength(expectedLength);
    expect(titles[0][0].formValues).toEqual(expectedFirstTitleName);
  });

  it('should render column headers', () => {
    // given
    const response = JSON.parse(JSON.stringify(regularCompoundJSON));
    const { data: { headers }, definition } = response;
    const expectedLength = 2;
    const onElement = (e) => [e.name || e.formValues[0]];

    const expectedColumnHeaders = [
      ['Music', 'Movies', 'Electronics', 'Books', 'Cost', 'Cost', 'Cost'],
      ['Profit', 'Profit', 'Profit', 'Profit', '2016', '2015', '2014']
    ];

    // when
    const titles = mstrCompoundGridHandler.renderCompoundGridColumnHeaders(headers, definition, onElement, onElement);

    // then
    expect(titles).toHaveLength(expectedLength);
    expect(titles).toEqual(expectedColumnHeaders);
  });

  it('should handle attribute forms', () => {
    // given
    const boundingHeight = 1;
    const attrFormsBoundingHeight = 2;
    const expectedLength = 2;
    const parsedHeaders = [['Profit'], ['Cost', '2016']];
    const expectedArray = [['\'', 'Profit'], ['Cost', '2016']];

    // when
    mstrCompoundGridHandler.handleAttributeForms(boundingHeight, attrFormsBoundingHeight, parsedHeaders);

    // then
    expect(parsedHeaders).toHaveLength(expectedLength);
    expect(parsedHeaders).toEqual(expectedArray);
  });

  it('should add empty headers to compound grid', () => {
    // given
    const { columnSets } = regularCompoundJSON.data.headers;
    const { columnSets: columnSetHeaders } = regularCompoundJSON.definition.grid;
    const [firstColumnSet] = columnSets;
    const boundingHeight = 2;
    const expectedLength = 4;
    const expectedArray = [[0, 0], [1, 0], [2, 0], [3, 0]];

    // when
    mstrCompoundGridHandler.addEmptyHeaders(firstColumnSet, boundingHeight, columnSetHeaders);

    // then
    expect(firstColumnSet).toHaveLength(expectedLength);
    expect(firstColumnSet).toEqual(expectedArray);
  });
});
