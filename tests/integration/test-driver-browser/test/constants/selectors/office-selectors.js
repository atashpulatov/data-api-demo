export const excelSelectors = {
  getExcelCell: (column, row) => `#gridRows > div:nth-child(${row}) > div:nth-child(${column})`,
  A2: $('#gridRows > div:nth-child(2) > div:nth-child(1)'),
  E2: $('#gridRows > div:nth-child(2) > div:nth-child(5)'),
  cellInput: '#m_excelWebRenderer_ewaCtl_NameBox',
  insertBtn: '#m_excelWebRenderer_ewaCtl_Ribbon\\2e Insert-title',
  addInBtn: '#m_excelWebRenderer_ewaCtl_Apps\\2e AppsForOffice-Large',
  officeAddInsFrame: '#InsertDialog',
  uploadAddInBtn: '#UploadMyAddin',
  manifestInput: '#BrowserFile',
  confirmUpload: '#DialogInstall',
  newSheetBtn: '#m_excelWebRenderer_ewaCtl_m_sheetTabBar > div.ewa-stb-navareaextra > a:nth-child(2)',
  mainMenuBtn: '#O365_MainLink_NavMenu',
  newDocumentBtn: '#NewDocumentsButton',
  excelWorkbookBtn: '#ExcelOnline',
  adminManagedBtn: '#Admin\\ Managed > a',
  adminManagedPlugin: 'div[aria-label^="yi_local_ip"]',
  addBtn: '#BtnAction',
  uploadPluginNotification: '.ModalCalloutControlOverlay',
  excelFormulaBar: '#formulaBarTextDivId',
  findAndSelectBtn : '#m_excelWebRenderer_ewaCtl_Editing\\2e FindAndReplace-Large',
  goToBtn : '#m_excelWebRenderer_ewaCtl_FindAndReplace\\2e Goto-Menu16',
  goToSelector: '#gotoRef',
  replaceSelector: '#m_excelWebRenderer_ewaCtl_FindAndReplace\\2e Replace-Menu16',
  findWhatSelector:'#findWhat',
  replaceWithSelector : '#replaceWith',
  replaceAllBtn: '#buttonarea > button:nth-child(4)',
  refreshAllfinished:'.refresh-header',
  nameBoxDropdownButton: '#m_excelWebRenderer_ewaCtl_NameBox-Medium > a',
  nameBoxListContent: '[id^=WacAirSpace] > div > div > div > ul',
}
