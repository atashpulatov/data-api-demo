/* eslint-disable */
import { officeApiHelper } from '../../../../src/frontend/app/office/office-api-helper';
import { officeContextMock } from './__mock__object__/OfficeContext';
import { officeDisplayService } from '../../../../src/frontend/app/office/office-display-service';
import { OfficeBindingError } from '../../../../src/frontend/app/office/office-error';
/* eslint-enable */

describe('OfficeDisplayService', () => {
    let originalMethod;
    beforeAll(() => {
        originalMethod = officeApiHelper._getOfficeContext;
        const mockedMethod = jest.fn();
        mockedMethod.mockReturnValue(officeContextMock);
        officeApiHelper._getOfficeContext = mockedMethod;
    });
    afterAll(() => {
        officeApiHelper._getOfficeContext = originalMethod;
    });

    it('should return proper bindingId', () => {
        // given
        const reportId = 'someReportId';
        const reportName = 'someReportName';
        const convertedReportDataMock = {
            id: reportId,
            name: reportName,
        };
        const separator = '_';
        const startCell = 'someCELL';
        const expectedBindId = `${reportName}_${startCell}_${reportId}`;
        // when
        const receivedBindId = officeDisplayService._createBindingId(convertedReportDataMock, startCell, separator);
        // then
        expect(receivedBindId).toEqual(expectedBindId);
    });
    it('should return proper bindingId with different separator', () => {
        // given
        const reportId = 'someReportId';
        const reportName = 'someReportName';
        const convertedReportDataMock = {
            id: reportId,
            name: reportName,
        };
        const separator = '-';
        const startCell = 'someCELL';
        const expectedBindId = `${reportName}-${startCell}-${reportId}`;
        // when
        const receivedBindId = officeDisplayService._createBindingId(convertedReportDataMock, startCell, separator);
        // then
        expect(receivedBindId).toEqual(expectedBindId);
    });
    it('should throw error due to missing convertedReportData', () => {
        // given
        const convertedReportDataMock = undefined;
        const separator = '-';
        const startCell = 'someCELL';
        // when
        const wrongMethodCall = () => {
            officeDisplayService._createBindingId(convertedReportDataMock, startCell, separator);
        };
        // then
        expect(wrongMethodCall).toThrowError(OfficeBindingError);
        expect(wrongMethodCall).toThrowError('Missing reportConvertedData');
    });
    it('should throw error due to missing startCell', () => {
        // given
        const reportId = 'someReportId';
        const reportName = 'someReportName';
        const convertedReportDataMock = {
            id: reportId,
            name: reportName,
        };
        const startCell = undefined;
        const separator = '-';
        // when
        const wrongMethodCall = () => {
            officeDisplayService._createBindingId(convertedReportDataMock, startCell, separator);
        };
        // then
        expect(wrongMethodCall).toThrowError(OfficeBindingError);
        expect(wrongMethodCall).toThrowError('Missing startCell');
    });
    it('should return proper bindingId despite not providing separator', () => {
        // given
        const reportId = 'someReportId';
        const reportName = 'someReportName';
        const convertedReportDataMock = {
            id: reportId,
            name: reportName,
        };
        const startCell = 'someCELL';
        const expectedBindId = `${reportName}_${startCell}_${reportId}`;
        // when
        const receivedBindId = officeDisplayService._createBindingId(convertedReportDataMock, startCell);
        // then
        expect(receivedBindId).toEqual(expectedBindId);
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
            const reportConvertedData = {
                name: 'testName',
                headers: {
                    length: 2,
                },
            };
            // when
            const context = officeContextMock;
            // then
            const result = await officeDisplayService._insertDataIntoExcel(reportConvertedData, context, startCell);
            // then
            expect(getActiveWorksheetMock).toBeCalled();
            expect(result.name).toEqual(`${reportConvertedData.name}${startCell}`);
        });
    });
    it('it should fail', () => {
        // given

        // when

        // then

    });
});
