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

describe('TC48976 - perform-basic-functionalities', () => {
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

    switchToRightPanelFrame();
    $(rightPanelSelectors.importDataBtn).waitForDisplayed(3000, false);
    PluginRightPanel.clickImportDataButton();

    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(objectsList.reports.filtered);
    PluginPopup.searchForObject('Invalid report');
    browser.pause(500);
    $(popupSelectors.searchInput).clearValue();

    // Import report and select elements (attributes & metrics & filters)
    PluginPopup.searchForObject(objectsList.reports.report1k);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Sales Channel', ['Online']]]);
    browser.pause(500);
    PluginPopup.searchForElements('Item Type');
    PluginPopup.searchForElements('Invalid metric');
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
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
    PluginPopup.selectFirstObject();
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

    // Assertion after "Region" filter addition
    switchToExcelFrame();
    OfficeWorksheet.selectCell('P3');
    expect($(P3).getText()).toEqual('868214595');
    browser.pause(1000);

    switchToRightPanelFrame();
    waitAndClick($(firstObject));
    $(rightPanelSelectors.importedObjectNameList).doubleClick();
    $(rightPanelSelectors.importedObjectNameList).moveTo();
    browser.pause(1000);
    firstRefreshIcon.waitForDisplayed(3000, false);
    firstRefreshIcon.moveTo();
    waitAndClick(firstRefreshIcon);
    browser.pause(5000);
    waitAndClick($(firstObject));

    // Edit dataset
    ($(rightPanelSelectors.editBtn)).waitForDisplayed(5000, false);
    PluginRightPanel.edit();
    browser.pause(1000);

    switchToPluginFrame();
    browser.pause(1000);
    PluginPopup.selectObjectElements(['Country', 'Item Type', 'Sales Channel', 'Ship Date', 'Units Sold']);
    PluginPopup.selectFilters([['Country', ['Angola', 'Albania', 'Bangladesh']]]);
    PluginPopup.clickImport();
    waitForNotification();

    // Remove object from object list
    $(removeIcon).moveTo();
    waitAndClick($(removeIcon));
    browser.pause(2000);

    // Logout
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(2000);
  });
});
