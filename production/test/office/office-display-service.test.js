/* eslint-disable */
import { officeApiHelper } from '../../src/office/office-api-helper';
import { officeContextMock } from './__mock__object__/OfficeContext';
import { officeDisplayService } from '../../src/office/office-display-service';
import { OfficeBindingError } from '../../src/office/office-error';
import { reduxStore } from '../../src/store';
import { mstrObjectRestService } from '../../src/mstr-object/mstr-object-rest-service';
import { mockReports } from '../mockData';
/* eslint-enable */

jest.mock('../../src/mstr-object/mstr-object-rest-service')

describe('OfficeDisplayService', () => {
    const originalGetOfficeContext = officeApiHelper.getOfficeContext;
    const originalFindAvailableTableName = officeApiHelper.findAvailableTableName;
    const originalMstrContext = officeApiHelper.getCurrentMstrContext;

    const url = 'url';
    const projectId = 'pId';

    beforeAll(() => {
        const mockedMethod = jest.fn();
        mockedMethod.mockResolvedValue(officeContextMock);
        officeApiHelper.getOfficeContext = mockedMethod;
        officeApiHelper.formatTable = jest.fn();

        mstrObjectRestService.getObjectContent.mockResolvedValue(mockReports[0]);

        officeApiHelper.findAvailableTableName = jest.fn();
        officeApiHelper.findAvailableTableName.mockImplementation(name => name);

        officeApiHelper.getCurrentMstrContext = jest.fn()
            .mockReturnValue({
                url,
                projectId,
            });
    });
    afterAll(() => {
        officeApiHelper.getOfficeContext = originalGetOfficeContext;
        officeApiHelper.findAvailableTableName = originalFindAvailableTableName;
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

    it.only('should save the report to office settings', async () => {
        const originalInsert = officeDisplayService._insertDataIntoExcel;
        try {
            // given
            officeDisplayService._insertDataIntoExcel = jest.fn();
            const objectId = null;
            const startCell = 'D411';
            const tableName = 'test';
            const bindingId = 'binding';
            // when
            await officeDisplayService.printObject(objectId, startCell, tableName, bindingId)
            // then
            expect(true).toBeFalsy();
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
