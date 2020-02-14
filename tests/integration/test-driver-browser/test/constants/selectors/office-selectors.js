export const excelSelectors = {
  getCell: (column, row) => `#gridRows > div:nth-child(${row}) > div:nth-child(${column})`,
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
  excelFormulaBar: '#formulaBarTextDivId'

}
