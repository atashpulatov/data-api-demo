import { officeApiHelper } from '../../../../src/frontend/app/office/office-api-helper';
import { officeContextMock } from './__mock__object__/OfficeContext';
import { officeDisplayService } from '../../../../src/frontend/app/office/office-display-service';

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
    describe('_insertDataIntoExcel', async () => {
        it('should test', async () => {
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

            const reportConvertedData = {
                headers: {
                    length: 2,
                },
            };
            // when
            const context = officeContextMock;
            // then
            const result = await officeDisplayService._insertDataIntoExcel(reportConvertedData, context, 'A1:A10');
            // then
            expect(getActiveWorksheetMock).toBeCalled();
        });
    });
    it('it should fail', () => {
        // given

        // when

        // then

    });
});
