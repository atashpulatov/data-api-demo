const withDefaultValue = (obj, defaultValue) => {
  return new Proxy(obj, {
    get: (target, name) => target[name] === undefined ? defaultValue : target[name],
  });
};

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

// temporarily we map all those codes to one message; may be changed in the future
export const errorMessages = withDefaultValue({
  '-2147171501': NOT_SUPPORTED_SERVER_ERR,
  '-2147171502': NOT_SUPPORTED_SERVER_ERR,
  '-2147171503': NOT_SUPPORTED_SERVER_ERR,
  '-2147171504': NOT_SUPPORTED_SERVER_ERR,
  '-2147072488': NOT_PUBLISHED_CUBE,
  '-2147205488': PROJECT_ROW_LIMIT,
  '-2147216373': NOT_IN_METADATA,
}, GENERIC_SERVER_ERR);

