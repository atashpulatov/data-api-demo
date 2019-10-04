import { mockReports } from '../mockData';
import { officeStoreService } from '../../office/store/office-store-service';
import { mockReportProperties } from './__mock__object__/office-settings-report-properties';
import { officeProperties } from '../../office/office-properties';

describe('OfficeStoreService', () => {
  beforeAll(() => {
    jest.spyOn(officeStoreService, 'getOfficeSettings')
      .mockReturnValue({
        set: jest.fn(),
        get: jest.fn(),
        saveAsync: jest.fn(),
      });

    jest.spyOn(officeStoreService, '_getReportProperties');
  });

  beforeEach(() => {
    officeStoreService._getReportProperties
      .mockReturnValue(mockReportProperties[1].slice());
  });

  afterEach(() => {
    officeStoreService._getReportProperties.mockClear();
  });

  it('should save report properties to office settings', () => {
    // given
    const settings = officeStoreService.getOfficeSettings();
    const givenReport = mockReports[1];
    // when
    officeStoreService.preserveReport(givenReport);
    // then
    expect(officeStoreService._getReportProperties).toBeCalled();
    expect(settings.saveAsync).toBeCalled();
  });
  it('should delete report properties from office settings', async () => {
    // given
    const settings = officeStoreService.getOfficeSettings();
    const givenBindingId = 'testBindId1';
    // when
    officeStoreService.deleteReport(givenBindingId);
    // then
    expect(settings.saveAsync).toBeCalled();
  });
  it('should rename the report from office settings', async () => {
    // given
    const settings = officeStoreService.getOfficeSettings();
    const givenBindingId = 'testBindId1';
    const givenName = 'testName';
    // when
    officeStoreService.preserveReportValue(givenBindingId, 'name', givenName);
    // then
    expect(settings.saveAsync).toBeCalled();
  });
  it('should return a report found by bindingId', async () => {
    // given
    const givenBindingId = 'testBindId2';
    // when
    const result = officeStoreService.getReportFromProperties(givenBindingId);
    // then
    expect(result).toBeInstanceOf(Object);
    expect(result.envUrl).toEqual('testEnvUrl2');
    expect(result.projectId).toEqual('testProjectId2');
  });

  it('should save isSecured flag in settings', async () => {
    // given
    const settings = officeStoreService.getOfficeSettings();
    // when
    officeStoreService.toggleFileSecuredFlag(true);
    // then
    expect(settings.set).toBeCalledWith(officeProperties.isSecured, true);
  });

  it('should return proper value from office when isFileSecured is called', async () => {
    // given
    jest.spyOn(officeStoreService, 'getOfficeSettings')
      .mockReturnValue({
        set: jest.fn(),
        get: () => true,
        saveAsync: jest.fn(),
      });

    // when
    officeStoreService.isFileSecured();
    // then
    expect(officeStoreService.isFileSecured()).toBe(true);
  });

  it('should store the applied filter', () => {
    // given
    const setFunction = jest.fn();
    const saveFuntction = jest.fn();
    jest.spyOn(officeStoreService, 'getOfficeSettings')
      .mockReturnValue({
        set: setFunction,
        saveAsync: saveFuntction,
      });
    const givenBrowsingState = 'givenBrowsingState';
    // when
    officeStoreService.preserveBrowsingFilters(givenBrowsingState);
    // then
    expect(setFunction).toBeCalledWith(officeProperties.browsingFiltersApplied, givenBrowsingState);
    expect(saveFuntction).toBeCalled();
  });

  it('should return the applied filter', () => {
    // given
    const appliedBrowsingFilters = 'appliedBrowsingFilter';
    const getFuntion = jest.fn()
      .mockReturnValue(appliedBrowsingFilters);
    jest.spyOn(officeStoreService, 'getOfficeSettings')
      .mockReturnValue({ get: getFuntion });
    // when
    const storedFilters = officeStoreService.getBrowsingFilters();
    // then
    expect(getFuntion).toBeCalledWith(officeProperties.browsingFiltersApplied);
    expect(storedFilters).toBe(appliedBrowsingFilters);
  });
});
