import { formattedDataHelper } from './formatted-data-helper';

describe('FormattedDataHelper', () => {
    it('should return added dimensions of a table', async () => {
        // given
        const excelContextMock = { sync: jest.fn() } as unknown as Excel.RequestContext;
        const rangeMock = {
            load: jest.fn(),
            columnCount: 16,
            rowCount: 46,
        } as unknown as Excel.Range;

        const officeTableMock = {
            columns: {
                count: 9,
                load: jest.fn()
            },
            rows: {
                count: 45,
                load: jest.fn()
            }
        } as unknown as Excel.Table;

        // when
        const result = await formattedDataHelper.calculateDimensionsCount(excelContextMock, rangeMock, officeTableMock);
        // then
        expect(result).toEqual({ addedRows: 0, addedColumns: 7 });
    });
});
