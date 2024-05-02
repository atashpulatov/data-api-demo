import { officeApiHelper } from '../office/api/office-api-helper';

import { reduxStore } from '../store';

import { ObjectData } from '../types/object-types';

import i18n from '../i18n';

// TODO: Import localizeDate from connector components and use it for dates.
// const parseDate = (dateToParse: string | undefined): string =>
//     localizeDate({ date: dateToParse, locale: i18n.language, toUTC: false }).string;

const getObjectDetailsForWorksheet = (
  object: ObjectData
): {
  objectDetailValues: string[][];
  valuesToFormat: string[];
} => {
  const isReport = object.mstrObjectType.name === 'report';
  const worksheetDetailsSettings =
    reduxStore.getState().settingsReducer.worksheetObjectInfoSettings;

  const enabledWorksheetDetailsSettings = worksheetDetailsSettings.filter(
    setting => setting.toggleChecked
  );

  const objectDetailValues: string[][] = [];
  const valuesToFormat: string[] = [];

  enabledWorksheetDetailsSettings.forEach(setting => {
    switch (setting.key) {
      case 'name':
        valuesToFormat.push(object.name);
        objectDetailValues.push([object.name], ['']);
        break;
      case 'owner':
        valuesToFormat.push(setting.item);
        objectDetailValues.push([setting.item], [object.details?.owner.name], ['']);
        break;
      case 'description':
        valuesToFormat.push(setting.item);
        objectDetailValues.push([setting.item], [object.details?.description || '-'], ['']);
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

          valuesToFormat.push(i18n.t('Report Filter'));
          valuesToFormat.push(i18n.t('Report Limits'));
          valuesToFormat.push(i18n.t('View Filter'));
        } else {
          objectDetailValues.push(
            [setting.item],
            [object.details?.filters.viewFilterText || '-'],
            ['']
          );
        }
        break;
      case 'importedBy':
        objectDetailValues.push([setting.item], [object.details?.importedBy], ['']);
        valuesToFormat.push(setting.item);
        break;
      case 'dateModified':
        objectDetailValues.push([setting.item], [object.details?.modifiedDate], ['']);
        valuesToFormat.push(setting.item);
        break;
      case 'dateCreated':
        objectDetailValues.push([setting.item], [object.details?.createdDate], ['']);
        valuesToFormat.push(setting.item);
        break;
      case 'id':
        objectDetailValues.push([setting.item], [object.objectId], ['']);
        valuesToFormat.push(setting.item);
        break;
      case 'pageBy':
        if (isReport) {
          const pageByData =
            object?.pageByData?.elements?.length &&
            object.pageByData.elements.map(element => element.value).join(', ');

          objectDetailValues.push([i18n.t('Paged-By')], [pageByData || '-'], ['']);
          valuesToFormat.push(i18n.t('Paged-By'));
        }
        break;
      default:
        break;
    }
  });

  return { objectDetailValues, valuesToFormat };
};

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
    // Offset the start cell by the number of rows needed for the object details
    const lastCellOfDetails = officeApiHelper.offsetCellBy(startCell, objectDetailsSize - 1, 0);
    const tableDetailsAddress = `${startCell}:${lastCellOfDetails}`;
    const tableDetailsRange = worksheet.getRange(tableDetailsAddress);

    const { objectDetailValues, valuesToFormat } = getObjectDetailsForWorksheet(objectData);
    tableDetailsRange.values = objectDetailValues;

    for (const value of valuesToFormat) {
      const conditionalFormat = tableDetailsRange.conditionalFormats.add(
        Excel.ConditionalFormatType.cellValue
      );

      const rule = {
        formula1: `"${value}"`,
        operator: Excel.ConditionalCellValueOperator.equalTo,
      };

      conditionalFormat.cellValue.rule = rule;
      conditionalFormat.cellValue.format.font.bold = true;
    }

    await excelContext.sync();
  }
};
