import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../../helpers/utils/benchmark-helper';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as s } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';

describe('Filtering object list with "All" panel', () => {
  beforeEach(() => {
    browser.setWindowSize(1900, 1200);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
    browser.pause(1000);
    PluginRightPanel.clickImportDataButton();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('My Library is the default view.', () => {
    browser.pause(1000);
    switchToPluginFrame();
    const myLibrarySwitch = $(s.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    const checked = myLibrarySwitch.getAttribute('aria-checked');
    expect(checked).toEqual('true');
  });

  it.skip('Import object (1st time)', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Application', 'MicroStrategy Tutorial');
    PluginPopup.clickFilterButton();
    PluginPopup.searchForObject(o.reports.detailsReport);
    browser.pause(1000);
    const idsArray = PluginPopup.copyObjectsID();
    expect(idsArray[0]).not.toEqual(idsArray[1]);
    PluginPopup.pasteToSearchBox();
    expect(PluginPopup.compareClipboardToRow(idsArray[1])).toBe(true);
    waitForNotification();

    browser.pause(5000);
  });
});
