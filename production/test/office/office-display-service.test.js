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

    const originalGetOfficeContext = officeApiHelper.getOfficeContext;
    const originalFindAvailableTableName = officeApiHelper.findAvailableOfficeTableId;
    const originalMstrContext = officeApiHelper.getCurrentMstrContext;

    const mstrContext = {
        envUrl: 'url',
        projectId: 'pId',
    };

    beforeAll(() => {
        const mockedMethod = jest.fn();
        mockedMethod.mockResolvedValue(officeContextMock);
        officeApiHelper.getOfficeContext = mockedMethod;
        officeApiHelper.formatTable = jest.fn();

        mstrObjectRestService.getObjectContent.mockResolvedValue(givenReport);

        officeApiHelper.findAvailableOfficeTableId = jest.fn();
        officeApiHelper.findAvailableOfficeTableId.mockImplementation((name) => name);

        officeApiHelper.getCurrentMstrContext = jest.fn()
            .mockReturnValue(mstrContext);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        officeApiHelper.getOfficeContext = originalGetOfficeContext;
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

    it('should call save on office store service', async () => {
        const originalInsert = officeDisplayService._insertDataIntoExcel;
        try {
            // given
            officeDisplayService._insertDataIntoExcel = jest.fn();
            const objectId = null;
            const startCell = 'D411';
            const bindingId = 'binding';
            // when
            await officeDisplayService.printObject(objectId, startCell);
            await officeDisplayService.printObject(objectId, startCell);
            // then
            expect(officeStoreService.preserveReport).toBeCalled();
            expect(officeStoreService.preserveReport).toBeCalledWith({
                id: givenReport.id,
                name: givenReport.name,
                bindId: bindingId,
                envUrl: mstrContext.envUrl,
                projectId: mstrContext.projectId,
            });
        } finally {
            officeDisplayService._insertDataIntoExcel = originalInsert;
        }
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
