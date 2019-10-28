import officeConverter from '../../office/office-converter-service-v2';
import response from '../../mstr-object/rest-api-v2.json';
import jsonHandler from '../../mstr-object/mstr-normalized-json-handler';

describe('Office converter service v2', () => {
  it('should return create a table', () => {
    // given
    const crosstabsResponse = response;
    const expecteObjectKeys = ['tableSize', 'columnInformation', 'headers', 'id', 'isCrosstab', 'name', 'rows', 'attributesNames'];
    // when
    const table = officeConverter.createTable(crosstabsResponse);
    // then
    expect(Object.keys(table)).toEqual(expecteObjectKeys);
  });
  it('should return isCrossTab', () => {
    // given
    const crosstabsResponse = response;
    // when
    const isCrosstab = officeConverter.isCrosstab(crosstabsResponse);
    // then
    expect(isCrosstab).toBe(true);
  });
  it('should return table rows', () => {
    // given
    const crosstabsResponse = response;
    const expectedFirstRow = [3139, 17046.02, 4543, 2406, 20915.41, 3449];
    // when
    const { row } = officeConverter.getRows(crosstabsResponse);
    // then
    expect(row[0]).toEqual(expectedFirstRow);
  });
  it('should return isCrosstab', () => {
    // given
    const crosstabsResponse = response;
    const expectedValue = true;
    // when
    const isCrosstab = officeConverter.isCrosstab(crosstabsResponse);
    // then
    expect(isCrosstab).toEqual(expectedValue);
  });
  it('should return row and column headers', () => {
    // given
    const crosstabsResponse = response;
    const expectedHeaders = {
      columns: [
        ['\'BWI 1', '\'BWI 1', '\'BWI 1', '\'DCA 2', '\'DCA 2', '\'DCA 2'],
        ['\'Flights Delayed', '\'Avg Delay (min)', '\'On-Time', '\'Flights Delayed', '\'Avg Delay (min)', '\'On-Time'],
      ],
      rows: [
        ['\'2009', '\'January'],
        ['\'2009', '\'February'],
        ['\'2009', '\'March'],
        ['\'2009', '\'Total'],
        ['\'2010', '\'January'],
        ['\'2010', '\'February'],
        ['\'2010', '\'March'],
        ['\'2010', '\'Total'],
      ],
      subtotalAddress: [false, false, false, false, false, false, false, { attributeIndex: 1, axis: 'rows', colIndex: 3 }, false, false, false, false, false, false, false, { attributeIndex: 1, axis: 'rows', colIndex: 7 }, false, false, false, false, false, false, false, false, false, false, false, false],
    };
    // when
    const headers = officeConverter.getHeaders(crosstabsResponse);
    // then
    expect(headers).toEqual(expectedHeaders);
  });
  it('should getTableSize', () => {
    // given
    const crosstabsResponse = response;
    const isCrosstab = officeConverter.isCrosstab(crosstabsResponse);
    const columnInformation = officeConverter.getColumnInformation(crosstabsResponse);
    const expectedValue = { columns: 6, rows: 8 };
    // when
    const tableSize = officeConverter.getTableSize(crosstabsResponse, columnInformation, isCrosstab);
    // then
    expect(tableSize).toEqual(expectedValue);
  });
  it('should get column information for formatting', () => {
    // given
    const crosstabsResponse = response;
    const expectedFirstColumn = {
      attributeId: '9BC4691C11E97721AF570080EF55306C',
      attributeName: 'Year',
      forms: [{ baseFormType: 3, dataType: 33, id: '45C11FA478E745FEA08D781CEA190FE5', name: 'ID', }],
      index: 0,
      isAttribute: true,
    };
    // when
    const colInformation = officeConverter.getColumnInformation(crosstabsResponse);
    // then
    expect(colInformation[0]).toEqual(expectedFirstColumn);
  });
  it('should return isCrosstab error handler which is false', () => {
    // given
    const expectedValue = false;
    // when
    const isCrosstab = officeConverter.isCrosstab();
    // then
    expect(isCrosstab).toEqual(expectedValue);
  });
  it('should run handler for tabular data', () => {
    // given
    const renderTabularSpy = jest.spyOn(jsonHandler, 'renderTabular');
    const mockResponse = { definition: {}, data: { headers: { rows: {} } } };
    // when
    const returnedValue = officeConverter.getRows(mockResponse);
    // then
    expect(renderTabularSpy).toBeCalled();
    expect(returnedValue).toStrictEqual({ row: [], rowTotals: [] });
  });
});
