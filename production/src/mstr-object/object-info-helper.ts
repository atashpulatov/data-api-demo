import { localizeDate } from '@mstr/connector-components';

import { officeApiHelper } from '../office/api/office-api-helper';

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
            object.pageByData.elements.map(element => element.value).join(', ');

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
 *
 * @param objectDetailsSize - The number of rows needed for the object details.
 * @param startCell - The starting cell for inserting the object details.
 * @param objectData - The object data.
 * @param worksheet - The Excel worksheet.
 * @param excelContext - The Excel request context.
 * @returns A promise that resolves when the object details are inserted and formatted.
 */
export const insertAndFormatObjectDetails = async ({
  objectDetailsSize,
  startCell,
  objectData,
  worksheet,
  excelContext,
}: {
  objectDetailsSize: number;
  startCell: string;
  objectData: ObjectData;
  worksheet: Excel.Worksheet;
  excelContext: Excel.RequestContext;
}): Promise<void> => {
  if (objectDetailsSize > 0) {
    const lastCellOfDetails = officeApiHelper.offsetCellBy(startCell, objectDetailsSize - 1, 0);
    const tableDetailsAddress = `${startCell}:${lastCellOfDetails}`;
    const tableDetailsRange = worksheet.getRange(tableDetailsAddress);

    const { objectDetailValues, indexesToFormat } = getObjectDetailsForWorksheet(objectData);
    tableDetailsRange.numberFormat = [['@']];
    tableDetailsRange.values = objectDetailValues;

    const dataRange = tableDetailsRange.load(['rowCount']);
    excelContext.trackedObjects.add(dataRange);
    await excelContext.sync();

    for (let row = 0; row < dataRange.rowCount; row++) {
      if (indexesToFormat.includes(row)) {
        dataRange.getCell(row, 0).format.font.bold = true;
      }
    }

    await excelContext.sync();
  }
};
