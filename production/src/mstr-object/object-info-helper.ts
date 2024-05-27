import { localizeDate } from '@mstr/connector-components';

import { officeApiHelper } from '../office/api/office-api-helper';
import officeTableHelperRange from '../office/table/office-table-helper-range';
import { pageByHelper } from '../page-by/page-by-helper';

import { reduxStore } from '../store';

import { ObjectData } from '../types/object-types';

import i18n from '../i18n';

/**
 * Retrieves object details and indexes to format specific value on worksheet.
 * @param object - The object data.
 * @returns An object containing the object detail values and indexes to format.
 */
export const getObjectDetailsForWorksheet = (
  object: ObjectData
): {
  objectDetailValues: string[][];
  indexesToFormat: number[];
} => {
  const isReport = object.mstrObjectType.name === 'report';
  const worksheetDetailsSettings =
    reduxStore.getState().settingsReducer.worksheetObjectInfoSettings;

  const enabledWorksheetDetailsSettings = worksheetDetailsSettings.filter(
    setting => setting.toggleChecked
  );

  const objectDetailValues: string[][] = [];
  const indexesToFormat: number[] = [];

  let formatIndex = 0;

  // TODO: Duplicated cases 'filter', 'dateModified', 'dateCreated' can be deleted later.
  // For now they are kept for backward compatibility.
  enabledWorksheetDetailsSettings.forEach(setting => {
    switch (setting.key) {
      case 'name':
        objectDetailValues.push([object.name], ['']);
        indexesToFormat.push(formatIndex);
        formatIndex += 2;
        break;
      case 'owner':
        objectDetailValues.push([setting.item], [object.details?.owner.name], ['']);
        indexesToFormat.push(formatIndex);
        formatIndex += 3;
        break;
      case 'description':
        objectDetailValues.push([setting.item], [object.details?.description || '-'], ['']);
        indexesToFormat.push(formatIndex);
        formatIndex += 3;
        break;
      case 'filter':
      case 'filters':
        if (isReport) {
          const mergedViewFilters =
            object.details?.filters.metricLimitsText === '-'
              ? object.details?.filters.viewFilterText
              : `${object.details?.filters.viewFilterText}, ${object.details?.filters.metricLimitsText}`;

          objectDetailValues.push(
            [i18n.t('Report Filter')],
            [object.details?.filters.reportFilterText],
            [''],
            [i18n.t('Report Limits')],
            [object.details?.filters.reportLimitsText],
            [''],
            [i18n.t('View Filter')],
            [mergedViewFilters],
            ['']
          );

          indexesToFormat.push(formatIndex);
          formatIndex += 3;
          indexesToFormat.push(formatIndex);
          formatIndex += 3;
          indexesToFormat.push(formatIndex);
          formatIndex += 3;
        } else {
          objectDetailValues.push(
            [setting.item],
            [object.details?.filters.viewFilterText || '-'],
            ['']
          );
          indexesToFormat.push(formatIndex);
          formatIndex += 3;
        }
        break;
      case 'importedBy':
        objectDetailValues.push([setting.item], [object.details?.importedBy], ['']);
        indexesToFormat.push(formatIndex);
        formatIndex += 3;
        break;
      case 'dateModified':
      case 'modifiedDate':
        objectDetailValues.push(
          [setting.item],
          [
            localizeDate({
              date: object.details?.modifiedDate,
              locale: i18n.language,
              toUTC: false,
            }).string,
          ],
          ['']
        );
        indexesToFormat.push(formatIndex);
        formatIndex += 3;
        break;
      case 'dateCreated':
      case 'createdDate':
        objectDetailValues.push(
          [setting.item],
          [
            localizeDate({
              date: object.details?.createdDate,
              locale: i18n.language,
              toUTC: false,
            }).string,
          ],
          ['']
        );
        indexesToFormat.push(formatIndex);
        formatIndex += 3;
        break;
      case 'id':
        objectDetailValues.push([setting.item], [object.objectId], ['']);
        indexesToFormat.push(formatIndex);
        formatIndex += 3;
        break;
      case 'pageBy':
        if (isReport) {
          const pageByData =
            object?.pageByData?.elements?.length &&
            pageByHelper.getPageByElements(object.pageByData);

          if (pageByData) {
            objectDetailValues.push([i18n.t('Paged-By')], [pageByData], ['']);
            indexesToFormat.push(formatIndex);
            formatIndex += 3;
          }
        }
        break;
      default:
        break;
    }
  });

  return { objectDetailValues, indexesToFormat };
};

/**
 * Inserts and formats object details in the worksheet.
 * @param params
 * @param params.objectData - The object data.
 * @param params.excelContext - The Excel request context.
 * @param params.objectDetailsRange - The range where the object details will be inserted.
 * @returns A promise that resolves when the object details are inserted and formatted.
 */
export const insertAndFormatObjectDetails = async ({
  objectData,
  excelContext,
  objectDetailsRange,
}: {
  objectData: ObjectData;
  excelContext: Excel.RequestContext;
  objectDetailsRange: Excel.Range;
}): Promise<void> => {
  if (objectDetailsRange) {
    const { objectDetailValues, indexesToFormat } = getObjectDetailsForWorksheet(objectData);
    excelContext.trackedObjects.add(objectDetailsRange);
    objectDetailsRange.clear();
    objectDetailsRange.numberFormat = [['@']];
    objectDetailsRange.values = objectDetailValues;

    objectDetailsRange.load(['rowCount']);

    await excelContext.sync();

    for (let row = 0; row < objectDetailsRange.rowCount; row++) {
      if (indexesToFormat.includes(row)) {
        objectDetailsRange.getCell(row, 0).format.font.bold = true;
      }
    }
  }
};

/**
 * Retrieves the range of object details in the specified worksheet.
 *
 * @param params - The parameters for retrieving the object details range.
 * @param params.worksheet - The worksheet to retrieve the range from.
 * @param params.objectDetailsStartCell - The starting cell of the object details range.
 * @param params.objectDetailsSize - The size of the object details range.
 * @returns A promise returns the range of object details.
 */
export const getObjectDetailsRange = async ({
  worksheet,
  objectDetailsStartCell,
  objectDetailsSize,
}: {
  worksheet: Excel.Worksheet;
  objectDetailsStartCell: string;
  objectDetailsSize: number;
}): Promise<Excel.Range> => {
  const objectDetailsEndCell = officeApiHelper.offsetCellBy(
    objectDetailsStartCell,
    objectDetailsSize - 1,
    0
  );

  const objectDetailsRange = worksheet.getRange(
    `${objectDetailsStartCell}:${objectDetailsEndCell}`
  );

  return objectDetailsRange;
};

/**
 * Checks the range for object info and where the table will be placed after object info in the worksheet.
 *
 * @param params - The parameters object for checking the range for object info.
 * @param params.worksheet The Excel worksheet to check.
 * @param params.excelContext The Excel request context.
 * @param params.currentTableStartCell The starting cell of the current table.
 * @param params.previousObjectDetailsSize The size of the previous object details.
 * @param params.newObjectDetailsSize The size of the new object details.
 * @param params.isCrosstab Indicates if the table is a crosstab.
 * @param params.rows The number of rows in the table.
 * @param params.columns The number of columns in the table.
 * @param params.isNewStartCellSelected Indicates whether the new cell is selected.
 * @param params.crosstabHeaderDimensions The dimensions of the crosstab headers.
 *
 * @returns A Promise that resolves when the range check is complete.
 */
export const checkRangeForObjectInfo = async ({
  worksheet,
  excelContext,
  currentTableStartCell,
  previousObjectDetailsSize,
  newObjectDetailsSize,
  isCrosstab,
  rows,
  columns,
  isNewStartCellSelected,
  crosstabHeaderDimensions,
}: {
  worksheet: Excel.Worksheet;
  excelContext: Excel.RequestContext;
  currentTableStartCell: string;
  previousObjectDetailsSize: number;
  newObjectDetailsSize: number;
  isCrosstab: boolean;
  rows: number;
  columns: number;
  isNewStartCellSelected: boolean;
  crosstabHeaderDimensions: { rowsX: number; columnsY: number };
}): Promise<void> => {
  const tableRows = isCrosstab ? rows : rows + 1;
  let objectSizeDifference = newObjectDetailsSize - previousObjectDetailsSize;

  const currentTableRow = currentTableStartCell.split(/(\d+)/)[1];

  // When there is no place left for the object details above the table we should not check actual range.
  // Otherwise it will go out of the worksheet. That's why we change the objectSizeDifference to rows left to the top.
  if (objectSizeDifference < 0 && parseInt(currentTableRow, 10) < Math.abs(objectSizeDifference)) {
    objectSizeDifference = -(parseInt(currentTableRow, 10) - 1);
  }

  // When isNewStartCellSelected is true, it will act like initial import and that's why we need to check the object details range validity again.
  if (isNewStartCellSelected) {
    const objectDetailsRange = await getObjectDetailsRange({
      worksheet,
      objectDetailsStartCell: currentTableStartCell,
      objectDetailsSize: newObjectDetailsSize,
    });

    excelContext.trackedObjects.add(objectDetailsRange);
    await officeTableHelperRange.checkRangeValidity(excelContext, objectDetailsRange);

    // Just like initial import, we need to check the range below the table no matter settings are increased or decreased.
    // That's why we need to change the objectSizeDifference to positive for subsequent steps.
    objectSizeDifference = Math.abs(objectSizeDifference);
  }

  const headersToAddRow = isCrosstab ? crosstabHeaderDimensions.columnsY : 0;
  const headersToAddColumn = isCrosstab ? crosstabHeaderDimensions.rowsX : 0;

  // Top left cell of the range to check.
  const beginCell =
    objectSizeDifference <= 0
      ? officeApiHelper.offsetCellBy(currentTableStartCell, objectSizeDifference, 0)
      : officeApiHelper.offsetCellBy(currentTableStartCell, tableRows + headersToAddRow, 0);

  // Bottom right cell of the range to check.
  const endCell =
    objectSizeDifference <= 0
      ? officeApiHelper.offsetCellBy(currentTableStartCell, -1, columns + headersToAddColumn - 1)
      : officeApiHelper.offsetCellBy(
          currentTableStartCell,
          tableRows + headersToAddRow + objectSizeDifference - 1,
          columns + headersToAddColumn - 1
        );

  const rangeToCheck = worksheet.getRange(`${beginCell}:${endCell}`);

  await officeTableHelperRange.checkRangeValidity(excelContext, rangeToCheck);
};
