const withDefaultValue = (obj, defaultValue) => new Proxy(obj, {
  get: (target, name) => (target[name] === undefined ? defaultValue : target[name]),
});

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

// temporarily we map all those codes to one message; may be changed in the future
export const errorMessages = withDefaultValue({
  '-2147171501': NOT_SUPPORTED_SERVER_ERR,
  '-2147171502': NOT_SUPPORTED_CUSTOM_GROUP,
  '-2147171503': NOT_SUPPORTED_SERVER_ERR,
  '-2147171504': NOT_SUPPORTED_SERVER_ERR,
  '-2147072488': NOT_PUBLISHED_CUBE,
  '-2147205488': PROJECT_ROW_LIMIT,
  '-2147216373': NOT_IN_METADATA,
}, GENERIC_SERVER_ERR);

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
};

export const errorMessageFactory = withDefaultValue({
  [errorTypes.ENV_NOT_FOUND_ERR]: () => 'The endpoint cannot be reached',
  [errorTypes.CONNECTION_BROKEN_ERR]: () => 'Environment is unreachable. Please check your internet connection.',
  [errorTypes.UNAUTHORIZED_ERR]: (error) => {
    if (error.response.body.code === 'ERR003') return 'Wrong username or password.';
    return 'Your session has expired. Please log in.';
  },
  [errorTypes.BAD_REQUEST_ERR]: () => 'There has been a problem with your request',
  [errorTypes.INTERNAL_SERVER_ERR]: (error) => errorMessages[!error.response ? '-1' : error.response.body ? error.response.body.iServerCode : '-1'],
  [errorTypes.PROMPTED_REPORT_ERR]: () => NOT_SUPPORTED_PROMPTS_REFRESH,
  [errorTypes.OUTSIDE_OF_RANGE_ERR]: () => 'The table you try to import exceeds the worksheet limits.',
  [errorTypes.OVERLAPPING_TABLES_ERR]: () => TABLE_OVERLAP,
  [errorTypes.RUN_OUTSIDE_OFFICE_ERR]: () => 'Please run plugin inside Office',
  [errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR]: () => TABLE_REMOVED,
  [errorTypes.GENERIC_OFFICE_ERR]: (error) => `Excel returned error: ${error.message}`,
},
(error) => error.message || 'Unknown error');
