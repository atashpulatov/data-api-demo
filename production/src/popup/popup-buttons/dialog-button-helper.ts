import { ErrorMessages } from '../../error/constants';
import { ObjectImportType } from '../../mstr-object/constants';
import { ImportActionTypes, ImportButtonIds } from './dialog-import-button/import-button-constants';

class DialogButtonHelper {
  getDisableReasonImport(
    isPublished: boolean,
    disableActiveActions: boolean,
    disablePrimaryOnFormattedDataImport?: boolean,
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
    // Disable 'Import Formatted Data' button on non-grid visualization selection
    if (disablePrimaryOnFormattedDataImport) {
      return ErrorMessages.NON_GRID_VIZ_NOT_SUPPORTED;
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
   * @returns the id, actionType and handleOk for the import button
   */
  getImportButtonProps(
    useImportAsRunButton: boolean,
    importType: ObjectImportType
  ): { id: string; actionType: string } {
    let id = ImportButtonIds.IMPORT;
    let actionType = ImportActionTypes.IMPORT;

    console.log('HHHHHHHHH - importType', importType)

    if (importType === ObjectImportType.TABLE) {
      id = ImportButtonIds.IMPORT_DATA;
      actionType = ImportActionTypes.IMPORT_DATA;
    }

    if (importType === ObjectImportType.PIVOT_TABLE) {
      id = ImportButtonIds.IMPORT_PIVOT_TABLE;
      actionType = ImportActionTypes.IMPORT_PIVOT_TABLE;
    }

    if (importType === ObjectImportType.FORMATTED_TABLE) {
      id = ImportButtonIds.IMPORT_DATA_WITH_FORMATTING;
      actionType = ImportActionTypes.IMPORT_DATA_WITH_FORMATTING;
    }

    if (importType === ObjectImportType.IMAGE) {
      id = ImportButtonIds.IMPORT_IMAGE;
      actionType = ImportActionTypes.IMPORT_IMAGE;
    }

    if (useImportAsRunButton) {
      id = ImportButtonIds.RUN;
      actionType = ImportActionTypes.APPLY;
    }

    return { id, actionType };
  }
}

const dialogButtonHelper = new DialogButtonHelper();
export default dialogButtonHelper;
