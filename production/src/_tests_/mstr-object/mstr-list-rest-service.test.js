import getObjectList from '../../mstr-object/mstr-list-rest-service';
import mockApiRepsonseWithDossiers from '../mockApiRepsonseWithDossiers';

// the below part needs to be changed
describe('Normalized JSON Handler', () => {
  it('should lookup for column elements by index', () => {
    // given
    const { definition } = mockApiRepsonseWithDossiers;
    const axis = 'columns';
    const attributeIndex = 0;
    const elementIndex = 1;
    const expectedElement = {
      id: 'h2;1D5F4A7811E97722F1050080EF65506C',
      formValues: ['DCA', '2'],
      value: ['DCA', '2'],
      subtotalAddress: false,
    };
    // when
    const element = getObjectList.lookupElement({
      definition, axis, attributeIndex, elementIndex,
    });
    // then
    expect(element).toEqual(expectedElement);
  });

  it('should lookup for row elemens by index', () => {
    // given
    const { definition } = mockApiRepsonseWithDossiers;
    const axis = 'rows';
    const attributeIndex = 0;
    const elementIndex = 1;
    const expectedElement = {
      id: 'h2010;9BC4691C11E97721AF570080EF55306C', formValues: ['2010'], value: ['2010'], subtotalAddress: false,
    };
    // when
    const element = getObjectList.lookupElement({
      definition, axis, attributeIndex, elementIndex,
    });
    // then
    expect(element).toEqual(expectedElement);
  });

  it('should map indices to elements', () => {
    // given
    const { definition } = mockApiRepsonseWithDossiers;
    const axis = 'columns';
    const headerCells = [0];
    const expectedElements = [{
      formValues: ['BWI', '1'], id: 'h1;1D5F4A7811E97722F1050080EF65506C', value: ['BWI', '1'], subtotalAddress: false,
    }];
    // when
    const elements = getObjectList.mapElementIndicesToElements({ definition, axis, headerCells });
    // then
    expect(elements).toEqual(expectedElements);
  });

  it('should render tabular data', () => {
    // given
    const { definition, data } = mockApiRepsonseWithDossiers;
    const onElement = (element) => element.value[0];
    const expectedFirstRow = ['2009', 'January', 3139, 17046.02, 4543, 2406, 20915.41, 3449];
    // when
    const tabular = getObjectList.renderTabular(definition, data, onElement);
    // then
    expect(tabular[0]).toEqual(expectedFirstRow);
  });
  it('should get element id for a given cell', () => {
    // given
    const { definition } = mockApiRepsonseWithDossiers;
    const axis = 'columns';
    const attributeIndex = 0;
    const headerIndex = 1;
    const expectedId = 'h2;1D5F4A7811E97722F1050080EF65506C';
    // when
    const tabular = getObjectList.getElementIdForGivenHeaderCell(definition, axis, attributeIndex, headerIndex);
    // then
    expect(tabular).toEqual(expectedId);
  });
  it('should render metric values', () => {
    // given
    const { data } = mockApiRepsonseWithDossiers;
    const expectedFirstRow = [3139, 17046.02, 4543, 2406, 20915.41, 3449];
    // when
    const rows = getObjectList.renderRows(data);
    // then
    expect(rows[0]).toEqual(expectedFirstRow);
  });
  it('should return empty array when there are no metrics', () => {
    // given
    const { data } = mockApiRepsonseWithDossiers;
    const cloneData = { ...data };
    delete cloneData.metricValues;
    const expectedTable = Array(8).fill(Array(6).fill(null));
    // when
    const rows = getObjectList.renderRows(cloneData);
    // then
    expect(rows).toEqual(expectedTable);
  });
  it('should render column headers', () => {
    // given
    const { definition, data } = mockApiRepsonseWithDossiers;
    const { headers } = data;
    const axis = 'columns';
    const expectedHeaders = [
      ['BWI', 'BWI', 'BWI', 'DCA', 'DCA', 'DCA'],
      ['Flights Delayed', 'Avg Delay (min)', 'On-Time', 'Flights Delayed', 'Avg Delay (min)', 'On-Time'],
    ];
    const onElement = ({ value }) => value[0];
    // when
    const colHeaders = getObjectList.renderHeaders(definition, axis, headers, onElement);
    // then
    expect(colHeaders).toEqual(expectedHeaders);
  });
  it('should render row headers', () => {
    // given
    const { definition, data } = mockApiRepsonseWithDossiers;
    const { headers } = data;
    const axis = 'rows';
    const expectedHeaders = [
      ['2009', 'January'],
      ['2009', 'February'],
      ['2009', 'March'],
      ['2009', 'Total'],
      ['2010', 'January'],
      ['2010', 'February'],
      ['2010', 'March'],
      ['2010', 'Total']];
    const onElement = (e) => e.value[0];
    // when
    const colHeaders = getObjectList.renderHeaders(definition, axis, headers, onElement);
    // then
    expect(colHeaders).toEqual(expectedHeaders);
  });

  it('should transpose 2D arrays', () => {
    // given
    const matrix = [[0, 1], [2, 3], [4, 5]];
    const expectedMatrix = [[0, 2, 4], [1, 3, 5]];
    // when
    const transposedMatrix = getObjectList._transposeMatrix(matrix);
    // then
    expect(transposedMatrix).toEqual(expectedMatrix);
  });
});
