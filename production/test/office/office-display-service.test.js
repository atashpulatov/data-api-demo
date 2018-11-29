/* eslint-disable */
import { officeApiHelper } from '../../src/office/office-api-helper';
import { officeContextMock } from './__mock__object__/OfficeContext';
import { officeDisplayService } from '../../src/office/office-display-service';
import { OfficeBindingError } from '../../src/office/office-error';
import { reduxStore } from '../../src/store';
import { mstrObjectRestService } from '../../src/mstr-object/mstr-object-rest-service';
import { mockReports } from '../mockData';
import { officeStoreService } from '../../src/office/store/office-store-service';
/* eslint-enable */

jest.mock('../../src/mstr-object/mstr-object-rest-service');
jest.mock('../../src/office/store/office-store-service');

describe('OfficeDisplayService', () => {
    const givenReport = mockReports[0];
    const startCell = 'D411';
    const excelTableNameMock = 'table';

    const mstrContext = {
        envUrl: 'url',
        projectId: 'pId',
    };

    beforeAll(() => {

        const getObjectContentSpy = jest.spyOn(mstrObjectRestService, 'getObjectContent')
            .mockResolvedValue(givenReport);

        const findAvailableOfficeTableIdSpy = jest.spyOn(officeApiHelper, 'findAvailableOfficeTableId')
            .mockReturnValue(excelTableNameMock);

        const getCurrentMstrContextSpy = jest.spyOn(officeApiHelper, 'getCurrentMstrContext')
            .mockReturnValue(mstrContext);

        const getOfficeContextSpy = jest.spyOn(officeApiHelper, 'getOfficeContext')
            .mockReturnValue({
                document: {
                    bindings: {
                        releaseByIdAsync: jest.fn(),
                    },
                },
            });

        const getExcelContextSpy = jest.spyOn(officeApiHelper, 'getExcelContext')
            .mockReturnValue({
                workbook: {
                    tables: {
                        getItem: () => { return { delete: () => {}}},
                    }
                },
                sync: () => {},
            });

    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        officeApiHelper.findAvailableOfficeTableId = originalFindAvailableTableName;
        officeApiHelper.getCurrentMstrContext = originalMstrContext;
    });

    it('should add report to store', () => {
        // given
        const report = {
            id: 'firstTestId',
            name: 'firstTestName',
            bindId: 'firstBindId',
            projectId: 'firstProjectId',
            envUrl: 'firstEnvUrl',
        };
        // when
        officeDisplayService.addReportToStore(report);
        const reportState = reduxStore.getState().officeReducer.reportArray;
        // then
        expect(reportState).toBeDefined();
        expect(reportState[0]).toEqual(report);
    });

    it('should call preserveReport on office store service', async () => {
        // given
        officeDisplayService._insertDataIntoExcel = jest.fn();
        const objectId = null;
        // when
        await officeDisplayService.printObject(objectId, startCell);
        // then
        expect(officeStoreService.preserveReport).toBeCalled();
        expect(officeStoreService.preserveReport).toBeCalledWith({
            tableId: excelTableNameMock,
            id: givenReport.id,
            name: givenReport.name,
            bindId: excelTableNameMock,
            envUrl: mstrContext.envUrl,
            projectId: mstrContext.projectId,
        });
    });

    it('should call deleteReport on office store service', async () => {
            // given
            officeStoreService.deleteReport = jest.fn();
            const report = {
                id: 'firstTestId',
                name: 'firstTestName',
                bindId: 'firstBindId',
                tableId: 'firstTableId',
                projectId: 'firstProjectId',
                envUrl: 'firstEnvUrl',
            };
            officeDisplayService.addReportToStore(report);
            // when            
            const bindingId = reduxStore.getState().officeReducer.reportArray[0].id;
            await officeDisplayService.removeReportFromExcel(bindingId);
            // then
            expect(officeStoreService.deleteReport).toBeCalled();
    });
    describe('_insertDataIntoExcel', async () => {
        it('should return table husk with proper name and invoke required methods', async () => {
            // given
            const getActiveWorksheetMock = jest.fn();
            const mockedTable = {
                getHeaderRowRange: jest.fn().mockReturnValue({
                    values: [],
                }),
            };
            const mockedWorksheet = {
                tables: {
                    add: jest.fn().mockReturnValue(mockedTable),
                },
                activate: jest.fn(),
            };
            const mockedPushRows = jest.fn();
            officeDisplayService._pushRows = mockedPushRows;
            const mockedFormatTable = jest.fn();
            officeDisplayService._formatTable = mockedFormatTable;
            getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
            officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
            const startCell = 'A1';
            const reportName = 'someReportName';
            const reportConvertedData = {
                name: 'testName',
                headers: {
                    length: 2,
                },
            };
            // when
            const context = officeContextMock;
            // then
            const result = await officeDisplayService._insertDataIntoExcel(reportConvertedData, context, startCell, reportName);
            // then
            expect(getActiveWorksheetMock).toBeCalled();
            expect(result.name).toEqual(reportName);
        });
    });
    describe.skip('delete report', () => {
        it('should fail', () => {
            // given
            // when
            // then
            expect(false).toBeTruthy();
        });
    });
    it.skip('it should fail', () => {
        // given
        // when
        expect(false).toBeTruthy();
        // then
    });
});
