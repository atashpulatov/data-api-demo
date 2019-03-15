const withDefaultValue = (obj, defaultValue) => {
  return new Proxy(obj, {
    get: (target, name) => target[name] === undefined ? defaultValue : target[name],
  });
};

export const GENERIC_SERVER_ERR = 'This object cannot be imported.';
export const NOT_SUPPORTED_NO_ATTRIBUTES = 'This object cannot be imported. Objects without attributes are not supported in this version of MicroStrategy for Office.';
export const NOT_SUPPORTED_SERVER_ERR = 'This object cannot be imported. Objects with prompts, cross tabs, totals, or subtotals are not supported in this version of MicroStrategy for Office.';
export const NOT_PUBLISHED_CUBE = 'This object cannot be imported. The Intelligent Cube is not published.';
export const NOT_IN_METADATA = 'The object does not exist in the metadata.';

// temporarily we map all those codes to one message; may be changed in the future
export const errorMessages = withDefaultValue({
  '-2147171501': NOT_SUPPORTED_SERVER_ERR,
  '-2147171502': NOT_SUPPORTED_SERVER_ERR,
  '-2147171503': NOT_SUPPORTED_SERVER_ERR,
  '-2147171504': NOT_SUPPORTED_SERVER_ERR,
  '-2147072488': NOT_PUBLISHED_CUBE,
  '-2147216373': NOT_IN_METADATA,
}, GENERIC_SERVER_ERR);

