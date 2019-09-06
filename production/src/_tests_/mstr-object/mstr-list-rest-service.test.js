import listRestService from '../../mstr-object/mstr-list-rest-service';
import mockApiRepsonseWithDossiers from '../mockApiResponseWithDossiers';

// the below part needs to be changed
describe('Logic for fetching list of objects from MSTR API', () => {
  // it('should apply filter function to response body.result and return array with non-Dossier type 14081 objects filtered out', () => {
  //   // given
  //   const response = mockApiRepsonseWithDossiers;
  //   const expectedElement = [
  //     {
  //       name: 'Photo Uploader Widget Dataset - Standard',
  //       id: '02DDEFDA460B58681B005AAB4A1CBFD3',
  //       type: 3,
  //       subtype: 768,
  //       extType: 1,
  //       dateCreated: '2011-11-17T16:39:42.000+0000',
  //       dateModified: '2016-10-20T13:50:02.000+0000',
  //       version: '45D96D6041702F5C77BC509059D549D6',
  //       acg: 255,
  //       viewMedia: 134217728,
  //       owner: {
  //         name: 'Administrator',
  //         id: '54F3D26011D2896560009A8E67019608',
  //       },
  //       certifiedInfo: {
  //         certified: false,
  //       },
  //       projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
  //     },
  //     {
  //       name: 'Employee Attrition - Quarterly Trend',
  //       id: '012F3DA711D7612CB000A281A96E4BD0',
  //       type: 3,
  //       subtype: 769,
  //       extType: 1,
  //       dateCreated: '2004-01-14T20:05:35.000+0000',
  //       dateModified: '2009-11-19T08:54:25.000+0000',
  //       version: 'F703240D419C25231C837785883D1F9E',
  //       acg: 255,
  //       viewMedia: 134217728,
  //       owner: {
  //         name: 'Administrator',
  //         id: '54F3D26011D2896560009A8E67019608',
  //       },
  //       certifiedInfo: {
  //         certified: false,
  //       },
  //       projectId: '4BAE16A340B995CAD24193AA3AC15D29',
  //     },
  //     {
  //       name: 'Enrollment',
  //       id: '7B1450E14D52750BD2CF739384F79A44',
  //       type: 3,
  //       subtype: 774,
  //       extType: 1,
  //       dateCreated: '2011-12-13T16:46:07.000+0000',
  //       dateModified: '2016-10-20T13:50:02.000+0000',
  //       version: 'F519F15E454D1E4995232791317FA23E',
  //       acg: 255,
  //       viewMedia: 134217728,
  //       owner: {
  //         name: 'Administrator',
  //         id: '54F3D26011D2896560009A8E67019608',
  //       },
  //       certifiedInfo: {
  //         certified: false,
  //       },
  //       projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
  //     },
  //     {
  //       name: 'Intelligent Cube - Time, Products, Geography - Sales Metrics',
  //       id: '6137E0964C68D84F107816AA694C2209',
  //       type: 3,
  //       description: 'This Intelligent Cube includes Time (Year to Month), Products (Category to Subcategory) and Geography (Region to Call Center), and sales metrics (Revenue, Cost, Profit, Profit Margin, Units Sold; including Last Month, Last Quarter and Last Year).',
  //       hidden: true,
  //       subtype: 776,
  //       extType: 1,
  //       dateCreated: '2009-01-20T11:10:42.000+0000',
  //       dateModified: '2016-08-12T19:33:25.000+0000',
  //       version: 'A24DD9E6426FDDB055DF7AB80711D8A9',
  //       acg: 255,
  //       viewMedia: 134217728,
  //       owner: {
  //         name: 'Administrator',
  //         id: '54F3D26011D2896560009A8E67019608',
  //       },
  //       certifiedInfo: {
  //         certified: false,
  //       },
  //       projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
  //     },
  //     {
  //       name: 'Blank EMMA Cube Report',
  //       id: '4B43EC5548911FC01AF5D3ACE3F16256',
  //       type: 3,
  //       description: 'You will be shown an empty report on which you may place various data objects from the selected EMMA Cube.',
  //       subtype: 779,
  //       extType: 1,
  //       dateCreated: '2013-10-02T17:52:45.000+0000',
  //       dateModified: '2014-12-04T04:47:27.000+0000',
  //       version: '5B4BF25D47128D9320542888AA3C6C2E',
  //       acg: 255,
  //       viewMedia: 134217728,
  //       owner: {
  //         name: 'Administrator',
  //         id: '54F3D26011D2896560009A8E67019608',
  //       },
  //       certifiedInfo: {
  //         certified: false,
  //       },
  //       projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
  //     },
  //     {
  //       name: 'New Dossier',
  //       id: '4802DE4C4C18F434C75BFA84EC8A5E4B',
  //       type: 55,
  //       description: 'Use this template to create a Dossier.',
  //       subtype: 14081,
  //       extType: 0,
  //       dateCreated: '2013-12-03T19:31:23.000+0000',
  //       dateModified: '2018-09-04T04:02:17.000+0000',
  //       version: 'C28266304EDF19B476F1B89B7360A635',
  //       acg: 255,
  //       viewMedia: 1879072805,
  //       owner: {
  //         name: 'Administrator',
  //         id: '54F3D26011D2896560009A8E67019608',
  //       },
  //       certifiedInfo: {
  //         certified: false,
  //       },
  //       projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
  //     },
  //   ];
  //   // when
  //   const element = getObjectList.filterDossier(response);
  //   // then
  //   expect(element).toEqual(expectedElement);
  // });

  // it('should return true for all non-type-14081 objects and for Dossiers, false for all other type 14081 objects', () => {
  //   // given
  //   const { result } = mockApiRepsonseWithDossiers;
  //   const expectedElement = [true, true, true, true, true, false, true];
  //   // when
  //   const elements = result.map(getObjectList.filterFunction);
  //   // then
  //   expect(elements).toEqual(expectedElement);
  // });

  // it('should obtain number of total objects using initial request', () => {
  //   // given
  //   const response = mockApiRepsonseWithDossiers;
  //   const expectedTotal = 7;
  //   // when
  //   const element = getObjectList.processTotalItems(response);
  //   // then
  //   expect(element).toEqual(expectedTotal);
  // });


  // getRequestParams unit test goes here....


  // it('should call fetchObjectList() with default arguments', () => {
  //   // given
  //   const mockFetchObjectList = jest.fn();
  //   jest.spyOn(listRestService, 'fetchObjectList').mockImplementation(mockFetchObjectList);
  //   const params = {};
  //   // when

  //   listRestService.fetchTotalItems(params);

  //   // then
  //   expect(mockFetchObjectList).toHaveBeenCalledWith(params);
  // });

  // it('should get element id for a given cell', () => {
  //   // given
  //   const { definition } = mockApiRepsonseWithDossiers;
  //   const axis = 'columns';
  //   const attributeIndex = 0;
  //   const headerIndex = 1;
  //   const expectedId = 'h2;1D5F4A7811E97722F1050080EF65506C';
  //   // when
  //   const tabular = getObjectList.getElementIdForGivenHeaderCell(definition, axis, attributeIndex, headerIndex);
  //   // then
  //   expect(tabular).toEqual(expectedId);
  // });
  // it('should render metric values', () => {
  //   // given
  //   const { data } = mockApiRepsonseWithDossiers;
  //   const expectedFirstRow = [3139, 17046.02, 4543, 2406, 20915.41, 3449];
  //   // when
  //   const rows = getObjectList.renderRows(data);
  //   // then
  //   expect(rows[0]).toEqual(expectedFirstRow);
  // });
  // it('should return empty array when there are no metrics', () => {
  //   // given
  //   const { data } = mockApiRepsonseWithDossiers;
  //   const cloneData = { ...data };
  //   delete cloneData.metricValues;
  //   const expectedTable = Array(8).fill(Array(6).fill(null));
  //   // when
  //   const rows = getObjectList.renderRows(cloneData);
  //   // then
  //   expect(rows).toEqual(expectedTable);
  // });
  // it('should render column headers', () => {
  //   // given
  //   const { definition, data } = mockApiRepsonseWithDossiers;
  //   const { headers } = data;
  //   const axis = 'columns';
  //   const expectedHeaders = [
  //     ['BWI', 'BWI', 'BWI', 'DCA', 'DCA', 'DCA'],
  //     ['Flights Delayed', 'Avg Delay (min)', 'On-Time', 'Flights Delayed', 'Avg Delay (min)', 'On-Time'],
  //   ];
  //   const onElement = ({ value }) => value[0];
  //   // when
  //   const colHeaders = getObjectList.renderHeaders(definition, axis, headers, onElement);
  //   // then
  //   expect(colHeaders).toEqual(expectedHeaders);
  // });
  // it('should render row headers', () => {
  //   // given
  //   const { definition, data } = mockApiRepsonseWithDossiers;
  //   const { headers } = data;
  //   const axis = 'rows';
  //   const expectedHeaders = [
  //     ['2009', 'January'],
  //     ['2009', 'February'],
  //     ['2009', 'March'],
  //     ['2009', 'Total'],
  //     ['2010', 'January'],
  //     ['2010', 'February'],
  //     ['2010', 'March'],
  //     ['2010', 'Total']];
  //   const onElement = (e) => e.value[0];
  //   // when
  //   const colHeaders = getObjectList.renderHeaders(definition, axis, headers, onElement);
  //   // then
  //   expect(colHeaders).toEqual(expectedHeaders);
  // });

  // it('should transpose 2D arrays', () => {
  //   // given
  //   const matrix = [[0, 1], [2, 3], [4, 5]];
  //   const expectedMatrix = [[0, 2, 4], [1, 3, 5]];
  //   // when
  //   const transposedMatrix = getObjectList._transposeMatrix(matrix);
  //   // then
  //   expect(transposedMatrix).toEqual(expectedMatrix);
  // });
});
