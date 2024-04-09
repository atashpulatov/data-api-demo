import { ErrorMessages } from '../../error/constants';
import { ObjectImportType } from '../../mstr-object/constants';
import { ImportActionTypes, ImportButtonIds } from './import-btn-constants';

type ImportButtonOptionsType = { value: string; key: ObjectImportType; disabled?: boolean }[];

class DialogButtonHelper {
  getDisableReasonImport(
    isPublished: boolean,
    disableActiveActions: boolean,
    disableSecondary?: boolean,
    checkingSelection?: boolean
  ): ErrorMessages {
    if (!isPublished && isPublished !== undefined) {
      if (disableSecondary) {
        return ErrorMessages.NOT_SUPPORTED_VIZ;
      }
      return ErrorMessages.NOT_PUBLISHED_CUBE;
    }
    if (disableActiveActions) {
      return ErrorMessages.NO_DATA_SELECTED;
    }
    if (checkingSelection !== undefined && checkingSelection) {
      return ErrorMessages.CHECKING_SELECTION;
    }
  }

  getDisableReason(
    isPublished: boolean,
    disableSecondary: boolean,
    disableActiveActions: boolean
  ): ErrorMessages {
    const disableReasonForImport = this.getDisableReasonImport(isPublished, disableActiveActions);
    return disableSecondary ? ErrorMessages.NOT_AVAILABLE_FOR_DOSSIER : disableReasonForImport;
  }

  /**
   * Gets the import button props.
   * Most common case is to import as data - then primary id, actionType and handleOk are used.
   * If import as visualization is happening, then secondary id, actionType and handleOk are used, because this is what dossier-window.tsx is passing.
   * In case of prompts view useImportAsRunButton is true, so the id and actionType are changed to ImportButtonIds.RUN and "Apply".
   * @param useImportAsRunButton - boolean flag to determine if the import button is used as run button (prompts view)
   * @param importType - the type of the import that is being made
   * @param handleOkProp - the function that is called when the import button is clicked
   * @param handleSecondary - the function that is called when the import button is clicked and the import type is image
   * @returns the id, actionType and handleOk for the import button
   */
  getImportButtonProps(
    useImportAsRunButton: boolean,
    importType: ObjectImportType,
    handleOkProp: () => void,
    handleSecondary: () => void
  ): { id: string; actionType: string; handleOk: () => void } {
    let id = ImportButtonIds.IMPORT;
    let actionType = ImportActionTypes.IMPORT;
    let handleOk = handleOkProp;

    // TODO: Update for Import as Pivot Table
    if (importType === ObjectImportType.IMAGE) {
      id = ImportButtonIds.IMPORT_IMAGE;
      actionType = ImportActionTypes.IMPORT_IMAGE;
      handleOk = handleSecondary;
    }

    if (useImportAsRunButton) {
      id = ImportButtonIds.RUN;
      actionType = ImportActionTypes.APPLY;
    }

    return { id, actionType, handleOk };
  }

  /**
   * Gets the import button options array.
   * If import as visualization is allowed, then it's added to the options array.
   * If import as pivot table is allowed, then it's added to the options array.
   * If it's edit mode disable other options from previously selected.
   * @param showImportAsPivotTable - boolean flag to determine if import as pivot table is allowed
   * @param showImportAsVisualization - boolean flag to determine if import as visualization is allowed
   * @param importType - the type of the import that is being made
   * @param isEdit - boolean flag to determine if edit workflow is active
   * @returns options array for the import button
   */
  getImportButtonOptions(
    showImportAsPivotTable: boolean,
    showImportAsVisualization: boolean,
    importType: ObjectImportType,
    isEdit: boolean
  ): ImportButtonOptionsType {
    const options: ImportButtonOptionsType = [
      {
        'value': 'Import as Data',
        'key': ObjectImportType.TABLE,
        'disabled': isEdit && importType !== ObjectImportType.TABLE,
      },
    ];

    if (showImportAsVisualization) {
      options.push({
        'value': 'Import as Visualization',
        'key': ObjectImportType.IMAGE,
        'disabled': isEdit && importType !== ObjectImportType.IMAGE,
      });
    }

    if (showImportAsPivotTable) {
      options.push({
        'value': 'Import as Pivot Table',
        'key': ObjectImportType.PIVOT_TABLE,
        'disabled': isEdit && importType !== ObjectImportType.PIVOT_TABLE,
      });
    }

    return options;
  }
}

const dialogButtonHelper = new DialogButtonHelper();
export default dialogButtonHelper;
