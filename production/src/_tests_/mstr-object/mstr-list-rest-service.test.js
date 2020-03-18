import { mstrListRestService } from '../../mstr-object/mstr-list-rest-service';
import mockApiResponseWithDossiers from '../mockApiResponseWithDossiers';
import { reduxStore } from '../../store';

describe('Logic for fetching list of objects from MSTR API', () => {
  it('should apply filter function to response body.result and return array with non-Dossier type 14081 objects filtered out', () => {
    // given
    const response = mockApiResponseWithDossiers;
    const filteredOutId = '0089BFF447598FEABECC32AB64840016';
    // when
    const filteredElements = mstrListRestService.filterDossier(response);
    const isBadDossier = filteredElements.filter((element) => element.id === filteredOutId);
    // then
    expect(isBadDossier).toEqual([]);
  });

  it('should return true for all non-type-14081 objects and for Dossiers, false for all other type 14081 objects', () => {
    // given
    const { result } = mockApiResponseWithDossiers;
    const expectedElement = [true, true, true, true, true, false, true];
    // when
    const elements = result.map(mstrListRestService.filterFunction);
    // then
    expect(elements).toEqual(expectedElement);
  });

  it('should obtain number of total objects using initial request', () => {
    // given
    const response = mockApiResponseWithDossiers;
    const expectedTotal = 7;
    // when
    const element = mstrListRestService.processTotalItems(response);
    // then
    expect(element).toEqual(expectedTotal);
  });

  it('getRequestParams should return params from redux', () => {
    // given
    jest.spyOn(reduxStore, 'getState').mockImplementation(() => ({
      sessionReducer: {
        envUrl: 'envUrl',
        authToken: 'authToken',
      },
    }));
    const expectedParameters = { authToken: 'authToken', envUrl: 'envUrl', typeQuery: '768&type=769&type=774&type=776&type=779&type=14081' };
    // when
    const params = mstrListRestService.getRequestParams(expectedParameters);

    // then
    expect(params).toEqual(params);
  });
});
