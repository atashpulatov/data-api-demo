import { Dispatch, SetStateAction } from 'react';

import { authenticationHelper } from '../../authentication/authentication-helper';
import { officeApiCrosstabHelper } from './office-api-crosstab-helper';

import { IncorrectInputTypeError } from '../../error/incorrect-input-type';
import { OutsideOfRangeError } from '../../error/outside-of-range-error';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import {
  DEFAULT_CELL_POSITION,
  DEFAULT_RANGE_POSITION,
  ObjectImportType,
} from '../../mstr-object/constants';

const ALPHABET_RANGE_START = 1;
const ALPHABET_RANGE_END = 26;
const ASCII_CAPITAL_LETTER_INDEX = 65;
const EXCEL_ROW_LIMIT = 1048576;
const EXCEL_COL_LIMIT = 16384;
const INVALID_SELECTION = 'InvalidSelection';

class OfficeApiHelper {
  reduxStore: any;

  init(reduxStore: any): void {
    this.reduxStore = reduxStore;
  }

  /**
   * checks excel session and auth token
   *
   */
  async checkStatusOfSessions(): Promise<void> {
    await Promise.all([this.getExcelSessionStatus(), authenticationHelper.validateAuthToken()]);
  }

  /**
   * Gets range of the Excel table added to Workbook binded item collection.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   * @returns Reference to Excel Range
   */
  getBindingRange(excelContext: Excel.RequestContext, bindId: string): Excel.Range {
    return excelContext.workbook.bindings.getItem(bindId).getTable().getRange();
  }

  /**
   * Gets Excel table added to Workbook binded item collection.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   * @returns Reference to Excel Table
   */
  getTable(excelContext: Excel.RequestContext, bindId: string): Excel.Table {
    return excelContext.workbook.bindings.getItem(bindId).getTable();
  }

  /**
   * Gets a new Excel Context.
   *
   * @returns Reference to a new Excel Context used by Excel API functions
   */
  async getExcelContext(): Promise<Excel.RequestContext> {
    return window.Excel.run({ delayForCellEdit: true }, async excelContext => excelContext);
  }

  /**
   * Gets Office Context.
   *
   * @returns Reference to Office Context used by Office API functions
   */
  async getOfficeContext(): Promise<Office.Context> {
    return window.Office.context;
  }

  /**
   * Checks the status of Excel session.
   *
   * @returns Returns true if the Excel session is active, false otherwise
   */
  async getExcelSessionStatus(): Promise<boolean> {
    return !!(await this.getExcelContext());
  }

  /**
   * Returns top left cell of selected range. If the selected cell is invalid,
   * returns the top left cell of the last active cell, else returns the default cell address.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns Address of the cell.
   * @throws INVALID_SELECTION error if the selected cell is invalid
   */
  async getSelectedCell(excelContext: Excel.RequestContext): Promise<string> {
    try {
      const selectedRangeStart = excelContext.workbook.getSelectedRange().getCell(0, 0);
      selectedRangeStart.load(OfficeSettingsEnum.officeAddress);
      await excelContext.sync();
      return this.getStartCellOfRange(selectedRangeStart.address);
    } catch (error) {
      /*
      If the error is InvalidSelection it means that the selected range is invalid.
      https://learn.microsoft.com/en-us/office/dev/add-ins/testing/application-specific-api-error-handling
      In that case we will return the last active cell address, else we will return default cell address.
      For all other case we throw the error.
      */
      if (error.code !== INVALID_SELECTION) {
        throw error;
      }

      let defaultCellAddress;

      const { activeCellAddress } = this.reduxStore.getState().officeReducer;
      // If the active cell address is valid, then select the last active cell
      if (activeCellAddress) {
        defaultCellAddress = activeCellAddress;
      } else {
        defaultCellAddress = DEFAULT_CELL_POSITION;
        // Update the active cell address with default cell address
        this.reduxStore.dispatch(officeActions.setActiveCellAddress(DEFAULT_CELL_POSITION));
      }

      return defaultCellAddress;
    }
  }

  /**
   * Returns the position of the topLeftMost cell of the selected range. If the selected range is invalid,
   * returns the topLeftMost cell of the last active range, else returns the default range position.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns object containing the top, left value of the range.
   * @throws INVALID_SELECTION error if the selected cell is invalid
   */
  async getSelectedRangePosition(
    excelContext: Excel.RequestContext
  ): Promise<{ top: number; left: number } | undefined> {
    try {
      const selectedRange = excelContext.workbook.getSelectedRange().getCell(0, 0);
      selectedRange.load(['top', 'left']);
      await excelContext.sync();
      return {
        top: selectedRange.top,
        left: selectedRange.left,
      };
    } catch (error) {
      /*
      If the error is InvalidSelection it means that the selected range is invalid.
      https://learn.microsoft.com/en-us/office/dev/add-ins/testing/application-specific-api-error-handling
      In that case we will return the last active range position, else we will return default range position.
      For all other case we throw the error.
      */
      if (error.code !== INVALID_SELECTION) {
        throw error;
      }

      let defaultRangePosition;

      const { activeCellAddress } = this.reduxStore.getState().officeReducer;
      // If the active cell address is valid, then select the last active range
      if (activeCellAddress) {
        defaultRangePosition = await this.convertCellAddressToRangePosition(
          excelContext,
          activeCellAddress
        );
      } else {
        defaultRangePosition = DEFAULT_RANGE_POSITION;
        // Update the active cell address with default cell address
        this.reduxStore.dispatch(officeActions.setActiveCellAddress(DEFAULT_CELL_POSITION));
      }

      return defaultRangePosition;
    }
  }

  /**
   * Converts the cell address to range position.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param cellAddress Excel cell address
   * @returns object containing the top, left value of the range.
   */
  async convertCellAddressToRangePosition(
    excelContext: Excel.RequestContext,
    cellAddress: string
  ): Promise<{ top: number; left: number }> {
    const currentExcelSheet = this.getCurrentExcelSheet(excelContext);
    const rangePosition = currentExcelSheet.getRange(cellAddress);

    rangePosition.load(['top', 'left']);
    await excelContext.sync();

    return {
      top: rangePosition.top,
      left: rangePosition.left,
    };
  }

  /**
   * Returns top left cell from passed address.
   *
   * @param excelAddress Reference to Excel Context used by Excel API functions
   * @returns Address of the cell.
   */
  getStartCellOfRange(excelAddress: string): string {
    const regexCellAddress = /!(\w+\d+)(:|$)/; // NO SONAR
    return excelAddress.match(regexCellAddress)[1];
  }

  /**
   * Gets Excel range based on starting cell and number of columns and rows.
   *
   * @param headerCount Number of rows
   * @param startCell Address of the cell in Excel spreadsheet
   * @param rowCount Number of rows
   * @returns Address of Excel Range
   */
  getRange(headerCount: number, startCell: string, rowCount: number = 0): string {
    if (!Number.isInteger(headerCount)) {
      throw new IncorrectInputTypeError();
    }

    const startCellArray = startCell.split(/(\d+)/);
    headerCount += this.lettersToNumber(startCellArray[0]) - 1;

    const endColumn = this.numberToLetters(headerCount);
    const endRow = Number(startCellArray[1]) + rowCount;

    if (endRow > EXCEL_ROW_LIMIT || headerCount > EXCEL_COL_LIMIT) {
      throw new OutsideOfRangeError('The table you try to import exceeds the worksheet limits.');
    }
    return `${startCell}:${endColumn}${endRow}`;
  }

  /**
   * Gets the Excel table dimensions based on table range.
   *
   * @param tableRange address of range of the table
   * 
   * @returns Dimensions of excel table range
   */
  getTableDimensions(tableRange: string): { rows: number, columns: number } {
    const tableRangeArray = tableRange.split(':');

    const startCellArray = tableRangeArray[0].split(/(\d+)/);
    const endCellArray = tableRangeArray[1].split(/(\d+)/);

    const columns = this.lettersToNumber(endCellArray[0]) - (this.lettersToNumber(startCellArray[0]) - 1);
    const rows = Number(endCellArray[1]) - (Number(startCellArray[1]) - 1);

    return { rows, columns };
  }

  /**
   * Returns excel sheet from specific table.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   *
   * @returns Excel sheet or false in case of error
   */
  async getExcelSheetFromTable(
    excelContext: Excel.RequestContext,
    bindId: string
  ): Promise<Excel.Worksheet | false> {
    try {
      const officeTable = excelContext.workbook.tables.getItem(bindId);
      await excelContext.sync();
      return officeTable.getRange().worksheet;
    } catch (error) {
      return false;
    }
  }

  /**
   * Returns current excel sheet.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns Reference to active Excel Worksheet
   */
  getCurrentExcelSheet(excelContext: Excel.RequestContext): Excel.Worksheet {
    return excelContext.workbook.worksheets.getActiveWorksheet();
  }

  /**
   * Retrieves the excel sheet by sheet id.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param worksheetId Worksheet id
   *
   * @returns Reference to active Excel Worksheet
   */
  getExcelSheetById(excelContext: Excel.RequestContext, worksheetId: string): Excel.Worksheet {
    return excelContext.workbook.worksheets.getItemOrNullObject(worksheetId);
  }

  /**
   * Copies the range from source worksheet to target worksheet.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param worksheetId Worksheet id
   *
   * @returns Reference to active Excel Worksheet
   */
  async copyRangeFromSourceWorksheet(
    rangeMigrationInfo: any,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    const { sourceTableRange, sourceWorksheet, targetTableRange, targetWorksheet } =
      rangeMigrationInfo;

    targetWorksheet.getRange(targetTableRange).copyFrom(sourceWorksheet.getRange(sourceTableRange));
    await excelContext.sync();
  }

  /**
   * Hides the excel worksheet as soft hidden.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param worksheetId Worksheet id
   *
   * @returns Reference to active Excel Worksheet
   */
  async hideExcelWorksheet(
    worksheetId: string,
    excelContext: Excel.RequestContext
  ): Promise<Excel.Worksheet> {
    const worksheet = excelContext.workbook.worksheets.getItem(worksheetId);
    worksheet.visibility = Excel.SheetVisibility.hidden;

    await excelContext.sync();

    return worksheet;
  }

  /**
   * Inserts the list of excel worksheets into current functional workbook.
   *
   * @param externalWorkbookBase64 Export engine workbook encoded in base 64
   * @param excelContext Reference to Excel Context used by Excel API functions
   *
   * @returns Reference to active Excel Worksheet
   */
  insertExcelWorksheets(externalWorkbookBase64: string, excelContext: Excel.RequestContext): any {
    return excelContext.workbook.insertWorksheetsFromBase64(externalWorkbookBase64, {
      positionType: Excel.WorksheetPositionType.end, // always insert new sheets at the end of workbook
    });
  }

  /**
   * Converts number of column to Excel column name.
   *
   * @param headerCount Number of rows
   * @returns Excel column indicator
   */
  numberToLetters(headerCount: number): string {
    let result = '';
    let firstNumber = ALPHABET_RANGE_START;
    let secondNumber = ALPHABET_RANGE_END;

    headerCount -= firstNumber;
    while (headerCount >= 0) {
      result =
        String.fromCharCode(
          (headerCount % secondNumber) / firstNumber + ASCII_CAPITAL_LETTER_INDEX
        ) + result;

      firstNumber = secondNumber;
      secondNumber *= ALPHABET_RANGE_END;
      headerCount -= firstNumber;
    }

    return result;
  }

  /**
   * Converts Excel column name to index of the column.
   *
   * @param letters Name of the Excel column
   * @returns Index of the Excel column
   */
  lettersToNumber(letters: string): number {
    if (!letters.match(/^[A-Z]*[A-Z]$/)) {
      throw new IncorrectInputTypeError();
    }
    return letters.split('').reduce((r, a) => r * ALPHABET_RANGE_END + parseInt(a, 36) - 9, 0);
  }

  /**
   * Offsets Excel address by passed row and column offset.
   *
   * @param cell Address of the cell in Excel spreadsheet
   * @param rowOffset Number of rows
   * @param colOffset Number of column
   * @returns Address of Excel cell
   */
  offsetCellBy(cell: string, rowOffset: number, colOffset: number): string {
    const cellArray = cell.split(/(\d+)/);
    const [column, row] = cellArray;
    const endRow = parseInt(row, 10) + rowOffset;
    const endColumn = this.numberToLetters(this.lettersToNumber(column) + colOffset);
    return `${endColumn}${endRow}`;
  }

  /**
   * Highlights imported object in Excel worksheet.
   *
   * Throws error if object no longer exists in Excel or if Excel or MSTR session expired.
   *
   * @param ObjectData.bindId Id of the Office table created on import used for referencing the Excel table
   * @param ObjectData.isCrosstab Specify if object is a crosstab
   * @param ObjectData.crosstabHeaderDimensions Contains information about crosstab headers dimensions
   */
  async onBindingObjectClick(ObjectData: any): Promise<void> {
    const { bindId, isCrosstab, crosstabHeaderDimensions, importType } = ObjectData;

    const excelContext = await this.getExcelContext();
    const officeTable = excelContext.workbook.tables.getItem(bindId);

    if (isCrosstab) {
      const crosstabRange = await this.getCrosstabRange({
        excelContext,
        importType,
        crosstabHeaderDimensions,
        officeTable,
        bindId,
      });
      crosstabRange.select();
    } else {
      const tableRange = this.getBindingRange(excelContext, bindId);
      tableRange.select();
    }
    await excelContext.sync();
  }

  /**
   * Determines the range of the given crosstabular table.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param importType Type of the import that is being made
   * @param crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param officeTable Reference to Table created by Excel
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   */
  private async getCrosstabRange({
    excelContext,
    importType,
    crosstabHeaderDimensions,
    officeTable,
    bindId,
  }: any): Promise<Excel.Range> {
    let crosstabRange: Excel.Range;
    if (importType === ObjectImportType.FORMATTED_DATA) {
      const tableRange = this.getBindingRange(excelContext, bindId);
      crosstabRange = tableRange.getOffsetRange(-1, 0).getResizedRange(1, 0);
    } else {
      const tmpXtabDimensions = {
        ...crosstabHeaderDimensions,
        columnsY: crosstabHeaderDimensions.columnsY,
      };
      crosstabRange = await officeApiCrosstabHelper.getCrosstabRangeSafely(
        officeTable,
        tmpXtabDimensions,
        excelContext
      );
    }

    return crosstabRange;
  }

  /**
   * Adds binding to the Excel table.
   *
   * @param namedItem Excel Table
   * @param bindId Id of the Office table created on import used for referencing the Excel table
   */
  bindNamedItem(namedItem: Excel.Table, bindId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      window.Office.context.document.bindings.addFromNamedItemAsync(
        namedItem,
        'table',
        { id: bindId },
        (result: { status: string; value: { type: any; id: any }; error: { message: any } }) => {
          if (result.status === 'succeeded') {
            console.info(
              `Added new binding with type: ${result.value.type} and id: ${result.value.id}`
            );
            resolve();
          } else {
            console.error(`Error: ${result.error.message}`);
            reject(result.error);
          }
        }
      );
    });
  }

  /**
   * Returns the new initial cell considering crosstabs.
   *
   * For crosstab initial cell is offsetted.
   *
   * @param cell Starting table body cell
   * @param headers Headers object from OfficeConverterServiceV2.getHeaders
   * @param isCrosstab Indicates if it's a crosstab
   * @returns Address of Excel table start cell
   */
  getTableStartCell({
    startCell,
    instanceDefinition,
    prevOfficeTable,
  }: {
    startCell: string;
    instanceDefinition: any;
    prevOfficeTable: any;
  }): string {
    const {
      mstrTable: {
        isCrosstab,
        prevCrosstabDimensions,
        crosstabHeaderDimensions,
        toCrosstabChange,
        fromCrosstabChange,
      },
    } = instanceDefinition;

    if (fromCrosstabChange) {
      return this.offsetCellBy(
        startCell,
        -(prevCrosstabDimensions.columnsY - 1),
        -prevCrosstabDimensions.rowsX
      );
    }

    if (!toCrosstabChange && (!isCrosstab || prevOfficeTable)) {
      return startCell;
    }

    const rowOffset = crosstabHeaderDimensions.columnsY - 1;
    const colOffset = crosstabHeaderDimensions.rowsX;
    return this.offsetCellBy(startCell, rowOffset, colOffset);
  }

  /**
   * Attaches a event listener to onSelectionChanged on workbook.
   * As event handler, resets the active cell value via callback and then updates it with new value.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param setActiveCellAddress Callback to save the active cell address value.
   */
  async addOnSelectionChangedListener(
    excelContext: Excel.RequestContext,
    setActiveCellAddress: Function,
    setActiveSheetId: Dispatch<SetStateAction<string>>,
    isAnyPopupOrSettingsDisplayedRef: React.MutableRefObject<boolean>
  ): Promise<void> {
    excelContext.workbook.onSelectionChanged.add(async () => {
      try {
        // only read + update active sheet id if no popup (notifications, Office dialog, etc.) or settings visible
        if (!isAnyPopupOrSettingsDisplayedRef.current) {
          const activeWorksheet = this.getCurrentExcelSheet(excelContext);

          activeWorksheet.load('id');
          await excelContext.sync();

          setActiveSheetId(activeWorksheet.id);
        }
        // active cell address will always be updated
        const activeCellAddress = await this.getSelectedCell(excelContext);
        setActiveCellAddress(activeCellAddress);
      } catch (e) {
        console.warn('Cannot update active selection');
      }
    });
    await excelContext.sync();
  }

  /**
   * Takes cell address. Extracts and removes worksheet name.
   * Splits rest into part with chars and part with numbers.
   * Appends $ beetwen chars and numbers and at the begginig of address.
   *
   * @param cellAddress Excel address of seleted cell, e.g 'Sheet1!AB21'
   * @returns cellAddres with $ at the begginig and beetwen row and column indicator, e.g. '$AB$21'
   */
  getCellAddressWithDollars(cellAddress: string): string {
    try {
      const splitAt = (string: string, index: number): string[] => [
        string.slice(0, index),
        string.slice(index),
      ];
      const [cell] = cellAddress.split('!').reverse();
      const indexOfRowAddress = cell.search(/\d+/);
      const [column, row] = splitAt(cell, indexOfRowAddress);
      return `$${column}$${row}`;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * Adds the geometric shape into the worksheet with given shape properties.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param shapeProps Properties of the shape
   * @param visualizationName Name of the shape
   * @returns Shape imported into worksheet
   */
  async addGeometricShape(
    excelContext: Excel.RequestContext,
    shapeProps: any,
    visualizationName: string
  ): Promise<any> {
    const sheet = excelContext.workbook.worksheets.getItem(shapeProps?.worksheetId);
    const shape = sheet?.shapes?.addGeometricShape(Excel.GeometricShapeType.rectangle);

    if (shape) {
      const shapeFill = shape.fill;
      shapeFill.transparency = 0.1;
      shapeFill.foregroundColor = 'white';

      shape.left = shapeProps?.left;
      shape.top = shapeProps?.top;
      shape.height = shapeProps?.height;
      shape.width = shapeProps?.width;
      shape.name = visualizationName;

      shape.load(['id']);
      await excelContext.sync();
    }

    return shape;
  }
}

export const officeApiHelper = new OfficeApiHelper();
