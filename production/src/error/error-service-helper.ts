import officeReducerHelper from '../office/store/office-reducer-helper';

import { PageByDisplayType } from '../page-by/page-by-types';
import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';

import { OperationTypes } from '../operation/operation-type-names';
import {
  errorMessageFactory,
  ErrorMessages,
  ErrorType,
  getIsPageByAttributeNumberChangedError,
  httpStatusToErrorType,
  IncomingErrorStrings,
  stringMessageToErrorType,
} from './constants';

const COLUMN_EXCEL_API_LIMIT = 5000;

class ErrorServiceHelper {
  /**
   * Return ErrorType based on the error
   *
   * @param error Error object that was thrown
   * @param operationData Data about the operation that was performed
   * @returns ErrorType
   */
  getErrorType = (error: any, operationData?: OperationData): ErrorType => {
    const updateError = this.getExcelError(error, operationData);
    const pageByError = this.getPageByError(operationData, updateError);

    return (
      pageByError ||
      updateError.type ||
      this.getOfficeErrorType(updateError) ||
      this.getRestErrorType(updateError)
    );
  };

  /**
   * Return ErrorType based on the error and operation type
   * @param error Error object that was thrown
   * @param operationData Data about the operation that was performed
   * @returns ErrorType
   */
  getPageByError = (operationData: OperationData, error: any): ErrorType => {
    const object = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(
      operationData?.objectWorkingId
    );

    // Objects imported as default page should be treated like regular objects
    // and Page-by error handling should not apply to them
    if (object?.pageByData?.pageByDisplayType === PageByDisplayType.DEFAULT_PAGE) {
      return;
    }

    switch (operationData?.operationType) {
      case OperationTypes.REFRESH_OPERATION:
        if (getIsPageByAttributeNumberChangedError(error)) {
          return ErrorType.PAGE_BY_REFRESH_ERR;
        }
        break;
      case OperationTypes.DUPLICATE_OPERATION:
        if (getIsPageByAttributeNumberChangedError(error)) {
          return ErrorType.PAGE_BY_DUPLICATE_ERR;
        }
        break;
      case OperationTypes.IMPORT_OPERATION:
        if (object?.pageByData) {
          return ErrorType.PAGE_BY_IMPORT_ERR;
        }
        break;
      default:
        break;
    }
  };

  /**
   * Extracts error details from the error object
   *
   * @param error Error object that was thrown
   * @params errorMessage Error message
   * @returns error details to display
   */
  getErrorDetails = (error: any, errorMessage: string): string => {
    const errorDetails = (error.response && error.response.text) || error.message || '';
    let details;
    const {
      EXCEEDS_EXCEL_API_LIMITS,
      SHEET_HIDDEN,
      TABLE_OVERLAP,
      INVALID_VIZ_KEY_MESSAGE,
      NOT_IN_METADATA,
      EMPTY_REPORT,
    } = ErrorMessages;
    switch (errorMessage) {
      case EXCEEDS_EXCEL_API_LIMITS:
      case SHEET_HIDDEN:
      case TABLE_OVERLAP:
      case INVALID_VIZ_KEY_MESSAGE:
      case NOT_IN_METADATA:
      case EMPTY_REPORT:
        details = '';
        break;
      default:
        details = errorMessage !== errorDetails ? errorDetails : '';
        break;
    }
    return details;
  };

  /**
   * Function getting errors that occurs in Office operations.
   *
   * @param error Error object that was thrown
   */
  getOfficeErrorType = (error: any): string => {
    console.warn({ error });

    if (error.name === 'RichApi.Error') {
      return stringMessageToErrorType(error.message);
    }
    return null;
  };

  /**
   * Function getting errors that occurs in types of operations.
   * Transform the error that happens when import too many columns and fail in context.sync.
   *
   * @param error Error thrown during the operation execution
   * @param operationData Contains informatons about current operation
   */
  getExcelError = (error: any, operationData: OperationData): any => {
    const { name, code, debugInfo } = error;
    const isExcelApiError =
      name === 'RichApi.Error' &&
      code === 'GeneralException' &&
      debugInfo.message === 'An internal error has occurred.';
    const exceedLimit =
      operationData &&
      operationData.instanceDefinition &&
      operationData.instanceDefinition.columns > COLUMN_EXCEL_API_LIMIT;
    let updateError;
    switch (operationData && operationData.operationType) {
      case OperationTypes.IMPORT_OPERATION:
      case OperationTypes.DUPLICATE_OPERATION:
      case OperationTypes.REFRESH_OPERATION:
      case OperationTypes.EDIT_OPERATION:
        if (isExcelApiError && exceedLimit) {
          updateError = { ...error, type: 'exceedExcelApiLimit', message: '' };
        } else {
          updateError = error;
        }
        break;
      default:
        updateError = error;
        break;
    }
    return updateError;
  };

  /**
   * Function getting errors that occurs in REST requests.
   *
   * @param error Error object that was thrown
   * @returns ErrorType
   */
  getRestErrorType = (error: any): ErrorType => {
    if (!error.status && !error.response) {
      if (error.message && error.message.includes(IncomingErrorStrings.CONNECTION_BROKEN)) {
        return ErrorType.CONNECTION_BROKEN_ERR;
      }
      return null;
    }

    const status = error.status || (error.response ? error.response.status : null);
    return httpStatusToErrorType(status);
  };

  /**
   * Function getting error message based on the error type
   *
   * @param error Error object that was thrown
   * @returns Error message
   */
  getErrorMessage = (error: any): ErrorMessages => {
    const errorType = this.getErrorType(error);
    return errorMessageFactory(errorType)({ error });
  };
}

export const errorServiceHelper = new ErrorServiceHelper();
