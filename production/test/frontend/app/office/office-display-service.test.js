/* eslint-disable */
import { officeApiHelper } from '../../../../src/frontend/app/office/office-api-helper';
import { officeContextMock } from './__mock__object__/OfficeContext';
import { officeDisplayService } from '../../../../src/frontend/app/office/office-display-service';
import { OfficeBindingError } from '../../../../src/frontend/app/office/office-error';
import { reduxStore } from '../../../../src/frontend/app/store';
/* eslint-enable */

describe('OfficeDisplayService', () => {
    let originalMethod;
    beforeAll(() => {
        originalMethod = officeApiHelper._getOfficeContext;
        const mockedMethod = jest.fn();
        mockedMethod.mockReturnValue(officeContextMock);
        officeApiHelper._getOfficeContext = mockedMethod;
        officeApiHelper.formatTable = jest.fn();
    });
    afterAll(() => {
        officeApiHelper._getOfficeContext = originalMethod;
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
