import jsonHandler from '../../mstr-object/handler/mstr-normalized-json-handler';
import { reportV2 } from '../mockDataV2';

describe('Normalized JSON Handler', () => {
  it('should lookup for column elements by index', () => {
    // given
    const { definition } = reportV2;
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
    const element = jsonHandler.lookupElement({
      definition, axis, attributeIndex, elementIndex,
    });
    // then
    expect(element).toEqual(expectedElement);
  });

  it('should lookup for row elemens by index', () => {
    // given
    const { definition } = reportV2;
    const axis = 'rows';
    const attributeIndex = 0;
    const elementIndex = 1;
    const expectedElement = {
      id: 'h2010;9BC4691C11E97721AF570080EF55306C', formValues: ['2010'], value: ['2010'], subtotalAddress: false,
    };
    // when
    const element = jsonHandler.lookupElement({
      definition, axis, attributeIndex, elementIndex,
    });
    // then
    expect(element).toEqual(expectedElement);
  });

  it('should lookup for row elemens by index with different number of attribute forms', () => {
    // given
    const { definition } = JSON.parse(JSON.stringify(reportV2));
    const axis = 'rows';
    const attributeIndex = 0;
    const elementIndex = 1;
    definition.grid[axis][attributeIndex].forms.push({
      id: 'test',
      name: 'test',
      dataType: 33,
      baseFormType: 3,
    });

    const expectedElement = {
      id: 'h2010;9BC4691C11E97721AF570080EF55306C', formValues: ['', '2010'], value: ['', '2010'], subtotalAddress: false,
    };
    // when
    const element = jsonHandler.lookupElement({
      definition, axis, attributeIndex, elementIndex,
    });
    // then
    expect(element).toEqual(expectedElement);
  });

  it('should map indices to elements', () => {
    // given
    const { definition } = reportV2;
    const axis = 'columns';
    const headerCells = [0];
    const expectedElements = [{
      formValues: ['BWI', '1'], id: 'h1;1D5F4A7811E97722F1050080EF65506C', value: ['BWI', '1'], subtotalAddress: false,
    }];
    // when
    const elements = jsonHandler.mapElementIndicesToElements({ definition, axis, headerCells });
    // then
    expect(elements).toEqual(expectedElements);
  });

  it('should render tabular data', () => {
    // given
    const { definition, data } = reportV2;
    definition.attrforms = { supportForms: false, displayAttrFormNames: 'Automatic' };
    const onElement = (element) => element.value[0];
    const expectedFirstRow = ['2009', 'January', 3139, 17046.02, 4543, 2406, 20915.41, 3449];
    // when
    const tabular = jsonHandler.renderTabular(definition, data, onElement);
    // then
    expect(tabular[0]).toEqual(expectedFirstRow);
  });
  it('should get element id for a given cell', () => {
    // given
    const { definition } = reportV2;
    const axis = 'columns';
    const attributeIndex = 0;
    const headerIndex = 1;
    const expectedId = 'h2;1D5F4A7811E97722F1050080EF65506C';
    // when
    const tabular = jsonHandler.getElementIdForGivenHeaderCell(definition, axis, attributeIndex, headerIndex);
    // then
    expect(tabular).toEqual(expectedId);
  });

  it('should render metric values', () => {
    // given
    const { data } = reportV2;
    const expectedFirstRow = [3139, 17046.02, 4543, 2406, 20915.41, 3449];
    // when
    const rows = jsonHandler.renderRows(data);
    // then
    expect(rows[0]).toEqual(expectedFirstRow);
  });

  it('should return empty array when there are no metrics', () => {
    // given
    const { data } = reportV2;
    const cloneData = { ...data };
    delete cloneData.metricValues;
    const expectedTable = Array(8).fill(Array(6).fill(null));
    // when
    const rows = jsonHandler.renderRows(cloneData);
    // then
    expect(rows).toEqual(expectedTable);
  });

  it('should render column headers', () => {
    // given
    const { definition, data } = reportV2;
    const { headers } = data;
    const axis = 'columns';
    const expectedHeaders = [
      ['BWI', 'BWI', 'BWI', 'DCA', 'DCA', 'DCA'],
      ['Flights Delayed', 'Avg Delay (min)', 'On-Time', 'Flights Delayed', 'Avg Delay (min)', 'On-Time'],
    ];
    const onElement = ({ value }) => value[0];
    // when
    const colHeaders = jsonHandler.renderHeaders(definition, axis, headers, onElement);
    // then
    expect(colHeaders).toEqual(expectedHeaders);
  });

  it('should render row headers', () => {
    // given
    const { definition, data } = reportV2;
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
    const colHeaders = jsonHandler.renderHeaders(definition, axis, headers, onElement);
    // then
    expect(colHeaders).toEqual(expectedHeaders);
  });

  it('should transpose 2D arrays', () => {
    // given
    const matrix = [[0, 1], [2, 3], [4, 5]];
    const expectedMatrix = [[0, 2, 4], [1, 3, 5]];
    // when
    const transposedMatrix = jsonHandler.transposeMatrix(matrix);
    // then
    expect(transposedMatrix).toEqual(expectedMatrix);
  });
});
