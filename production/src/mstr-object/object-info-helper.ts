import { localizeDate } from '@mstr/connector-components';

import { officeApiHelper } from '../office/api/office-api-helper';
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

          objectDetailValues.push([i18n.t('Paged-By')], [pageByData || '-'], ['']);
          indexesToFormat.push(formatIndex);
          formatIndex += 3;
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
