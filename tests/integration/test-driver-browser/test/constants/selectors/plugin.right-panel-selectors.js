export const rightPanelSelectors = {
  usernameInput: '#username',
  passwordInput: '#password',
  loginPopUpBtn: '#loginButton',
  loginRightPanelBtn: '#login-btn',
  logoutBtn: '#logOut',
  clearDataBtn: '.no-trigger-close.clear-data.not-linked-list',
  settingsBtn: '.settings-button',
  addDataBtn: '#add-data-btn',
  LDAPbutton: '#LDAPModeLabel',
  refreshBtn: '#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(1) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(5)',
  refreshAllBtn: '#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(5)',
  refreshAllBtnTooltip: '#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(5) > div',
  checkBoxAll: '#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > div',
  deleteAllBtn: '#overlay > div > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(6)',
  deleteAllBtnTooltip: '#overlay > div > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(6) > div',
  repromptBtn: '.loading-button-container .mstr-icon.reprompt',
  deleteBtn: '.trash',
  importDataBtn: '#overlay > div.side-panel > div.import-data > button',
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
  importedObjectNameList: '.rename-input',
  editBtn: '.edit',
  placeholderContainer: '#overlay > div > section > div > div.tables-container',
  getObjectSelector: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div`,
  getIconBar: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span.icon-bar`,
  getObjectCheckbox: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > div`,
  getDuplicateBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(1)`,
  getDuplicateBtnForObjectTooltip: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div > div.object-tile-header > span.icon-bar-container > span > div:nth-child(2)`,
  getEdithBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div.react-contextmenu-wrapper > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(3)`,
  getEdithBtnForObjectTooltip: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span > div:nth-child(4)`,
  getRefreshBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div.react-contextmenu-wrapper > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(5)`,
  getRefreshBtnForObjectTooltip: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(5) > div`,
  getRemoveBtnForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(6)`,
  getRemoveBtnForObjectTooltip: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div.object-tile-header > span.icon-bar-container > span > button:nth-child(6) > div`,
  getNameInputForObject: (index) => `#overlay > div.side-panel > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div > div.object-tile-name-row > div.rename-input`,
  getNameInputTextForObject: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > div > div > div.object-tile-name-row > input`,
  getRightClickRemoveBtn: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div > nav > div:nth-child(4)`,
  notificationContainer: '.notification-container',
  progressBar: '.notification-container > div.notification-body > div.progress',
  getNotificationAt: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div.notification-container`,
  getProgressBarAt: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div.notification-container > div.notification-body > div.progress`,
  getPendingNotificationCancelBtnAt: (index) => `#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div.notification-container > div.notification-body > div.progress-bar-notification-button-container`,
  objectContainer: '.object-tile-content',
  objectHeaderContainer: '.object-tile-container-header',
  duplicatePopupActiveCellOption: '#overlay > div.side-panel > div.object-tile-container > div.overlay-container > div.duplicate-popup > div.duplicate-popup-body > div.duplicate-popup-body-options > label:nth-child(1)',
  duplicatePopupNewSheetOption: '#overlay > div.side-panel > div.object-tile-container > div.overlay-container > div.duplicate-popup > div.duplicate-popup-body > div.duplicate-popup-body-options > label:nth-child(2)',
  duplicatePopupImportBtn: '#overlay > div.side-panel > div.object-tile-container > div.overlay-container > div.duplicate-popup > div.duplicate-popup-footer > div > button:nth-child(1)',
  duplicatePopupEditBtn: '#overlay > div > div.object-tile-container > div.overlay-container > div > div.duplicate-popup-footer > div > button:nth-child(2)',
  importedData: '.imported-data',
};
