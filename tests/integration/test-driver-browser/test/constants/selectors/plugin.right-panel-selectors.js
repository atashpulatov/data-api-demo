export const rightPanelSelectors = {
  usernameInput: '#username',
  passwordInput: '#password',
  loginPopUpBtn: '#loginButton',
  loginRightPanelBtn: '#login-btn',
  logoutBtn: '#logOut',
  settingsBtn: '.settings-button',
  addDataBtn: '#add-data-btn',
  LDAPbutton: '#LDAPModeLabel',
  refreshBtn: '#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(1) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(5)',
  refreshAllBtn: '#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(5)',
  checkBoxAll: '#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > div',
  deleteAllBtn: '#overlay > div > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(6)',
  repromptBtn: '.loading-button-container .mstr-icon.reprompt',
  deleteBtn: '.trash',
  importDataBtn: '#overlay > div.side-panel > div.import-data > button', // #import-data-placeholder
  pluginImage: $('.mstr-office-addin-logo'),
  okButton: $('#ActionLinkContainer'),
  authErrorBox: $('.mstr-MessageBox'),
  authErrorMessage: $('#ariaErrorText'),
  initials: $('#initials'),
  username: $('#full-name'),
  notificationPopUp: '.notification-text',
  viewDataBtn: '#overlay > div > div.object-tile-container > div.overlay-container > div > button',
  clearOkBtn: '#confirm-btn',
  importedObjectList: '.file-history-container',
  importedObjectNameList: '.rename-container',
  editBtn: '.edit',
  placeholderContainer: '#overlay > div > section > div > div.tables-container',
  getObjectSelector: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div`,
  getIconBar: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div`,
  getEdithBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(3)`,
  getRefreshBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(5)`,
  getRemoveBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(6)`,
};
