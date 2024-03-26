import { officeApiHelper } from '../api/office-api-helper';
import { determineImagePropsToBeAddedToBook } from './shape-helper-util';

import { OperationTypes } from '../../operation/operation-type-names';

describe('shape-helper-util', () => {
  const mockFn = jest.fn();

  const mockVizDimensions = {
    width: 123,
    height: 342,
  };

  const mockSelectedRangePos = {
    top: 345,
    left: 256,
  };

  const mockDuplicateShapeDimensions = {
    width: 675,
    height: 345,
  };

  const mockShapeInWorksheet = {
    width: 564,
    height: 643,
    top: 34,
    left: 56,
  };

  const mockShapeProps = {
    width: 453,
    height: 356,
    top: 237,
    left: 765,
    worksheetId: '1234-5678-9012-3456',
  };

  const mockSheet = {
    shapes: {
      addImage: jest.fn().mockImplementation(_image =>
        Promise.resolve({
          set: mockFn,
          id: '1234-5678-9012-3456',
        })
      ),
    },
  } as unknown as Excel.Worksheet;

  const excelContextMock = {
    workbook: {
      worksheets: {
        load: mockFn,
        items: [
          {
            shapes: {
              getItemOrNullObject: jest.fn().mockImplementation(_id => ({
                load: mockFn,
                delete: mockFn,
                isNullObject: false,
                id: '1234-5678-9012-3456',
              })),
            },
          },
        ],
        getActiveWorksheet: jest.fn().mockImplementation(() => mockSheet),
        getItem: jest.fn().mockImplementation(_id => mockSheet),
      },
      sync: mockFn,
    },
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should work as expected for import operation', () => {
    const getCurrentExcelSheetMock = jest
      .spyOn(officeApiHelper, 'getCurrentExcelSheet')
      .mockImplementation(() => mockSheet);

    const args = {
      operationType: OperationTypes.IMPORT_OPERATION,
      shapeProps: undefined as any,
      shapeInWorksheet: undefined as any,
      shapeDimensionsForDuplicateOp: undefined as any,
      vizDimensions: mockVizDimensions,
      selectedRangePos: mockSelectedRangePos,
      excelContext: excelContextMock,
    };

    // @ts-expect-error
    const imageProps = determineImagePropsToBeAddedToBook(args);
    expect(imageProps).toEqual({
      width: 123,
      height: 342,
      top: 345,
      left: 256,
      sheet: mockSheet,
    });

    expect(getCurrentExcelSheetMock).toBeCalled();
  });

  it('should work as expected for duplicate operation', () => {
    const getCurrentExcelSheetMock = jest
      .spyOn(officeApiHelper, 'getCurrentExcelSheet')
      .mockImplementation(() => mockSheet);
    const args = {
      operationType: OperationTypes.DUPLICATE_OPERATION,
      shapeProps: undefined as any,
      shapeInWorksheet: undefined as any,
      shapeDimensionsForDuplicateOp: mockDuplicateShapeDimensions,
      vizDimensions: mockVizDimensions,
      selectedRangePos: mockSelectedRangePos,
      excelContext: excelContextMock,
    };

    // @ts-expect-error
    const imageProps = determineImagePropsToBeAddedToBook(args);
    expect(imageProps).toEqual({
      width: 123,
      height: 342,
      top: 345,
      left: 256,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();

    // @ts-expect-error
    const args1 = { ...args, shapeDimensionsForDuplicateOp: undefined };

    // @ts-expect-error
    const imageProps1 = determineImagePropsToBeAddedToBook(args1);
    expect(imageProps1).toEqual({
      width: 123,
      height: 342,
      top: 345,
      left: 256,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();

    // @ts-expect-error
    const args2 = { ...args, selectedRangePos: undefined };

    // @ts-expect-error
    const imageProps2 = determineImagePropsToBeAddedToBook(args2);
    expect(imageProps2).toEqual({
      width: 123,
      height: 342,
      top: 0,
      left: 0,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();
  });

  it('should work as expected for edit operation', () => {
    const getCurrentExcelSheetMock = jest
      .spyOn(officeApiHelper, 'getCurrentExcelSheet')
      .mockImplementation(() => mockSheet);
    const args = {
      operationType: OperationTypes.EDIT_OPERATION,
      shapeProps: undefined as any,
      shapeInWorksheet: mockShapeInWorksheet,
      shapeDimensionsForDuplicateOp: undefined as any,
      vizDimensions: mockVizDimensions,
      selectedRangePos: mockSelectedRangePos,
      excelContext: excelContextMock,
    };

    // @ts-expect-error
    const imageProps = determineImagePropsToBeAddedToBook(args);
    expect(imageProps).toEqual({
      width: 564,
      height: 643,
      top: 34,
      left: 56,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();

    // @ts-expect-error
    const args1 = { ...args, shapeInWorksheet: undefined };

    // @ts-expect-error
    const imageProps1 = determineImagePropsToBeAddedToBook(args1);
    expect(imageProps1).toEqual({
      width: 123,
      height: 342,
      top: 345,
      left: 256,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();
  });

  it('should work as expected for refresh operation', () => {
    const getCurrentExcelSheetMock = jest
      .spyOn(officeApiHelper, 'getCurrentExcelSheet')
      .mockImplementation(() => mockSheet);

    const args = {
      operationType: OperationTypes.REFRESH_OPERATION,
      shapeProps: mockShapeProps,
      shapeInWorksheet: undefined as any,
      shapeDimensionsForDuplicateOp: undefined as any,
      vizDimensions: mockVizDimensions,
      selectedRangePos: mockSelectedRangePos,
      excelContext: excelContextMock,
    };

    // @ts-expect-error
    const imageProps = determineImagePropsToBeAddedToBook(args);
    expect(imageProps).toEqual({
      width: 453,
      height: 356,
      top: 237,
      left: 765,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();

    const args1 = {
      ...args,
      shapeProps: undefined as any,
      shapeInWorksheet: mockShapeInWorksheet,
    };

    // @ts-expect-error
    const imageProps1 = determineImagePropsToBeAddedToBook(args1);
    expect(imageProps1).toEqual({
      width: 564,
      height: 643,
      top: 34,
      left: 56,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();

    // @ts-expect-error
    const args2 = { ...args, shapeProps: undefined };

    // @ts-expect-error
    const imageProps2 = determineImagePropsToBeAddedToBook(args2);
    expect(imageProps2).toEqual({
      width: 123,
      height: 342,
      top: 345,
      left: 256,
      sheet: mockSheet,
    });
    expect(getCurrentExcelSheetMock).toBeCalled();
  });
});
