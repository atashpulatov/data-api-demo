import officeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import {
  switchToPluginFrame, switchToExcelFrame, changeBrowserTab, switchToRightPanelFrame
} from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';
import { excelSelectors } from '../../../constants/selectors/office-selectors';

describe('F21526 - Secure data - clearing data', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC54263] - Clearing and viewing data for users with different privileges', () => {
    console.log(`should import 'Revenue by Region and Category - secure data' report`);
    PluginPopup.importObjectToCellAndAssertSuccess('A1', objectsList.reports.secureDataFiltering, 'Report for clearing data should be imported', false);

    console.log(`should import 'Secure data - always working' report`);
    switchToExcelFrame();
    PluginPopup.importObjectToCellAndAssertSuccess('E1', objectsList.reports.secureDataAlwaysWorking, 'Report which will alway display all the data should be imported', true);

    console.log(`should clear data`);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    browser.pause(4000);

    console.log('should log out');
    switchToPluginFrame();
    PluginRightPanel.logout();

    console.log('should log in with Tim user');
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn('Tim', '');
    changeBrowserTab(1);

    console.log('should assert A2 and E2 cells are empty');
    switchToExcelFrame();
    expect($(excelSelectors.getCell(1, 2)).getText()).toEqual('');
    expect($(excelSelectors.getCell(5, 2)).getText()).toEqual('');

    console.log(`should click "View Data"`);
    browser.pause(4000);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    const { reportRefreshed, emptyObject } = dictionary.en;
    switchToPluginFrame();
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);


    console.log(`should assert data was refreshed`);
    switchToExcelFrame();
    expect($(excelSelectors.getCell(1, 2)).getText()).toEqual('Central');
    expect($(excelSelectors.getCell(5, 2)).getText()).toEqual('Albania');

    console.log(`should clear data`);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    browser.pause(2000);

    console.log('should assert A2 and E2 cells are empty');
    switchToExcelFrame();
    expect($(excelSelectors.getCell(1, 2)).getText()).toEqual('');
    expect($(excelSelectors.getCell(5, 2)).getText()).toEqual('');

    console.log('should log out');
    browser.pause(2000);
    switchToPluginFrame();
    PluginRightPanel.logout();

    console.log('should log in with Jeff user');
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn('Jeff', '');
    changeBrowserTab(1);

    console.log(`should click "View Data"`);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);

    console.log(`should assert data was refreshed`);
    switchToExcelFrame();
    expect($(excelSelectors.getCell(1, 2)).getText()).toEqual('Mid-Atlantic');
    expect($(excelSelectors.getCell(5, 2)).getText()).toEqual('Albania');
    browser.pause(2000);

    console.log(`should clear data`);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    browser.pause(2000);

    console.log('should assert A2 and E2 cells are empty');
    switchToExcelFrame();
    expect($(excelSelectors.getCell(1, 2)).getText()).toEqual('');
    expect($(excelSelectors.getCell(5, 2)).getText()).toEqual('');

    console.log('should log out');
    switchToPluginFrame();
    PluginRightPanel.logout();

    console.log('should log in with Martyna user');
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn('Martyna', '');
    changeBrowserTab(1);

    console.log(`should click "View Data"`);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    switchToPluginFrame();
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(emptyObject);

    console.log(`should assert data was refreshed`);
    switchToExcelFrame();
    expect($(excelSelectors.getCell(1, 2)).getText()).toEqual('');
    expect($(excelSelectors.getCell(5, 2)).getText()).toEqual('Albania');
  });
});
