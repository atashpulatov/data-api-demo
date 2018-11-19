import { mockReports } from '../mockData';
import { officeDisplayService } from '../../src/office/office-display-service';
import { officeStoreService } from '../../src/office/store/office-store-service';
import { officeApiHelper } from '../../src/office/office-api-helper';

describe('OfficeStoreService', () => {

    beforeAll(() => {
        officeStoreService.getOfficeSettings = jest.fn();
        officeStoreService.getOfficeSettings.mockReturnValue({
            set: jest.fn(),
            get: jest.fn(),
            saveAsync: jest.fn(),
        });
        officeStoreService._getReportProperties = jest.fn(() => [
            {
                bindId: "testBindId1",
                envUrl: "testEnvUrl1",
                id: "testId1",
                name: "testName1",
                projectId: "testProjectId1",
                tableId: "testTableId1",
            },
            {
                bindId: "testBindId2",
                envUrl: "testEnvUrl2",
                id: "testId2",
                name: "testName2",
                projectId: "testProjectId2",
                tableId: "testTableId2",
            },
            {
                bindId: "testBindId3",
                envUrl: "testEnvUrl3",
                id: "testId3",
                name: "testName3",
                projectId: "testProjectId3",
                tableId: "testTableId3",
            },
        ]);
    });   

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
        const newReportProperties = [
            {
                bindId: "testBindId1",
                envUrl: "testEnvUrl1",
                id: "testId1",
                name: "testName1",
                projectId: "testProjectId1",
                tableId: "testTableId1",
            },
            {
                bindId: "testBindId2",
                envUrl: "testEnvUrl2",
                id: "testId2",
                name: "testName2",
                projectId: "testProjectId2",
                tableId: "testTableId2",
            },
        ];        
        //when
        officeStoreService.deleteReport(givenBindingId);
        //then
        expect(settings.set).toBeCalled();
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
    it.skip('should fail', () => {
        //given
        //when
        //then
        expect(false).toBeTruthy();
    });
});