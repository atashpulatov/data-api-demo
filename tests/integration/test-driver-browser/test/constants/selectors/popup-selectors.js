// import {$$} from 'protractor';

export const popupSelectors = {
  // TODO group selectors based on location
  tableOfObjects: '#WACDialogPanel',
  searchInput: '.search-field__input',
  prepareSearchInput: '#search-toolbar > div > span > input',
  valueInput: '#id_mstr20_txt',
  attrQualificationInput: '#id_mstr38_txt',
  calendarInput: '#id_mstr24_txt',
  importBtn: '#import',
  prepareBtn: '#prepare',
  cancelBtn: '#cancel',
  runBtn: '#run',
  firstObject: '#root > div > div.object-table > div.object-table-container > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div > div',
  secondObject: $('#root > div > div.object-table > div.object-table-container > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(2)'),
  anyObject: (index) => `div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(${index}) > div`,
  selectorTitle: (index) => `div:nth-child(${index}) > div > div.selector-title`,
  attributeSelector: (index) => `  #root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div:nth-child(1) > div > div.checkbox-list.all-showed > div > div > div > ul > li:nth-child(${index}) > span.ant-tree-checkbox > span`,
  selectorFilter: '#root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12 > div > div:nth-child(1) > div.selector-title',
  backBtn: '#back',
  dataPreviewBtn: '#data-preview',
  promptRemoveAllSelected: '.mstrListCartCellAddRemoveButtons div:last-child .mstrToolButtonRounded',
  viewSelected: '#view-selected-switch',
  closePreviewBtn: '#close-preview-section > button',
  expressionInList: '.mstrExprBase > .mstrExprEditorFunc > a:nth-child(2)',
  nameHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(3) > div'),
  ownerHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(5) > div'),
  applicationHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(6) > div'),
  modifiedHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(7) > div'),
  allAttributes: '#root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div:nth-child(1) > div > div.checkbox-list.all-showed > div > div > label > input[type=checkbox]',
  allMetrics: '#root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div:nth-child(2) > div > div.checkbox-list.all-showed > div > div > label > input[type=checkbox]',
  allFilters: '#root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12 > div > div:nth-child(2) > div > div.checkbox-list.all-showed > div > div > label > input[type=checkbox]',
  filter: $('#popup > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col-12 > div > div:nth-child(1) > div.filter-list.ant-list > div > div > ul > li:nth-child(1)'),
  filterInstance: $('#root > div > div.object-table > div > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1)'),
  displayedObjects: '.ant-table-column-has-actions.ant-table-column-has-sorters>div',
  columnHeaders: '.ant-table .ant-table-thead th.ant-table-column-has-sorters',
  columnTitles: $$('.ant-table-column-title'),
  sortedUp: '.ant-table-column-sorter-up.on',
  sortedDown: '.ant-table-column-sorter-up.on',
  noDataIcon: $('.ant-table-placeholder'),
  myLibrary: '#root > div > div.navigation_tree__title_bar > div > div.mstr-switch-container > div.mstr-switch',
  closeRefreshAll: '#WACDialogTitlePanel > a',
  // promptArrow: element(by.className('mstrBGIcon_tbAdd')),
  promptArrow: '.mstrBGIcon_tbAdd',
  promptTextBox: '#id_mstr38_txt',
  showTotalsButton:'div=Show Totals',
  totalButton:'span=Total',
  okButton:'div=OK',
  sortAscendingButton:'div=Sort Ascending',
  sortDescendingButton:'div=Sort Descending',
  drillButton:'div=Drill',
  categoryButton:'div=Category',
  visualizationSelector:'.mstrmojo-VizBox-selector',
  dossierWindow:{
    visualizationName: '.mstrd-NavBarTitle-item-active .mstrd-DossierTitle',
    filterCount: '.mstrd-FilterSummaryBar-filterCount',
    buttonToC: 'li.mstrd-NavItemWrapper.mstrd-ToCNavItemContainer.mstr-navbar-item > div > div',
    getTocItemAt: (index) => `div.mstrd-DropdownMenu-content > div > ul > li:nth-child(${index})`,
    buttonBookmarks: 'li.mstrd-NavItemWrapper.mstrd-BookmarkNavItem.mstr-navbar-item > div > div',
    getBookmarkItemAt: (index) => `div.mstrd-BookmarkDropdownMenuContainer-myBookmarks > ul > div:nth-child(${index})`,
    buttonRefreshDossier: 'div.mstr-nav-icon.icon-resetfile',
    buttonConfirmRefresh: '.mstrd-DeleteDossier-button',
    buttonFilters: 'li.mstrd-FilterNavItemContainer',
    filtersMenu:{
      getFilterAt: (index) => `div.mstrd-FilterPanel-content > ul > li:nth-child(${index})`,
      selectFilterValueAt: (index) => `div.mstrd-FilterItemsList > div > div > div > div:nth-child(${index})`,
      getSliderInput: (position) => (position === 'left' ? '.mstrd-SliderSummary-left-input' : '.mstrd-SliderSummary-right-input'),
      buttonApplyFilters : 'div.mstrd-FilterPanelFooterContainer-apply',
    }
  }
};
