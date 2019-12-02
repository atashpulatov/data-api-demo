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
  GENERIC_OFFICE_ERR: 'genericOffice',
  PROTECTED_SHEET_ERR: 'protectedSheet',
  CONNECTION_LOST_ERR:'connectionLost',
};

export const incomingErrorStrings = {
  EXCEL_NOT_DEFINED: 'Excel is not defined',
  TABLE_OVERLAP: 'A table can\'t overlap another table. ',
  BINDING_NOT_VALID: 'This object binding is no longer valid due to previous updates.',
  CONNECTION_BROKEN: 'Possible causes: the network is offline,',
};

export const stringMessageToErrorType = withDefaultValue({
  [incomingErrorStrings.EXCEL_NOT_DEFINED]: errorTypes.RUN_OUTSIDE_OFFICE_ERR,
  [incomingErrorStrings.TABLE_OVERLAP]: errorTypes.OVERLAPPING_TABLES_ERR,
  [incomingErrorStrings.BINDING_NOT_VALID]: errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR,
  [incomingErrorStrings.CONNECTION_BROKEN]: errorTypes.CONNECTION_BROKEN_ERR,
}, errorTypes.GENERIC_OFFICE_ERR);

export const httpStatusToErrorType = withDefaultValue({
  404: errorTypes.ENV_NOT_FOUND_ERR,
  400: errorTypes.BAD_REQUEST_ERR,
  401: errorTypes.UNAUTHORIZED_ERR,
  500: errorTypes.INTERNAL_SERVER_ERR,
}, null);

export const GENERIC_SERVER_ERR = 'This object cannot be imported.';
export const ALL_DATA_FILTERED_OUT = 'No data returned for this view. This might be because the applied prompt excludes all data.';
export const EMPTY_REPORT = 'This object does not contain any data.';
export const NOT_SUPPORTED_NO_ATTRIBUTES = 'This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty.';
export const NOT_SUPPORTED_SERVER_ERR = 'This object cannot be imported. Objects with cross tabs, totals, or subtotals are not supported in this version of MicroStrategy for Office.';
export const NOT_SUPPORTED_PROMPTS_REFRESH = 'Objects with prompts cannot be refreshed in this version of MicroStrategy for Office.';
export const NOT_PUBLISHED_CUBE = 'This object cannot be imported. The Intelligent Cube is not published.';
export const NOT_IN_METADATA = 'The object does not exist in the metadata.';
export const PROJECT_ROW_LIMIT = 'The object exceeds project rows limitation';
export const TABLE_OVERLAP = 'The required data range in the worksheet is not empty';
export const ERROR_POPUP_CLOSED = 'Function close call failed, error code:';
export const NOT_SUPPORTED_CUSTOM_GROUP = 'This object cannot be imported. Objects with custom groups are not supported in this version of MicroStrategy for Office.';
export const TABLE_REMOVED = 'It looks like the object was deleted from the workbook. Delete it in the sidebar or click Add Data to import it again.';
export const ENDPOINT_NOT_REACHED = 'The endpoint cannot be reached';
export const EXCEEDS_WORKSHEET_LIMITS = 'The table you try to import exceeds the worksheet limits.';
export const OUTSIDE_OF_OFFICE = 'Please run plugin inside Office';
export const CONNECTION_BROKEN = 'Environment is unreachable. Please check your internet connection.';
export const WRONG_CREDENTIALS = 'Wrong username or password.';
export const SESSION_EXPIRED = 'Your session has expired. Please log in.';
export const PROBLEM_WITH_REQUEST = 'There has been a problem with your request';
export const UNKNOWN_ERROR = 'Unknown error';
export const LOGIN_FAILURE = 'Login failure';
export const OBJ_REMOVED_FROM_EXCEL = 'This object does not exist in the workbook anymore.';
export const PROTECTED_SHEET = 'The table you are trying to manipulate is in a protected sheet. To make a change, unprotect the sheet. You might be requested to enter a password.';
export const CONNECTION_LOST = 'The Internet connection appears to be offline';

// temporarily we map all those codes to one message; may be changed in the future
const iServerErrorMessages = withDefaultValue({
  '-2147171501': NOT_SUPPORTED_SERVER_ERR,
  '-2147171502': NOT_SUPPORTED_CUSTOM_GROUP,
  '-2147171503': NOT_SUPPORTED_SERVER_ERR,
  '-2147171504': NOT_SUPPORTED_SERVER_ERR,
  '-2147072488': NOT_PUBLISHED_CUBE,
  '-2147205488': PROJECT_ROW_LIMIT,
  '-2147216373': NOT_IN_METADATA,
  '-2147216959': LOGIN_FAILURE,
}, GENERIC_SERVER_ERR);

export const errorMessageFactory = withDefaultValue({
  [errorTypes.ENV_NOT_FOUND_ERR]: ({ error }) => {
    if (
      error.response
      && error.response.body
      && (error.response.body.iServerCode === -2147216373)
    ) {
      return NOT_IN_METADATA;
    }
    return ENDPOINT_NOT_REACHED;
  },
  [errorTypes.CONNECTION_BROKEN_ERR]: () => CONNECTION_BROKEN,
  [errorTypes.UNAUTHORIZED_ERR]: ({ error }) => {
    if (
      (error.response.body && error.response.body.code === 'ERR003')
      && (error.response.body.iServerCode)
      && (iServerErrorMessages(error.response.body.iServerCode) === LOGIN_FAILURE)
    ) {
      return WRONG_CREDENTIALS;
    }
    return SESSION_EXPIRED;
  },
  [errorTypes.BAD_REQUEST_ERR]: () => PROBLEM_WITH_REQUEST,
  [errorTypes.INTERNAL_SERVER_ERR]: ({ error }) => iServerErrorMessages(!error.response ? '-1' : error.response.body ? error.response.body.iServerCode : '-1'),
  [errorTypes.PROMPTED_REPORT_ERR]: () => NOT_SUPPORTED_PROMPTS_REFRESH,
  [errorTypes.OUTSIDE_OF_RANGE_ERR]: () => EXCEEDS_WORKSHEET_LIMITS,
  [errorTypes.OVERLAPPING_TABLES_ERR]: () => TABLE_OVERLAP,
  [errorTypes.RUN_OUTSIDE_OFFICE_ERR]: () => OUTSIDE_OF_OFFICE,
  [errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR]: ({ reportName }) => `${reportName} does not exist in the workbook anymore.`,
  [errorTypes.GENERIC_OFFICE_ERR]: ({ error }) => `Excel returned error: ${error.message}`,
  [errorTypes.PROTECTED_SHEET_ERR]: () => PROTECTED_SHEET,
  [errorTypes.CONNECTION_LOST_ERR]: () => CONNECTION_LOST,
},
({ error }) => error.message || UNKNOWN_ERROR);
