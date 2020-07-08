
import onlyAttrCompoundJSON from './compound-grid/Compound Grid with Only Attribute on Row.json';
import mstrCompoundGridFlatten from '../../mstr-object/helper/mstr-compound-grid-flatten';


describe('MstrCompoundGridFlatten', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('flattenColumnSets should work correctly', () => {
    // given
    const response = { data: { headers: {} }, definition: { grid: { columnSets: [{ columns: [1] }] } } };


    const mockFlattenColumnSetsMetricElemets = jest.spyOn(mstrCompoundGridFlatten, 'flattenColumnSetsMetricElemets').mockImplementation();
    const mockFlattenColumnSetsHeaders = jest.spyOn(mstrCompoundGridFlatten, 'flattenColumnSetsHeaders').mockReturnValue([1]);
    const mockFlattenMetricValues = jest.spyOn(mstrCompoundGridFlatten, 'flattenMetricValues').mockImplementation();
    // when
    mstrCompoundGridFlatten.flattenColumnSets(response);
    // then
    expect(mockFlattenColumnSetsMetricElemets).toBeCalled();
    expect(mockFlattenColumnSetsHeaders).toBeCalled();
    expect(mockFlattenMetricValues).toBeCalled();
  });

  it('flattenColumnSets should work correctly for attributes only report', () => {
    // given

    const mockFlattenColumnSetsMetricElemets = jest.spyOn(mstrCompoundGridFlatten, 'flattenColumnSetsMetricElemets').mockImplementation();
    const mockFlattenColumnSetsHeaders = jest.spyOn(mstrCompoundGridFlatten, 'flattenColumnSetsHeaders').mockReturnValue([]);
    const mockFlattenMetricValues = jest.spyOn(mstrCompoundGridFlatten, 'flattenMetricValues').mockImplementation();
    // when
    mstrCompoundGridFlatten.flattenColumnSets(onlyAttrCompoundJSON);
    // then
    expect(mockFlattenColumnSetsMetricElemets).not.toBeCalled();
    expect(mockFlattenColumnSetsHeaders).toBeCalled();
    expect(mockFlattenMetricValues).toBeCalled();
  });

  it('flattenMetricValues should work correctly', () => {
    // given
    const data = { metricValues: { columnSets: [{ raw: [[1], [2]] }] } };
    const expectedValue = { extras: [], formatted: [], raw: [[1], [2]] };

    // when
    const metricValues = mstrCompoundGridFlatten.flattenMetricValues(data);
    // then
    expect(metricValues).toEqual(expectedValue);
  });

  it('flattenColumnSetsHeaders should work correctly', () => {
    // given
    const headers = { columnSets: [[[0]], [[1]]] };
    const expectedValue = [0, 2];

    // when
    const headerColumns = mstrCompoundGridFlatten.flattenColumnSetsHeaders(headers);
    // then
    expect(headerColumns).toEqual(expectedValue);
  });

  it('flattenColumnSetsMetricElemets should work correctly', () => {
    // given
    const grid = { columnSets: [
      { columns: [{ elements: ['test'] }] },
      { columns: [{ elements: ['test1'] }] }] };
    const expectedValue = ['test', 'test1'];

    // when
    const headerColumns = mstrCompoundGridFlatten.flattenColumnSetsMetricElemets(grid);
    console.log('headerColumns:', headerColumns);
    // then
    expect(headerColumns[0].elements).toEqual(expectedValue);
  });
});
