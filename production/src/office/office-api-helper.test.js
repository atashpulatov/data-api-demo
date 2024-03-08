import { officeApiHelper } from './api/office-api-helper';

import { reduxStore } from '../store';

import { officeProperties } from '../redux-reducer/office-reducer/office-properties';

const INVALID_SELECTION = 'InvalidSelection';
// FIXME: these were disabled anyway. Needs to be redone.
describe('OfficeApiHelper', () => {
  beforeAll(() => {
    officeApiHelper.excel = {};
    officeApiHelper.init(reduxStore);
  });
  it('should convert simple excel column name to number', () => {
    // given
    const columnName = 'A';
    // when
    const result = officeApiHelper.lettersToNumber(columnName);
    // then
    expect(result).toEqual(1);
  });
  it('should convert complex excel column name to number', () => {
    // given
    const columnName = 'CA';
    // when
    const result = officeApiHelper.lettersToNumber(columnName);
    // then
    expect(result).toEqual(79);
  });
  it('should throw an error due to number instead of column name', () => {
    // given
    const columnName = '23';
    let result;
    // when
    try {
      result = officeApiHelper.lettersToNumber(columnName);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
    }
    expect(result).toBeUndefined();
  });
  it('should throw an error due to incorrect column name', () => {
    // given
    const columnName = 'alamaKota';
    let result;
    // when
    try {
      result = officeApiHelper.lettersToNumber(columnName);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
    }
    expect(result).toBeUndefined();
  });
  it('should return proper range for normal case range starting at A1', () => {
    // given
    const headerCount = 12;
    const startCell = 'A1';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('A1:L1');
  });

  it('should return proper range for normal case range starting at AL1234', () => {
    // given
    const headerCount = 12;
    const startCell = 'AL1234';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('AL1234:AW1234');
  });

  it('should return proper range for very small range', () => {
    // given
    const headerCount = 1;
    const startCell = 'A1';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('A1:A1');
  });

  it('should return proper range for very huge range', () => {
    // given
    const headerCount = 1001;
    const startCell = 'A1';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('A1:ALM1');
  });

  it('should return proper 2D range when defining row count', () => {
    // given
    const headerCount = 1001;
    const startCell = 'A1';
    const rowCount = 1000;
    // when
    const result = officeApiHelper.getRange(headerCount, startCell, rowCount);
    // then
    expect(result).toEqual('A1:ALM1001');
  });

  it('should error due to incorrect start cell', () => {
    // given
    const headerCount = 1001;
    const startCell = 'A!1';
    let result;
    // when
    try {
      result = officeApiHelper.getRange(headerCount, startCell);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
    }
    expect(result).toBeUndefined();
  });

  it('should throw error due to incorrect header count', () => {
    // given
    const headerCount = 'asd';
    const startCell = 'A1';
    let result;
    // when
    try {
      result = officeApiHelper.getRange(headerCount, startCell);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
    }
    expect(result).toBeUndefined();
  });

  describe('getSelectedCell', () => {
    it('should return starting cell from range address(single cell)', async () => {
      // given
      const loadMock = jest.fn().mockImplementation(() => 'Sheet1!A12');
      const getCellMock = jest.fn().mockImplementation(() => ({
        load: loadMock,
        address: loadMock(),
      }));
      const mockSync = jest.fn();
      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => ({ getCell: getCellMock })),
        },
        sync: mockSync,
      };
      // when
      const result = await officeApiHelper.getSelectedCell(context);
      // then
      expect(context.workbook.getSelectedRange).toBeCalled();
      expect(getCellMock).toBeCalled();
      expect(loadMock).toBeCalled();
      expect(loadMock).toBeCalledWith(officeProperties.officeAddress);
      expect(result).toEqual('A12');
      expect(mockSync).toBeCalled();
    });
    it('should return starting cell from range address(multiple cells)', async () => {
      // given
      const loadMock = jest.fn().mockImplementation(() => 'Sheet1!A12:B14');
      const mockSync = jest.fn();
      const getCellMock = jest.fn().mockImplementation(() => ({
        load: loadMock,
        address: loadMock(),
      }));
      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => ({ getCell: getCellMock })),
        },
        sync: mockSync,
      };
      // when
      const result = await officeApiHelper.getSelectedCell(context);
      // then
      expect(context.workbook.getSelectedRange).toBeCalled();
      expect(getCellMock).toBeCalled();
      expect(loadMock).toBeCalled();
      expect(loadMock).toBeCalledWith(officeProperties.officeAddress);
      expect(result).toEqual('A12');
      expect(mockSync).toBeCalled();
    });

    it('should return and active cell if INVALID_SELECTION error is thrown)', async () => {
      // given
      const error = new Error('error');
      error.code = INVALID_SELECTION;
      const mockSync = jest.fn();
      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => {
            throw error;
          }),
        },
        sync: mockSync,
      };

      jest
        .spyOn(reduxStore, 'getState')
        .mockReturnValueOnce({ officeReducer: { activeCellAddress: 'CD34' } });

      // when
      const result = await officeApiHelper.getSelectedCell(context);
      // then
      expect(result).toEqual('CD34');
    });

    it('should return defaul cell if INVALID_SELECTION error is thrown and active cell is null)', async () => {
      // given
      const error = new Error('error');
      error.code = INVALID_SELECTION;
      const mockSync = jest.fn();
      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => {
            throw error;
          }),
        },
        sync: mockSync,
      };

      jest
        .spyOn(reduxStore, 'getState')
        .mockReturnValueOnce({ officeReducer: { activeCellAddress: null } });

      // when
      const result = await officeApiHelper.getSelectedCell(context);
      // then
      expect(result).toEqual('A1');
    });
  });
  describe('getStartCellOfRange', () => {
    it('should return starting cell from range address(single cell)', () => {
      // given
      const range = 'Sheet1!A12';
      // when
      const result = officeApiHelper.getStartCellOfRange(range);
      // then
      expect(result).toEqual('A12');
    });
    it('should return starting cell from range address(multiple cells)', () => {
      // given
      const range = 'Sheet1!ABC12:BDE15';
      // when
      const result = officeApiHelper.getStartCellOfRange(range);
      // then
      expect(result).toEqual('ABC12');
    });
    it('should return starting cell with sheet name including !', () => {
      // given
      const range = 'No!Sheet1!ABC12:BDE15';
      // when
      const result = officeApiHelper.getStartCellOfRange(range);
      // then
      expect(result).toEqual('ABC12');
    });
  });

  describe('getSelectedRangePosition', () => {
    it('should return starting cell with selected range !', async () => {
      // given
      const loadMock = jest.fn().mockImplementation(() => 'Sheet1!A12');
      const mockSync = jest.fn();
      const getCellMock = jest.fn().mockImplementation(() => ({
        load: loadMock,
        top: 244,
        left: 345,
      }));

      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => ({ getCell: getCellMock })),
        },
        sync: mockSync,
      };
      // when
      const result = await officeApiHelper.getSelectedRangePosition(context);
      // then
      expect(result).toEqual({ top: 244, left: 345 });
    });

    it('should return active selected range position if INVALID_SELECTION error is thrown', async () => {
      // given
      const error = new Error('error');
      error.code = INVALID_SELECTION;
      const mockSync = jest.fn();
      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => {
            throw error;
          }),
        },
        sync: mockSync,
      };

      jest
        .spyOn(reduxStore, 'getState')
        .mockReturnValueOnce({ officeReducer: { activeCellAddress: 'CD34' } });
      jest
        .spyOn(officeApiHelper, 'convertCellAddressToRangePosition')
        .mockReturnValueOnce({ top: 244, left: 345 });

      // when
      const result = await officeApiHelper.getSelectedRangePosition(context);
      // then
      expect(result).toEqual({ top: 244, left: 345 });
    });

    it('should return active selected range position if INVALID_SELECTION error is thrown and active cell is null', async () => {
      // given
      const error = new Error('error');
      error.code = INVALID_SELECTION;
      const mockSync = jest.fn();
      const context = {
        workbook: {
          getSelectedRange: jest.fn().mockImplementation(() => {
            throw error;
          }),
        },
        sync: mockSync,
      };

      jest
        .spyOn(reduxStore, 'getState')
        .mockReturnValueOnce({ officeReducer: { activeCellAddress: null } });

      // when
      const result = await officeApiHelper.getSelectedRangePosition(context);
      // then
      expect(result).toEqual({ top: 0, left: 0 });
    });
  });
  describe('addGeometricShape', () => {
    it('Should return shape with provided properties', async () => {
      // given
      const mock = jest.fn();

      const shapeProps = {
        left: 350,
        top: 45,
        height: 480,
        width: 960,
        worksheetId: 'worksheetIdTest',
      };

      window.Excel = {
        GeometricShapeType: {
          rectangle: 'Rectangle',
        },
      };

      const excelContextMock = {
        workbook: {
          worksheets: {
            getItem: jest.fn().mockImplementation(_worksheetId => ({
              shapes: {
                addGeometricShape: jest.fn().mockImplementation(_geometricShapeType => ({
                  fill: {},
                  load: mock,
                })),
              },
            })),
          },
        },
        sync: mock,
      };
      // when
      const shape = await officeApiHelper.addGeometricShape(
        excelContextMock,
        shapeProps,
        'visualizationName'
      );
      // then

      const expectedShape = {
        fill: {
          foregroundColor: 'white',
          transparency: 0.1,
        },
        height: 480,
        left: 350,
        load: mock,
        name: 'visualizationName',
        top: 45,
        width: 960,
      };
      expect(shape).toEqual(expectedShape);
    });
  });
});
