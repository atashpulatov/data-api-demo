import {browserStoreService} from "./browser-store-service";
import {officeProperties} from "../office/office-properties";

describe('BrowserStoreService', () => {
  it('should store the applied filter', () => {
    // given
    const setFunction = jest.fn();
    const saveFuntction = jest.fn();
    jest.spyOn(browserStoreService, 'getOfficeSettings')
      .mockReturnValue({
        set: setFunction,
        saveAsync: saveFuntction,
      });
    const givenBrowsingState = 'givenBrowsingState';
    // when
    browserStoreService.preserveBrowsingFilters(givenBrowsingState);
    // then
    expect(setFunction).toBeCalledWith(officeProperties.browsingFiltersApplied, givenBrowsingState);
    expect(saveFuntction).toBeCalled();
  });

  it('should return the applied filter', () => {
    // given
    const appliedBrowsingFilters = 'appliedBrowsingFilter';
    const getFuntion = jest.fn()
      .mockReturnValue(appliedBrowsingFilters);
    jest.spyOn(browserStoreService, 'getOfficeSettings')
      .mockReturnValue({ get: getFuntion });
    // when
    const storedFilters = browserStoreService.getBrowsingFilters();
    // then
    expect(getFuntion).toBeCalledWith(officeProperties.browsingFiltersApplied);
    expect(storedFilters).toBe(appliedBrowsingFilters);
  });
});
