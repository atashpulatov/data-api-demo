import { mockReports } from '../mockData';
import { officeStoreService } from '../../office/store/office-store-service';
import { mockReportProperties } from './__mock__object__/office-settings-report-properties';
import { officeProperties } from '../../office/store/office-properties';

describe('OfficeStoreService', () => {
  // TODO new tests for officestore service when refactor is finished
  // beforeAll(() => {
  //   jest.spyOn(officeStoreService, 'getOfficeSettings')
  //     .mockReturnValue({
  //       set: jest.fn(),
  //       get: jest.fn(),
  //       saveAsync: jest.fn(),
  //     });

  //   jest.spyOn(officeStoreService, 'getObjectProperties');
  // });

  // beforeEach(() => {
  //   officeStoreService.getObjectProperties
  //     .mockReturnValue(mockReportProperties[1].slice());
  // });

  // afterEach(() => {
  //   officeStoreService.getObjectProperties.mockClear();
  // });

  // it('should save report properties to office settings', () => {
  //   // given
  //   const settings = officeStoreService.getOfficeSettings();
  //   const givenReport = mockReports[1];
  //   // when
  //   officeStoreService.preserveObject(givenReport);
  //   // then
  //   expect(officeStoreService.getObjectProperties).toBeCalled();
  //   expect(settings.saveAsync).toBeCalled();
  // });
  // it('should delete report properties from office settings', () => {
  //   // given
  //   const settings = officeStoreService.getOfficeSettings();
  //   const givenbindId = 'testBindId1';
  //   // when
  //   officeStoreService.deleteObject(givenbindId);
  //   // then
  //   expect(settings.saveAsync).toBeCalled();
  // });
  // it('should rename the report from office settings', () => {
  //   // given
  //   const settings = officeStoreService.getOfficeSettings();
  //   const givenbindId = 'testBindId1';
  //   const givenName = 'testName';
  //   // when
  //   officeStoreService.preserveObjectValue(givenbindId, 'name', givenName);
  //   // then
  //   expect(settings.saveAsync).toBeCalled();
  // });
  // it('should return a report found by bindId', () => {
  //   // given
  //   const givenbindId = 'testBindId2';
  //   // when
  //   const result = officeStoreService.getObjectFromProperties(givenbindId);
  //   // then
  //   expect(result).toBeInstanceOf(Object);
  //   expect(result.envUrl).toEqual('testEnvUrl2');
  //   expect(result.projectId).toEqual('testProjectId2');
  // });

  // it('should save isSecured flag in settings', () => {
  //   // given
  //   const settings = officeStoreService.getOfficeSettings();
  //   // when
  //   officeStoreService.toggleFileSecuredFlag(true);
  //   // then
  //   expect(settings.set).toBeCalledWith(officeProperties.isSecured, true);
  // });

  // it('should return proper value from office when isFileSecured is called', () => {
  //   // given
  //   jest.spyOn(officeStoreService, 'getOfficeSettings')
  //     .mockReturnValue({
  //       set: jest.fn(),
  //       get: () => true,
  //       saveAsync: jest.fn(),
  //     });

  //   // when
  //   officeStoreService.isFileSecured();
  //   // then
  //   expect(officeStoreService.isFileSecured()).toBe(true);
  // });
});
