export const PrivilegeIds = {
  OFFICE_PRIVILEGE_ID: '273',
  ATTRIBUTE_FORM_PRIVILEGE_ID: '81',
};

export enum OfficeSettingsEnum {
  reportArray = 'mstr-loaded-reports-array',
  officeAddress = 'address',
  storedObjects = 'storedObjects',
  storedAnswers = 'storedAnswers',
  loadedReportProperties = 'reportProperties',
  isSecured = 'isSecured',
  isClearDataFailed = 'isClearDataFailed',
}

export const displayAttrFormNamesOptions = [
  {
    value: 'AUTOMATIC',
    displayName: 'Automatic',
  },
  {
    value: 'SHOW_ATTR_NAME_ONCE',
    displayName: 'Show attribute name once',
  },
  {
    value: 'FORM_NAME_ONLY',
    displayName: 'Form name only',
  },
  {
    value: 'ON',
    displayName: 'On',
  },
  {
    value: 'OFF',
    displayName: 'Off',
  },
];
