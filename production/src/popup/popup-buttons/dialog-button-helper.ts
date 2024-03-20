import { ErrorMessages } from '../../error/constants';

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
}

const dialogButtonHelper = new DialogButtonHelper();
export default dialogButtonHelper;
