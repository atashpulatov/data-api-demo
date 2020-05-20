import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import {
  switchToPluginFrame, switchToExcelFrame, switchToRightPanelFrame, changeBrowserTab, switchToDialogFrame
} from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeLogin from '../../../helpers/office/office.login';

describe('TS41441 - Sanity checks', () => {
  beforeAll(() => {
    const acceptBtn = '#accept-cookies-btn';

    // Invalid credentials
    officeLogin.openExcelAndLoginToPlugin('Invalid username', 'Invalid password', 1700, false);
    waitAndClick($('#ActionLinkContainer'));

    // Credentials without office privileges
    PluginRightPanel.enterCredentialsAndPressLoginBtn('b', '');
    changeBrowserTab(1);
    switchToRightPanelFrame();
    $(acceptBtn).waitForDisplayed(3000, false);
    waitAndClick($(acceptBtn));
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);

    // Valid credentials
    PluginRightPanel.enterCredentialsAndPressLoginBtn('a', '');
    changeBrowserTab(1);
  });


  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC48976] - perform-basic-functionalities', () => {
    const firstObject = '#overlay > div > section > div > div.tables-container > div:nth-child(1)';
    const firstRefreshIcon = $('#overlay > div > section > div > div.tables-container > div:nth-child(1) > div.refresh-icons-row > span.object-icons > span:nth-child(2) > span');
    const datasetFilter = 'label=Dataset';
    const removeIcon = '.mstr-icon.trash';
    const P3 = '#gridRows > div:nth-child(3) > div:nth-child(16) > div > div';
    OfficeWorksheet.selectCell('A1');
    switchToRightPanelFrame();
    $(rightPanelSelectors.importDataBtn).waitForDisplayed(3000, false);
    PluginRightPanel.clickImportDataButton();

    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(objectsList.reports.filtered);
    browser.pause(500);
    PluginPopup.searchForObject('Invalid report');
    browser.pause(500);
    $(popupSelectors.searchInput).clearValue();

    // Import report and select elements (attributes & metrics & filters)
    PluginPopup.searchForObject(objectsList.reports.report1k);
    PluginPopup.selectObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Sales Channel', ['Online']]]);
    browser.pause(500);
    PluginPopup.searchForElements('Item Type');
    PluginPopup.searchForElements('Invalid metric');

    PluginPopup.clearElementSearchWithBackspace();

    // sort for Attributes
    const attributeContainer = $(popupSelectors.attributesContainer);
    const sortAttributeSelector = $(popupSelectors.sortAttributes);
    // All attributes Ascending sort
    waitAndClick(sortAttributeSelector);
    browser.pause(2222);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Country');
    // All attributes Descending sort
    waitAndClick(sortAttributeSelector);
    browser.pause(2222);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Sales Channel');
    // Back to default sort
    waitAndClick(sortAttributeSelector);
    browser.pause(2222);

    // sort for Metrics
    const metricsContainer = $(popupSelectors.metricsContainer);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);
    // All metrics Ascending sort
    waitAndClick(sortMetricsSelector);
    browser.pause(2222);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Total Cost');
    // All metrics Descending sort
    waitAndClick(sortMetricsSelector);
    browser.pause(2222);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Total Profit');
    // Back to default sort
    waitAndClick(sortMetricsSelector);
    browser.pause(2222);

    // sort for Filters
    const filterContainer = $(popupSelectors.filtersContainer);
    const sortFiltersSelector = $(popupSelectors.sortFilters);
    // All filters Ascending sort
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Country');
    // All filters Descending sort
    waitAndClick(sortFiltersSelector);
    const filterTitlesList = $$(popupSelectors.filterTitles);
    expect(filterTitlesList[0].getAttribute('textContent')).toEqual(`Sales Channel`);
    // Back to default sort
    waitAndClick(sortFiltersSelector);

    PluginPopup.clickViewSelected();
    PluginPopup.clickDataPreview();
    ($(popupSelectors.closePreviewBtn)).waitForDisplayed(1000, false);
    PluginPopup.closePreview();
    browser.pause(1000);
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(1000);

    // Select empty cell
    OfficeWorksheet.selectCell('M1');
    browser.pause(1000);
    PluginRightPanel.clickAddDataButton();
    switchToDialogFrame();

    PluginPopup.switchLibrary(false);
    waitAndClick($('#Filter'));
    $(datasetFilter).waitForDisplayed(1000, false);
    waitAndClick($(datasetFilter));
    PluginPopup.searchForObject(objectsList.datasets.cubeLimitProject);
    PluginPopup.searchForObject('Invalid Object');
    $(popupSelectors.searchInput).clearValue();

    // Import dataset and select elements (attributes & metrics & filters)
    PluginPopup.searchForObject(objectsList.datasets.basicDataset);
    PluginPopup.selectObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Region', ['Europe', 'Asia']]]);
    browser.pause(1000);
    $(popupSelectors.searchInputPrepareDataPopup).waitForDisplayed(3000, false);
    PluginPopup.searchForElements('Total Revenue');
    PluginPopup.searchForElements('Invalid attribute');
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
    PluginPopup.clickViewSelected();
    PluginPopup.clickDataPreview();
    ($(popupSelectors.closePreviewBtn)).waitForDisplayed(1000, false);
    PluginPopup.closePreview();
    browser.pause(1000);
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();


    // Assertion after "Region" filter addition
    switchToExcelFrame();
    OfficeWorksheet.selectCell('P3');
    expect($(P3).getText()).toEqual('868214595');
    browser.pause(1000);

    // Rename the report
    switchToRightPanelFrame();
    PluginRightPanel.clickObjectInRightPanel(2);
    $(rightPanelSelectors.importedObjectNameList).doubleClick(); // TODO: The actual renaming is missing
    $(rightPanelSelectors.importedObjectNameList).moveTo();
    browser.pause(1000);

    // Refresh the report
    PluginRightPanel.refreshObject(2);
    waitForNotification();
    PluginRightPanel.clickObjectInRightPanel(1);


    // Edit dataset
    switchToRightPanelFrame();
    PluginRightPanel.editObject(1);
    browser.pause(1000);
    switchToPluginFrame();
    browser.pause(1000);
    PluginPopup.selectObjectElements(['Country', 'Item Type', 'Sales Channel', 'Ship Date', 'Units Sold']);
    PluginPopup.selectFilters([['Country', ['Angola', 'Albania', 'Bangladesh']]]);
    PluginPopup.clickImport();
    waitForNotification();

    // Remove object from object list
    PluginRightPanel.removeAllObjectsFromTheList();
    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();

    // Logout
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(2000);
  });
});
