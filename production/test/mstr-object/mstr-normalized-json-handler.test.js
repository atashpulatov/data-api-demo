import jsonHandler from '../../src/mstr-object/mstr-normalized-json-handler';
import response from '../../src/mstr-object/rest-api-v2.json';


describe('Normalized JSON Handler', () => {
  it('should lookup for column elements by index', () => {
    // given
    const {definition} = response;
    const axis = 'columns';
    const attributeIndex = 0;
    const elementIndex = 1;
    const expectedElement = {
      'id': 'h2;1D5F4A7811E97722F1050080EF65506C',
      'formValues': ['DCA', '2'],
      'value': ['DCA', '2'],
    };
    // when
    const element = jsonHandler.lookupElement(definition, axis, attributeIndex, elementIndex);
    // then
    expect(element).toEqual(expectedElement);
  });
  it('should lookup for row elemens by index', () => {
    // given
    const {definition} = response;
    const axis = 'rows';
    const attributeIndex = 0;
    const elementIndex = 1;
    const expectedElement = {'id': 'h2010;9BC4691C11E97721AF570080EF55306C', 'formValues': ['2010'], 'value': ['2010']};
    // when
    const element = jsonHandler.lookupElement(definition, axis, attributeIndex, elementIndex);
    // then
    expect(element).toEqual(expectedElement);
  });
  it('should map indices to elements', () => {
    // given
    const {definition} = response;
    const axis = 'columns';
    const elementIndices = [0];
    const expectedElements = [{'formValues': ['BWI', '1'], 'id': 'h1;1D5F4A7811E97722F1050080EF65506C', 'value': ['BWI', '1']}];
    // when
    const elements = jsonHandler.mapElementIndicesToElements(definition, axis, elementIndices);
    // then
    expect(elements).toEqual(expectedElements);
  });
  it('should map indices to elements', () => {
    // given
    const {definition} = response;
    const axis = 'columns';
    const elementIndices = [0];
    const expectedElements = [{'formValues': ['BWI', '1'], 'id': 'h1;1D5F4A7811E97722F1050080EF65506C', 'value': ['BWI', '1']}];
    // when
    const elements = jsonHandler.mapElementIndicesToElements(definition, axis, elementIndices);
    // then
    expect(elements).toEqual(expectedElements);
  });
  it('should render tabular data', () => {
    // given
    const {definition, data} = response;
    const onElement = (element) => element.value[0];
    const onMetricValue = (metric) => metric.rv;
    const expectedFirstRow = ['2009', 'January', 3139, 17046.02, 4543, 2406, 20915.41, 3449];
    // when
    const tabular = jsonHandler.renderTabular(definition, data, onElement, onMetricValue);
    // then
    expect(tabular[0]).toEqual(expectedFirstRow);
  });
  it('should get element id for a given cell', () => {
    // given
    const {definition} = response;
    const axis = 'columns';
    const attributeIndex = 0;
    const headerIndex = 1;
    const expectedId = 'h2;1D5F4A7811E97722F1050080EF65506C';
    // when
    const tabular = jsonHandler.getElementIdForGivenHeaderCell(definition, axis, attributeIndex, headerIndex);
    // then
    expect(tabular).toEqual(expectedId);
  });

  it('should render column headers', () => {
    // given
    const {definition, data} = response;
    const {headers} = data;
    const expectedHeaders = [
      ['BWI', 'BWI', 'BWI', 'DCA', 'DCA', 'DCA'],
      ['Flights Delayed', 'Avg Delay (min)', 'On-Time', 'Flights Delayed', 'Avg Delay (min)', 'On-Time'],
    ];
    // when
    const colHeaders = jsonHandler.renderColumnHeaders(definition, headers);
    // then
    expect(colHeaders).toEqual(expectedHeaders);
  });

  it('should render row headers', () => {
    // given
    const {definition, data} = response;
    const {headers} = data;
    const expectedHeaders = [
      ['2009', 'January'],
      ['2009', 'February'],
      ['2009', 'March'],
      ['2009', 'Total'],
      ['2010', 'January'],
      ['2010', 'February'],
      ['2010', 'March'],
      ['2010', 'Total']];
    // when
    const colHeaders = jsonHandler.renderRowHeaders(definition, headers);
    // then
    expect(colHeaders).toEqual(expectedHeaders);
  });
});

