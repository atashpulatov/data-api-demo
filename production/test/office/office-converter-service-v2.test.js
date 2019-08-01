import officeConverter from '../../src/office/office-converter-service-v2';
import response from '../../src/mstr-object/rest-api-v2.json';


describe('Office converter service v2', () => {
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
    const rows = officeConverter.getRows(crosstabsResponse);
    // then
    expect(rows[0]).toEqual(expectedFirstRow);
  });
  it('should return row and column headers', () => {
    // given
    const crosstabsResponse = response;
    const expectedHeaders = {
      columns: [
        ['BWI 1', 'BWI 1', 'BWI 1', 'DCA 2', 'DCA 2', 'DCA 2'],
        ['Flights Delayed', 'Avg Delay (min)', 'On-Time', 'Flights Delayed', 'Avg Delay (min)', 'On-Time'],
      ],
      rows: [
        ['2009', 'January'],
        ['2009', 'February'],
        ['2009', 'March'],
        ['2009', 'Total'],
        ['2010', 'January'],
        ['2010', 'February'],
        ['2010', 'March'],
        ['2010', 'Total'],
      ],
    };
    // when
    const headers = officeConverter.getHeaders(crosstabsResponse);
    // then
    expect(headers).toEqual(expectedHeaders);
  });
  it('should get column information for formatting', () => {
    // given
    const crosstabsResponse = response;
    const expectedFirstColumn = {
      attributeId: '9BC4691C11E97721AF570080EF55306C',
      attributeName: 'Year',
      forms: [{baseFormType: 3, dataType: 33, id: '45C11FA478E745FEA08D781CEA190FE5', name: 'ID'}],
      index: 0,
      isAttribute: true,
    };
    // when
    const colInformation = officeConverter.getColumnInformation(crosstabsResponse);
    // then
    expect(colInformation[0]).toEqual(expectedFirstColumn);
  });
});

