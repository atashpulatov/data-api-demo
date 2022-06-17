import { customT } from '../customTranslation';

const withDefaultValue = (obj, defaultValue) => (value) => {
  if (value in obj) {
    return obj[value];
  }
  return defaultValue;
};

export const errorTypes = {
  ENV_NOT_FOUND_ERR: 'environmentNotFound',
  CONNECTION_BROKEN_ERR: 'connectionBroken',
  UNAUTHORIZED_ERR: 'unauthorized',
  BAD_REQUEST_ERR: 'badRequest',
  INTERNAL_SERVER_ERR: 'internalServer',
  PROMPTED_REPORT_ERR: 'promptedReport',
  OUTSIDE_OF_RANGE_ERR: 'outsideOfRange',
  OVERLAPPING_TABLES_ERR: 'overlappingTables',
  RUN_OUTSIDE_OFFICE_ERR: 'runOutsideOffice',
  TABLE_REMOVED_FROM_EXCEL_ERR: 'tableRemovedFromExcel',
  SHEET_HIDDEN_ERR: 'sheetHidden',
  GENERIC_OFFICE_ERR: 'genericOffice',
  PROTECTED_SHEET_ERR: 'protectedSheet',
  UNKNOWN_ERR: 'unknown',
  INVALID_VIZ_KEY: 'invalidVizKey',
  EXCEEDS_EXCEL_API_LIMITS: 'exceedExcelApiLimit',
};

export const incomingErrorStrings = {
  EXCEL_NOT_DEFINED: 'Excel is not defined',
  TABLE_OVERLAP: 'A table can\'t overlap another table. ',
  BINDING_NOT_VALID: 'This object binding is no longer valid due to previous updates.',
  RESOURCE_NOT_EXIST: 'The requested resource doesn\'t exist.',
  SHEET_HIDDEN: 'The current selection is invalid for this operation.',
  CONNECTION_BROKEN: 'Possible causes: the network is offline,',
  INVALID_VIZ_KEY: 'Invalid visualization key',
};

export const errorLocation = {
  MULTIPLE_RANGE_SELECTED: 'Workbook.getSelectedRange',
  SHEET_HIDDEN: 'Range.select'
};

export const stringMessageToErrorType = withDefaultValue({
  [incomingErrorStrings.EXCEL_NOT_DEFINED]: errorTypes.RUN_OUTSIDE_OFFICE_ERR,
  [incomingErrorStrings.TABLE_OVERLAP]: errorTypes.OVERLAPPING_TABLES_ERR,
  [incomingErrorStrings.BINDING_NOT_VALID]: errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR,
  [incomingErrorStrings.RESOURCE_NOT_EXIST]: errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR,
  [incomingErrorStrings.SHEET_HIDDEN]: errorTypes.SHEET_HIDDEN_ERR,
  [incomingErrorStrings.CONNECTION_BROKEN]: errorTypes.CONNECTION_BROKEN_ERR,
}, errorTypes.GENERIC_OFFICE_ERR);

export const httpStatusToErrorType = withDefaultValue({
  400: errorTypes.BAD_REQUEST_ERR,
  401: errorTypes.UNAUTHORIZED_ERR,
  403: errorTypes.INTERNAL_SERVER_ERR, // TODO: Proper error for forbidden access
  404: errorTypes.ENV_NOT_FOUND_ERR,
  500: errorTypes.INTERNAL_SERVER_ERR,
  501: errorTypes.INTERNAL_SERVER_ERR,
  502: errorTypes.CONNECTION_BROKEN_ERR,
  503: errorTypes.CONNECTION_BROKEN_ERR,
  504: errorTypes.CONNECTION_BROKEN_ERR,
}, errorTypes.UNKNOWN_ERR);

export const errorMessages = {
  GENERIC_SERVER_ERR: 'This object cannot be imported.',
  ALL_DATA_FILTERED_OUT: 'No data returned for this view. This might be because the applied prompt excludes all data.',
  EMPTY_REPORT: 'You cannot import an empty object.',
  NO_DATA_RETURNED: 'This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty.',
  NOT_SUPPORTED_SERVER_ERR: 'This object cannot be imported. Objects with cross tabs, totals, or subtotals are not supported in this version of MicroStrategy for Office.',
  NOT_SUPPORTED_PROMPTS_REFRESH: 'Objects with prompts cannot be refreshed in this version of MicroStrategy for Office.',
  NOT_PUBLISHED_CUBE: 'You cannot import an unpublished cube.',
  NO_DATA_SELECTED: 'This button is currently disabled because you didn’t select any data',
  NOT_IN_METADATA: 'The object no longer exists, it has been removed from the data source.',
  PROJECT_ROW_LIMIT: 'This object exceeds the MicroStrategy project row limit. Please contact your administrator.',
  TABLE_OVERLAP: 'This operation requires the use of additional empty rows or columns.',
  ERROR_POPUP_CLOSED: 'Function close call failed, error code:',
  NOT_SUPPORTED_CUSTOM_GROUP: 'This object cannot be imported. Objects with custom groups are not supported in this version of MicroStrategy for Office.',
  TABLE_REMOVED: 'It looks like the object was deleted from the workbook. Delete it in the sidebar or click Add Data to import it again.',
  ENDPOINT_NOT_REACHED: 'The endpoint cannot be reached',
  EXCEEDS_WORKSHEET_LIMITS: 'The table you try to import exceeds the worksheet limits.',
  EXCEEDS_EXCEL_API_LIMITS: 'Import failed because the payload size limit for any Excel Online request or response is 5MB. Try to limit your data.',
  OUTSIDE_OF_OFFICE: 'Please run plugin inside Office',
  CONNECTION_BROKEN: 'Environment is unreachable. Please check your internet connection.',
  WRONG_CREDENTIALS: 'Wrong username or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in.',
  PROBLEM_WITH_REQUEST: 'There has been a problem with your request',
  UNKNOWN_ERROR: 'An error has occurred',
  LOGIN_FAILURE: 'Login failure',
  OBJ_REMOVED_FROM_EXCEL: 'This object does not exist in the workbook anymore.',
  SHEET_HIDDEN: 'To view the data, please unhide the worksheet.',
  PROTECTED_SHEET: 'The table you are trying to manipulate is in a protected sheet. To make a change, unprotect the sheet. You might be requested to enter a password.',
  NOT_SUPPORTED_VIZ: 'Selected visualization cannot be imported in current version of the Add-in',
  INVALID_VIZ_KEY_MESSAGE: 'You are trying to perform an operation on a visualization that is either not supported or deleted from the dossier.',
  SESSION_EXTENSION_FAILURE_MESSAGE: 'The user\'s session has expired, please reauthenticate',
  DOSSIER_HAS_CHANGED: 'The object cannot be refreshed because the dossier has changed. You can edit the object or remove it.',
  NOT_AVAILABLE_FOR_DOSSIER: 'This option is not available for dossier',
  CHECKING_SELECTION: 'Checking selection...',
  MISSING_ELEMENT_OBJECT_MESSAGE: 'This action cannot be performed. It appears that part of the data has been removed from the data source. Please click Edit to see the changes.',
  WRONG_RANGE: 'Please select only one range before import.'
};

// temporarily we map all those codes to one message; may be changed in the future
const iServerErrorMessages = withDefaultValue({
  '-2147171501': errorMessages.NOT_SUPPORTED_SERVER_ERR,
  '-2147171502': errorMessages.NOT_SUPPORTED_CUSTOM_GROUP,
  '-2147171503': errorMessages.NOT_SUPPORTED_SERVER_ERR,
  '-2147171504': errorMessages.NOT_SUPPORTED_SERVER_ERR,
  '-2147072488': errorMessages.NOT_PUBLISHED_CUBE,
  '-2147466604': errorMessages.NOT_PUBLISHED_CUBE,
  '-2147205488': errorMessages.PROJECT_ROW_LIMIT,
  '-2147216373': errorMessages.NOT_IN_METADATA,
  '-2147216959': errorMessages.LOGIN_FAILURE,
  '-2147207419': errorMessages.CONNECTION_BROKEN,
  '-2147213784': errorMessages.NO_DATA_RETURNED,
  '-2147213377': errorMessages.DOSSIER_HAS_CHANGED,
}, errorMessages.GENERIC_SERVER_ERR);

export const errorMessageFactory = withDefaultValue({
  [errorTypes.ENV_NOT_FOUND_ERR]: ({ error }) => handleEnvNotFoundError(error),
  [errorTypes.CONNECTION_BROKEN_ERR]: () => errorMessages.CONNECTION_BROKEN,
  [errorTypes.UNAUTHORIZED_ERR]: ({ error }) => handleUnauthorizedError(error),
  [errorTypes.BAD_REQUEST_ERR]: ({ error }) => handleBadRequestError(error),
  [errorTypes.INTERNAL_SERVER_ERR]: ({ error }) => iServerErrorMessages((error.response && error.response.body && error.response.body.iServerCode) || '-1'),
  [errorTypes.PROMPTED_REPORT_ERR]: () => errorMessages.NOT_SUPPORTED_PROMPTS_REFRESH,
  [errorTypes.OUTSIDE_OF_RANGE_ERR]: () => errorMessages.EXCEEDS_WORKSHEET_LIMITS,
  [errorTypes.OVERLAPPING_TABLES_ERR]: () => errorMessages.TABLE_OVERLAP,
  [errorTypes.RUN_OUTSIDE_OFFICE_ERR]: () => errorMessages.OUTSIDE_OF_OFFICE,
  [errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR]: () => errorMessages.OBJ_REMOVED_FROM_EXCEL,
  [errorTypes.SHEET_HIDDEN_ERR]: ({ error }) => handleWrongRange(error),
  [errorTypes.GENERIC_OFFICE_ERR]: ({ error }) => `${customT('An error has occurred in Excel.')} ${error.message}`,
  [errorTypes.PROTECTED_SHEET_ERR]: () => errorMessages.PROTECTED_SHEET,
  [errorTypes.INVALID_VIZ_KEY]: () => errorMessages.INVALID_VIZ_KEY_MESSAGE,
  [errorTypes.EXCEEDS_EXCEL_API_LIMITS]: () => errorMessages.EXCEEDS_EXCEL_API_LIMITS,
},
({ error }) => error.message || errorMessages.UNKNOWN_ERROR);

export const httpStatusCodes = {
  UNAUTHORIZED_ERROR: 401,
  FORBIDDEN_ERROR: 403,
};

export const errorCodes = {
  ERR003: 'ERR003',
  ERR006: 'ERR006',
  ERR009: 'ERR009',
};

export const handleBadRequestError = (error) => {
  const { ERR006 } = errorCodes;
  if (error.response
    && error.response.body
    && error.response.body.code === ERR006
    && error.response.body.message.includes('Failed to find the')
    && error.response.body.message.includes('in the report or cube.')
  ) {
    return errorMessages.MISSING_ELEMENT_OBJECT_MESSAGE;
  }
  return errorMessages.PROBLEM_WITH_REQUEST;
};

export const handleUnauthorizedError = (error) => {
  const { ERR003 } = errorCodes;
  if (
    (error.response.body && error.response.body.code === ERR003)
    && (error.response.body.iServerCode)
    && (iServerErrorMessages(error.response.body.iServerCode) === errorMessages.LOGIN_FAILURE)
  ) {
    return errorMessages.WRONG_CREDENTIALS;
  }
  return errorMessages.SESSION_EXPIRED;
};

export const handleEnvNotFoundError = (error) => {
  if (
    error.response
    && error.response.body
    && (error.response.body.iServerCode === -2147216373)
  ) {
    if (error.mstrObjectType) {
      return `This ${error.mstrObjectType} was deleted.`;
    }
    return errorMessages.NOT_IN_METADATA;
  }
  return errorMessages.ENDPOINT_NOT_REACHED;
};

export const handleWrongRange = (error) => {
  if (!error.debugInfo) {
    return errorMessages.UNKNOWN_ERROR;
  }

  switch (error.debugInfo.errorLocation) {
    case errorLocation.SHEET_HIDDEN:
      return errorMessages.SHEET_HIDDEN;
    case errorLocation.MULTIPLE_RANGE_SELECTED:
      return errorMessages.WRONG_RANGE;
    default:
      return errorMessages.UNKNOWN_ERROR;
  }
};
