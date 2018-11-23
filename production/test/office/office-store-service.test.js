import { mockReports } from '../mockData';
import { officeDisplayService } from '../../src/office/office-display-service';
import { officeStoreService } from '../../src/office/store/office-store-service';
import { officeApiHelper } from '../../src/office/office-api-helper';
import { mockReportProperties } from './__mock__object__/office-settings-report-properties';

describe('OfficeStoreService', () => {

    beforeAll(() => {
        // officeStoreService.getOfficeSettings = jest.fn();
        // officeStoreService.getOfficeSettings.mockReturnValue({
        //     set: jest.fn(),
        //     get: jest.fn(),
        //     saveAsync: jest.fn(),
        // });
        // officeStoreService._getReportProperties = jest.fn(() => mockReportProperties[1]);

        const getOfficeSettingsSpy = jest.spyOn(officeStoreService, 'getOfficeSettings')
            .mockReturnValue({
                    set: jest.fn(),
                    get: jest.fn(),
                    saveAsync: jest.fn(),
                });
        const getReportPropertiesSpy = jest.spyOn(officeStoreService, '_getReportProperties')
            .mockReturnValue(() => mockReportProperties[1]);        
    });
    
    afterEach(() => {
        jest.clearAllMocks();
        // jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    })

    it('should save report properties to office settings', () => {
        //given
        const settings = officeStoreService.getOfficeSettings();
        const givenReport = mockReports[1];
        //when
        officeStoreService.preserveReport(givenReport);
        //then
        expect(officeStoreService._getReportProperties).toBeCalled();
        expect(settings.saveAsync).toBeCalled();
    });
    it('should delete report properties from office settings', async () => {
        //given
        const settings = officeStoreService.getOfficeSettings();
        const givenBindingId = 'testBindId3';
        const newReportProperties = mockReportProperties[0];        
        //when
        officeStoreService.deleteReport(givenBindingId);
        //then
        // expect(settings.set).toBeCalled();
        expect(settings.set).toBeCalledWith('reportProperties', newReportProperties);
    });
    it('should return a report found by bindingId', async () => {
        //given
        const givenBindingId = 'testBindId3';    
        //when
        const result = officeStoreService.getReportFromProperties(givenBindingId);
        //then
        expect(result).toBeInstanceOf(Object);
        expect(result.envUrl).toEqual('testEnvUrl3');
        expect(result.tableId).toEqual('testTableId3');
    });
});