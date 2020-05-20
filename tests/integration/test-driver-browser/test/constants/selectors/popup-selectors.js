// import {$$} from 'protractor';

export const popupSelectors = {
  // TODO group selectors based on location
  tableOfObjects: '#WACDialogPanel',
  searchInput: '.search-field__input',
  prepareSearchInput: '#search-toolbar > div > span > input',
  valueInput: '#id_mstr20_txt',
  searchInputPrepareDataPopup: '.ant-input.ant-input-sm',
  attrQualificationInput: '#id_mstr38_txt',
  calendarInput: '#id_mstr24_txt',
  importBtn: '#import',
  prepareBtn: '#prepare',
  cancelBtn: '#cancel',
  runBtn: '#run',
  runBtnForPromptedDossier: '#id_mstr2 > tbody > tr:nth-child(3) > td > div > label.mstrPromptEditorButtonRun',
  buttonLoading: 'button.loading',
  emptySearchResults: 'p=None of the objects matched your search.',
  firstObject: '#popup-wrapper > div > div.object-table > div.object-table-container > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div > div',
  secondObject: '#popup-wrapper > div > div.object-table > div.object-table-container > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(2) > div',
  firstObjectWithoutSearch: '#popup-wrapper > div > div.object-table > div.object-table-container > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1) > div',
  anyObject: (index) => `div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(${index}) > div`,
  selectorTitle: (index) => `div:nth-child(${index}) > div > div.selector-title`,
  attributeSelector: (index) => `#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > div.checkbox-list.all-showed > div > div > div > ul > li:nth-child(${index}) > span.ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-close > span.ant-tree-title > span`,
  filterCheckbox: (category, item) => `.category-list-header[aria-label="${category}"] + .category-list-table > .category-list-row > .checkbox-cell > label > input[aria-label="Checkbox for ${item}."] + span`,
  filterCheckboxState: (category, item) => `.category-list-header[aria-label="${category}"] + .category-list-table > .category-list-row > .checkbox-cell > label > input[aria-label="Checkbox for ${item}."]`,
  promptPanel: (index) => `#id_mstr71 > table > tbody > tr:nth-child(${index}) > td.mstrPromptTOCListItemTitle`,
  selectorFilter: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12 > div > div:nth-child(1) > div.selector-title',
  backBtn: '#back',
  dataPreviewBtn: '#data-preview',
  promptRemoveAllSelected: '.mstrListCartCellAddRemoveButtons div:last-child .mstrToolButtonRounded',
  viewSelected: '#view-selected-switch',
  subtotalToggler: '.subtotal-container > #view-selected-switch',
  subtotalTogglerOn: '.ant-switch-checked',
  closePreviewBtn: '#close-preview-section > button',
  expressionInList: '.mstrExprBase > .mstrExprEditorFunc > a:nth-child(2)',
  nameHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(3) > div'),
  ownerHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(5) > div'),
  applicationHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(6) > div'),
  modifiedHeader: $('#popup > div > div.ant-col-sm-18.ant-col-lg-19 > div.ant-table-wrapper.table-container.object-browser > div > div > div > div > div > div.ant-table-header > table > thead > tr > th:nth-child(7) > div'),
  attributeCheckBox: '.item-title',
  firstClosedAttributeFormSwitcher: 'div:nth-child(1) > div > div.checkbox-list.all-showed > div > div > div.attribute-forms > ul > li.ant-tree-treenode-switcher-close.ant-tree-treenode-checkbox-checked > span.ant-tree-switcher',
  attributesContainer: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > div.checkbox-list.all-showed > div > div > div > ul',
  metricsContainer: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.metrics-col > div > div.checkbox-list.all-showed > div > div > div:nth-child(2) > div > div',
  filtersContainer: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12.filters-col > div > div:nth-child(1) > div.filter-list.ant-list > div > div > ul',
  sortAttributes: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > div.selector-title > div',
  sortMetrics: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.metrics-col > div > div.selector-title > div',
  sortFilters: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12.filters-col > div > div:nth-child(1) > div.selector-title.filter-selector-title > div',
  allAttributes: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > div.checkbox-list.all-showed > div > div > label.mstr-office-checkbox-all',
  allMetrics: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.metrics-col > div > div.checkbox-list.all-showed > div > div > label.mstr-office-checkbox-all',
  allFilters: '#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12.filters-col > div > div:nth-child(2) > div > div.checkbox-list.all-showed > div > div > label > span.all-element',
  filter: $('#popup > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col-12 > div > div:nth-child(1) > div.filter-list.ant-list > div > div > ul > li:nth-child(1)'),
  attributeFormDropdown: '.ant-select-selection--single',
  attributeFormDropDownItem: '.ant-select-dropdown-menu-item',
  filterInstance: $('#root > div > div.object-table > div > div:nth-child(1) > div > div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1)'),
  displayedObjects: '.ant-table-column-has-actions.ant-table-column-has-sorters>div',
  columnHeaders: '.ant-table .ant-table-thead th.ant-table-column-has-sorters',
  columnTitles: $$('.ant-table-column-title'),
  sortedUp: '.ant-table-column-sorter-up.on',
  sortedDown: '.ant-table-column-sorter-up.on',
  noDataIcon: $('.ant-table-placeholder'),
  myLibrary: '#popup-wrapper > div.navigation_tree__main_wrapper > div.navigation_tree__title_bar > div.top-filter-panel > div.mstr-switch-container > div.mstr-switch[aria-label="My Library"]',
  closeRefreshAll: '.WACGlyph.WACDialogCloseAnchor',
  clearSearchInput: '.search-field__clear-button',
  columnOwner: '.ReactVirtualized__Table__row > div[aria-colindex="4"] > span',
  columnProject: 'div[aria-colindex="5"] > span',
  columnModified: 'div[aria-colindex="6"] > span',
  columnName: 'div[aria-colindex="3"] > span',
  tableRows: '.position-relative',
  detailsTable: '.details-table',
  typeDetail: '.details-table > table tr:nth-child(1) p',
  idDetail: '.details-table > table tr:nth-child(2) p',
  createdDetail: '.details-table > table tr:nth-child(3) p',
  locationDetail: 'tr:nth-of-type(4) .ellipsis-container',
  descriptionDetail: 'tr:nth-of-type(5) .ellipsis-container',
  idDetailTooltip: 'tr:nth-of-type(2) .tooltiptext',
  locationDetailTooltip: 'tr:nth-of-type(4) .tooltiptext',
  descriptionDetailTooltip: 'tr:nth-of-type(5) .tooltiptext',
  importButtonTooltip: 'body > div:nth-child(8) > div > div > div > div.ant-popover-inner > div > div',
  filterButton: '.filter-button',
  expandButtonOpen: '.details-indicator-opened',
  filterResults: '.FilterResult > strong',
  promptArrow: '.mstrBGIcon_tbAdd',
  promptTextBox: '#id_mstr38_txt',
  showTotalsButton: 'div=Show Totals',
  totalButton: 'span=Total',
  okButton: 'div=OK',
  expandButton: '.details-indicator',
  expandButtonTooltip: '.tooltiptext-with-arrow',
  sortAscendingButton: 'div=Sort Ascending',
  sortDescendingButton: 'div=Sort Descending',
  drillButton: 'div=Drill',
  categoryButton: 'div=Category',
  visualizationSelector: '.mstrmojo-VizBox-selector',
  refreshButton: '.refresh-button',
  exportSpinner: $('.mstrd-spinner-export'),
  filterCostInput: 'div.mstrd-MQInput.mstrd-SliderSummary-left-input > input',
  prepareData: { getAttributeAt: (index) => `#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div:nth-child(1) > div > div.checkbox-list.all-showed > div > div > div:nth-child(2) > div > div > div:nth-child(${index}) > label > span:nth-child(3)` },
  smartFolderTable:
  { availableObjectNumber: '#popup-wrapper> div > div.object-table > div.FilterResult', // Contains string and number, e.g. 1280 results
  },
  dossierWindow: {
    visualizationName: '.mstrd-NavBarTitle-item-active .mstrd-DossierTitle',
    filterCount: '.mstrd-FilterSummaryBar-filterCount',
    buttonToC: 'li.mstrd-NavItemWrapper.mstrd-ToCNavItemContainer.mstr-navbar-item > div > div',
    getTocItemAt: (index) => `div.mstrd-DropdownMenu-content > div > ul > li:nth-child(${index})`,
    buttonBookmarks: 'li.mstrd-NavItemWrapper.mstrd-BookmarkNavItem.mstr-navbar-item > div > div',
    getBookmarkItemAt: (index) => `div.mstrd-BookmarkDropdownMenuContainer-myBookmarks > ul > div:nth-child(${index})`,
    buttonRefreshDossier: 'div.mstr-nav-icon.icon-resetfile',
    buttonConfirmRefresh: '.mstrd-DeleteDossier-button',
    filterBtn: '.mstr-nav-icon.icon-filter',
    buttonFilters: 'li.mstrd-FilterNavItemContainer',
    filtersMenu: {
      getFilterAt: (index) => `div.mstrd-FilterPanel-content > ul > li:nth-child(${index})`,
      selectFilterValueAt: (index) => `div.mstrd-FilterItemsList > div > div > div > div:nth-child(${index})`,
      getSliderInput: (position) => (position === 'left' ? '.mstrd-SliderSummary-left-input' : '.mstrd-SliderSummary-right-input'),
      buttonApplyFilters: 'div.mstrd-FilterPanelFooterContainer-apply',
    },
    repromptDossier: 'div.mstr-nav-icon.icon-reprompt',
    getVisualisationTitleBar: (visID) => `${visID} > div.mstrmojo-UnitContainer-SplitterHost > div.mstrmojo-UnitContainer-ContentBox > div.mstrmojo-UnitContainer-titlebar`,
    getMoreItemMenu: (visID) => `${visID} > div.hover-menu-btn.visible`,
    showDataSelector: '.item.shwd.mstrmojo-ui-Menu-item',
    closeShowDataSelector: '.mstrmojo-Button-text',
    exportSelector: '.item.pop.export.mstrmojo-ui-Menu-item',
    exportToExcel: '.item.exportToExcel.mstrmojo-ui-Menu-item',
    exportToPDF: '.item.exportToPDF.mstrmojo-ui-Menu-item',
    confirmExportToPDF: '.mstrmojo-Button.mstrmojo-WebButton.hot',
    exportToData: '.item.exportToCSV.mstrmojo-ui-Menu-item',
  },
  promptedAll: {
    prompt1: '#id_mstr103 .mstrBGIcon_tbAdd',
    prompt2: '#id_mstr165 .mstrBGIcon_tbAddAll',
    prompt3: '#id_mstr260_txt',
    prompt4: '#id_mstr272_txt',
    prompt4a: '#id_mstr201_txt',
    prompt4b: '#id_mstr274_txt',
    prompt5: '#id_mstr280_txt',
    prompt6: '#id_mstr288_txt',
    prompt7: '#id_mstr317 .mstrBGIcon_tbAddAll',
    prompt8: '#id_mstr201 .mstrCalendarAndTimePickerCellTextBox',
    prompt9: '#id_mstr275ListContainer > div.mstrListBlockItem > div',
    prompt10: '#id_mstr239 > div.mstrExprEditorContents > div',
    prompt11: '#id_mstr321_txt',
    prompt12: '#id_mstr329_txt',
    prompt13: '.mstrBGIcon_tbAdd',
  },
  filterPanel: {
    expandButton: '.expand-btn',
    selectAllButton: '.all-panel__buttons button:first-of-type',
    allPanelCheckbox: '.all-panel__content input',
    getAllPanelCheckbox: (checkboxTitle) => `.all-panel__content input[aria-label="Checkbox for ${checkboxTitle}"] + .checkmark`,
    getAllPanelCheckboxState: (checkboxTitle) => `.all-panel__content input[aria-label="Checkbox for ${checkboxTitle}."]`,
    getAllPanelDisabledCheckbox: (checkboxTitle) => `.all-panel__content .category-list-row.disabled label[title="${checkboxTitle}"]`,
    disabledCheckboxAllPanel: '.all-panel__content .category-list-row.disabled .checkbox-cell',
    categoryListRowDisabled: '.category-list-row.disabled',
    dates: '.mstr-date-picker input',
    clearAll: '.filter-panel__button',
    viewSelected: '.all-panel .mstr-switch',
  },
  objectTable: { scrollContainer: '.ReactVirtualized__Grid.ReactVirtualized__Table__Grid', },
  metricsSort: '#sort-toggle-metrics > span',
  attributeSort: '#sort-toggle-attributes > span',
  filtersSort: '#sort-toggle-filters > span',
};
