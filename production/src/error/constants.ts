import { GlobalNotificationTypes } from '@mstr/connector-components';

import i18n from '../i18n';

const withDefaultValue = (object: any, defaultValue: any) => (value: string) => {
  if (value in object) {
    return object[value];
  }
  return defaultValue;
};

export enum ErrorType {
  ENV_NOT_FOUND_ERR = 'environmentNotFound',
  CONNECTION_BROKEN_ERR = 'connectionBroken',
  UNAUTHORIZED_ERR = 'unauthorized',
  BAD_REQUEST_ERR = 'badRequest',
  INTERNAL_SERVER_ERR = 'internalServer',
  PROMPTED_REPORT_ERR = 'promptedReport',
  OUTSIDE_OF_RANGE_ERR = 'outsideOfRange',
  OVERLAPPING_TABLES_ERR = 'overlappingTables',
  RUN_OUTSIDE_OFFICE_ERR = 'runOutsideOffice',
  TABLE_REMOVED_FROM_EXCEL_ERR = 'tableRemovedFromExcel',
  IMAGE_REMOVED_FROM_EXCEL_ERR = 'imageRemovedFromExcel',
  SHEET_HIDDEN_ERR = 'sheetHidden',
  GENERIC_OFFICE_ERR = 'genericOffice',
  PROTECTED_SHEET_ERR = 'protectedSheet',
  UNKNOWN_ERR = 'unknown',
  INVALID_VIZ_KEY = 'invalidVizKey',
  EXCEEDS_EXCEL_API_LIMITS = 'exceedExcelApiLimit',
  PAGE_BY_REFRESH_ERR = 'pageByRefresh',
  PAGE_BY_IMPORT_ERR = 'pageByImport',
  PAGE_BY_DUPLICATE_ERR = 'pageByDuplicate',
}

export enum IncomingErrorStrings {
  EXCEL_NOT_DEFINED = 'Excel is not defined',
  TABLE_OVERLAP = "A table can't overlap another table. ",
  BINDING_NOT_VALID = 'This object binding is no longer valid due to previous updates.',
  RESOURCE_NOT_EXIST = "The requested resource doesn't exist.",
  SHEET_HIDDEN = 'The current selection is invalid for this operation.',
  SHEET_HIDDEN_IMAGE = 'This reference is invalid for the current operation.',
  CONNECTION_BROKEN = 'Possible causes: the network is offline,',
  INVALID_VIZ_KEY = 'Invalid visualization key',
}

export enum ErrorLocation {
  MULTIPLE_RANGE_SELECTED = 'Workbook.getSelectedRange',
  SHEET_HIDDEN = 'Range.select',
  SHEET_HIDDEN_IMAGE = 'Worksheet.activate',
}

export enum ErrorMessages {
  GENERIC_SERVER_ERR = 'This object cannot be imported.',
  ALL_DATA_FILTERED_OUT = 'No data returned for this view. This might be because the applied prompt excludes all data.',
  EMPTY_REPORT = 'You cannot import an empty object.',
  NO_DATA_RETURNED = 'This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty.',
  NOT_SUPPORTED_SERVER_ERR = 'This object cannot be imported. Objects with cross tabs, totals, or subtotals are not supported in this version of MicroStrategy for Office.',
  NOT_SUPPORTED_PROMPTS_REFRESH = 'Objects with prompts cannot be refreshed in this version of MicroStrategy for Office.',
  NOT_PUBLISHED_CUBE = 'You cannot import an unpublished cube.',
  NO_DATA_SELECTED = 'This button is currently disabled because you didn’t select any data',
  NOT_IN_METADATA = 'The object no longer exists, it has been removed from the data source.',
  PROJECT_ROW_LIMIT = 'This object exceeds the MicroStrategy project row limit. Please contact your administrator.',
  TABLE_OVERLAP = 'This operation requires the use of additional empty rows or columns.',
  ERROR_POPUP_CLOSED = 'Function close call failed, error code:',
  NOT_SUPPORTED_CUSTOM_GROUP = 'This object cannot be imported. Objects with custom groups are not supported in this version of MicroStrategy for Office.',
  TABLE_REMOVED = 'It looks like the object was deleted from the workbook. Delete it in the sidebar or click Add Data to import it again.',
  ENDPOINT_NOT_REACHED = 'The endpoint cannot be reached',
  EXCEEDS_WORKSHEET_LIMITS = 'The table you try to import exceeds the worksheet limits.',
  EXCEEDS_EXCEL_API_LIMITS = 'Import failed because the payload size limit for any Excel Online request or response is 5MB. Try to limit your data.',
  OUTSIDE_OF_OFFICE = 'Please run plugin inside Office',
  CONNECTION_BROKEN = 'Environment is unreachable. Please check your internet connection.',
  WRONG_CREDENTIALS = 'Wrong username or password.',
  SESSION_EXPIRED = 'Your session has expired. Please log in.',
  PROBLEM_WITH_REQUEST = 'There has been a problem with your request',
  UNKNOWN_ERROR = 'An error has occurred',
  LOGIN_FAILURE = 'Login failure',
  OBJ_REMOVED_FROM_EXCEL = 'This object does not exist in the workbook anymore.',
  VISUALIZATION_REMOVED_FROM_EXCEL = 'Could not complete the operation. The image was deleted manually.',
  SHEET_HIDDEN = 'To view the data, please unhide the worksheet.',
  PROTECTED_SHEET = 'The table you are trying to manipulate is in a protected sheet. To make a change, unprotect the sheet. You might be requested to enter a password.',
  NOT_SUPPORTED_VIZ = 'Selected visualization cannot be imported in current version of the Add-in',
  NON_GRID_VIZ_NOT_SUPPORTED = 'Selected non-grid visualization cannot be imported as formatted data',
  INVALID_VIZ_KEY_MESSAGE = 'You are trying to perform an operation on a visualization that is either not supported or deleted from the dossier.',
  SESSION_EXTENSION_FAILURE_MESSAGE = "The user's session has expired, please reauthenticate",
  DOSSIER_HAS_CHANGED = 'The object cannot be refreshed because the dossier has changed. You can edit the object or remove it.',
  NOT_AVAILABLE_FOR_DOSSIER = 'This option is not available for dossier',
  CHECKING_SELECTION = 'Checking selection...',
  MISSING_ELEMENT_OBJECT_MESSAGE = 'This action cannot be performed. It appears that part of the data has been removed from the data source. Please click Edit to see the changes.',
  WRONG_RANGE = 'Please select only one range before import.',
  MICROSTRATEGY_API_MISSING = 'Cannot find microstrategy.dossier, please check if embeddinglib.js is present in your environment.',
  PAGE_BY_REFRESH_ERROR_MESSAGE = 'The source object has been modified. You can either edit it or delete it.',
}

export const stringMessageToErrorType = withDefaultValue(
  {
    [IncomingErrorStrings.EXCEL_NOT_DEFINED]: ErrorType.RUN_OUTSIDE_OFFICE_ERR,
    [IncomingErrorStrings.TABLE_OVERLAP]: ErrorType.OVERLAPPING_TABLES_ERR,
    [IncomingErrorStrings.BINDING_NOT_VALID]: ErrorType.TABLE_REMOVED_FROM_EXCEL_ERR,
    [IncomingErrorStrings.RESOURCE_NOT_EXIST]: ErrorType.TABLE_REMOVED_FROM_EXCEL_ERR,
    [IncomingErrorStrings.SHEET_HIDDEN]: ErrorType.SHEET_HIDDEN_ERR,
    [IncomingErrorStrings.SHEET_HIDDEN_IMAGE]: ErrorType.SHEET_HIDDEN_ERR,
    [IncomingErrorStrings.CONNECTION_BROKEN]: ErrorType.CONNECTION_BROKEN_ERR,
  },
  ErrorType.GENERIC_OFFICE_ERR
);

export const httpStatusToErrorType = withDefaultValue(
  {
    400: ErrorType.BAD_REQUEST_ERR,
    401: ErrorType.UNAUTHORIZED_ERR,
    403: ErrorType.INTERNAL_SERVER_ERR, // TODO: Proper error for forbidden access
    404: ErrorType.ENV_NOT_FOUND_ERR,
    500: ErrorType.INTERNAL_SERVER_ERR,
    501: ErrorType.INTERNAL_SERVER_ERR,
    502: ErrorType.CONNECTION_BROKEN_ERR,
    503: ErrorType.CONNECTION_BROKEN_ERR,
    504: ErrorType.CONNECTION_BROKEN_ERR,
  },
  ErrorType.UNKNOWN_ERR
);

// temporarily we map all those codes to one message; may be changed in the future
const iServerErrorMessages = withDefaultValue(
  {
    '-2147171501': ErrorMessages.NOT_SUPPORTED_SERVER_ERR,
    '-2147171502': ErrorMessages.NOT_SUPPORTED_CUSTOM_GROUP,
    '-2147171503': ErrorMessages.NOT_SUPPORTED_SERVER_ERR,
    '-2147171504': ErrorMessages.NOT_SUPPORTED_SERVER_ERR,
    '-2147072488': ErrorMessages.NOT_PUBLISHED_CUBE,
    '-2147466604': ErrorMessages.NOT_PUBLISHED_CUBE,
    '-2147205488': ErrorMessages.PROJECT_ROW_LIMIT,
    '-2147216373': ErrorMessages.NOT_IN_METADATA,
    '-2147216959': ErrorMessages.LOGIN_FAILURE,
    '-2147207419': ErrorMessages.CONNECTION_BROKEN,
    '-2147213784': ErrorMessages.NO_DATA_RETURNED,
    '-2147213377': ErrorMessages.DOSSIER_HAS_CHANGED,
    '-2147472508': ErrorMessages.INVALID_VIZ_KEY_MESSAGE,
  },
  ErrorMessages.GENERIC_SERVER_ERR
);

export const httpStatusCodes = {
  UNAUTHORIZED_ERROR: 401,
  FORBIDDEN_ERROR: 403,
};

export const errorCodes = {
  ERR003: 'ERR003',
  ERR006: 'ERR006',
  ERR009: 'ERR009',
};

export const getIsPageByAttributeNumberChangedError = (error: any): boolean => {
  const errorString = error?.response?.body?.message;

  const pageByAttributeChangedErrorPattern =
    /The report has \d+ page-by units but you have input \d+ page-by selected elements\./;
  const pageByObjectDoesNotMatchErrorPattern =
    /In position \d+, the selected page-by element '[^']+' and page-by unit id '[^']+' dont match\./;

  return (
    pageByAttributeChangedErrorPattern.test(errorString) ||
    pageByObjectDoesNotMatchErrorPattern.test(errorString)
  );
};

export const handleBadRequestError = (error: any): string => {
  const { ERR006 } = errorCodes;
  if (
    error.response &&
    error.response.body &&
    error.response.body.code === ERR006 &&
    error.response.body.message.includes('Failed to find the') &&
    error.response.body.message.includes('in the report or cube.')
  ) {
    return ErrorMessages.MISSING_ELEMENT_OBJECT_MESSAGE;
  }
  return ErrorMessages.PROBLEM_WITH_REQUEST;
};

export const handleUnauthorizedError = (error: any): string => {
  const { ERR003 } = errorCodes;
  if (
    error.response.body &&
    error.response.body.code === ERR003 &&
    error.response.body.iServerCode &&
    iServerErrorMessages(error.response.body.iServerCode) === ErrorMessages.LOGIN_FAILURE
  ) {
    return ErrorMessages.WRONG_CREDENTIALS;
  }
  return ErrorMessages.SESSION_EXPIRED;
};

export const handleEnvNotFoundError = (error: any): string => {
  if (error.response && error.response.body && error.response.body.iServerCode === -2147216373) {
    if (error.mstrObjectType) {
      return `This ${error.mstrObjectType} was deleted.`;
    }
    return ErrorMessages.NOT_IN_METADATA;
  }
  return ErrorMessages.ENDPOINT_NOT_REACHED;
};

export const handleWrongRange = (error: any): string => {
  if (!error.debugInfo) {
    return ErrorMessages.UNKNOWN_ERROR;
  }

  switch (error.debugInfo.errorLocation) {
    case ErrorLocation.SHEET_HIDDEN:
    case ErrorLocation.SHEET_HIDDEN_IMAGE:
      return ErrorMessages.SHEET_HIDDEN;
    case ErrorLocation.MULTIPLE_RANGE_SELECTED:
      return ErrorMessages.WRONG_RANGE;
    default:
      return ErrorMessages.UNKNOWN_ERROR;
  }
};

export const errorMessageFactory = withDefaultValue(
  {
    [ErrorType.ENV_NOT_FOUND_ERR]: ({ error }: { error: any }) => handleEnvNotFoundError(error),
    [ErrorType.CONNECTION_BROKEN_ERR]: () => ErrorMessages.CONNECTION_BROKEN,
    [ErrorType.UNAUTHORIZED_ERR]: ({ error }: { error: any }) => handleUnauthorizedError(error),
    [ErrorType.BAD_REQUEST_ERR]: ({ error }: { error: any }) => handleBadRequestError(error),
    [ErrorType.INTERNAL_SERVER_ERR]: ({ error }: { error: any }) =>
      iServerErrorMessages(
        (error.response && error.response.body && error.response.body.iServerCode) || '-1'
      ),
    [ErrorType.PROMPTED_REPORT_ERR]: () => ErrorMessages.NOT_SUPPORTED_PROMPTS_REFRESH,
    [ErrorType.OUTSIDE_OF_RANGE_ERR]: () => ErrorMessages.EXCEEDS_WORKSHEET_LIMITS,
    [ErrorType.OVERLAPPING_TABLES_ERR]: () => ErrorMessages.TABLE_OVERLAP,
    [ErrorType.RUN_OUTSIDE_OFFICE_ERR]: () => ErrorMessages.OUTSIDE_OF_OFFICE,
    [ErrorType.TABLE_REMOVED_FROM_EXCEL_ERR]: () => ErrorMessages.OBJ_REMOVED_FROM_EXCEL,
    [ErrorType.IMAGE_REMOVED_FROM_EXCEL_ERR]: () => ErrorMessages.VISUALIZATION_REMOVED_FROM_EXCEL,
    [ErrorType.SHEET_HIDDEN_ERR]: ({ error }: { error: any }) => handleWrongRange(error),
    [ErrorType.GENERIC_OFFICE_ERR]: ({ error }: { error: any }) =>
      `${i18n.t('An error has occurred in Excel.')} ${error.message}`,
    [ErrorType.PROTECTED_SHEET_ERR]: () => ErrorMessages.PROTECTED_SHEET,
    [ErrorType.INVALID_VIZ_KEY]: () => ErrorMessages.INVALID_VIZ_KEY_MESSAGE,
    [ErrorType.EXCEEDS_EXCEL_API_LIMITS]: () => ErrorMessages.EXCEEDS_EXCEL_API_LIMITS,
    [ErrorType.PAGE_BY_REFRESH_ERR]: () => ErrorMessages.PAGE_BY_REFRESH_ERROR_MESSAGE,
  },
  ({ error }: { error: any }) => error.message || ErrorMessages.UNKNOWN_ERROR
);

// Stores an array containing all the global notification types (all warnings and errors)
// that we read from connector-components
export const globalNotificationWarningAndErrorStrings = Object.values(
  GlobalNotificationTypes || {}
);

export enum TableOperation {
  CREATE_NEW_TABLE = 'createNewTable',
  UPDATE_EXISTING_TABLE = 'updateExistingTable',
}
