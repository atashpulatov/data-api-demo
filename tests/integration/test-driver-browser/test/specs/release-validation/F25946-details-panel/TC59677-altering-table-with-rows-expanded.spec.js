import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';

describe('TC59677 - Altering Table of Objects with rows expanded', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Imports an object after checking details', () => {
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();

    PluginPopup.switchLibrary(false);
    PluginPopup.expandFirstAndLastRows(2);
    PluginPopup.clickRefreshButton();
    PluginPopup.waitForRefresh();
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);
    PluginPopup.scrollTable(['End']);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);

    PluginPopup.expandFirstAndLastRows(2);
    PluginPopup.searchForObject(objectsList.reports.detailsReport);
    browser.pause(1000);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);
    PluginPopup.scrollTable(['End']);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);

    PluginPopup.expandFirstAndLastRows(1);
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Application', 'MicroStrategy Tutorial');
    PluginPopup.clickFilterButton();
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);
    PluginPopup.scrollTable(['End']);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);

    PluginPopup.expandFirstAndLastRows(1);
    PluginPopup.clickHeader('Owner');
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);
    PluginPopup.scrollTable(['End']);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(0);
  });
});
