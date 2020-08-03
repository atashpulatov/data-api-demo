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
import officeWorksheet from '../../../helpers/office/office.worksheet';
import {logStep} from '../../../helpers/utils/allure-helper';



describe('F21526 - Secure data - clearing data', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC54263] - Clearing and viewing data for users with different privileges', () => {
   logStep(`should import 'Revenue by Region and Category - secure data' report`);
    PluginPopup.importObjectToCellAndAssertSuccess('A1', objectsList.reports.secureDataFiltering, 'Report for clearing data should be imported', false);

    logStep(`should import 'Secure data - always working' report`);
    switchToExcelFrame();
    PluginPopup.importObjectToCellAndAssertSuccess('E1', objectsList.reports.secureDataAlwaysWorking, 'Report which will alway display all the data should be imported', true);

    logStep(`should clear data`);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    browser.pause(4000);

    logStep('should log out');
    switchToPluginFrame();
    PluginRightPanel.logout();

    logStep('should log in with Tim user');
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn('Tim', '');
    changeBrowserTab(1);

    logStep('should assert A2 and E2 cells are empty');
    switchToExcelFrame();
    officeWorksheet.selectCell('A2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual('')
    officeWorksheet.selectCell('E2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual('')

    logStep(`should click "View Data"`);
    browser.pause(4000);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    const { reportRefreshed, emptyObject } = dictionary.en;
    switchToPluginFrame();
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);


    logStep(`should assert data was refreshed`);
    switchToExcelFrame();
    officeWorksheet.selectCell('A2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual(`'Central`);
    officeWorksheet.selectCell('E2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual(`'Albania`);

    logStep(`should clear data`);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    browser.pause(2000);

    logStep('should assert A2 and E2 cells are empty');
    switchToExcelFrame();
    officeWorksheet.selectCell('A2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual('')
    officeWorksheet.selectCell('E2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual('')

    logStep('should log out');
    browser.pause(2000);
    switchToPluginFrame();
    PluginRightPanel.logout();

    logStep('should log in with Jeff user');
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn('Jeff', '');
    changeBrowserTab(1);

    logStep(`should click "View Data"`);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(reportRefreshed);

    logStep(`should assert data was refreshed`);
    switchToExcelFrame();
    officeWorksheet.selectCell('A2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual(`'Mid-Atlantic`)
    officeWorksheet.selectCell('E2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual(`'Albania`)
    browser.pause(2000);

    logStep(`should clear data`);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    browser.pause(2000);

    logStep('should assert A2 and E2 cells are empty');
    switchToExcelFrame();
    officeWorksheet.selectCell('A2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual('')
    officeWorksheet.selectCell('E2')
    expect($(excelSelectors.excelFormulaBar).getText()).toEqual('')

    logStep('should log out');
    switchToPluginFrame();
    PluginRightPanel.logout();

    // COMMENTED OUT AS THERE'RE PROBLEMS WITH THE USER MARTYNA; IT'LL BE TESTED AFTER SOLVING THE ISSUE
    // logStep('should log in with Martyna user');
    // browser.pause(1000);
    // switchToRightPanelFrame();
    // $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    // PluginRightPanel.clickLoginRightPanelBtn();
    // changeBrowserTab(2);
    // PluginRightPanel.enterCredentialsAndPressLoginBtn('Martyna', '');
    // changeBrowserTab(1);

    // logStep(`should click "View Data"`);
    // switchToPluginFrame();
    // PluginRightPanel.viewDataBtn();
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(emptyObject);
    // PluginRightPanel.waitAndCloseNotification(reportRefreshed);

    // logStep(`should assert data was refreshed`);
    // switchToExcelFrame();
    // officeWorksheet.selectCell('A2');
    // expect($(excelSelectors.excelFormulaBar).getText()).toEqual('');
    // officeWorksheet.selectCell('E2');
    // expect($(excelSelectors.excelFormulaBar).getText()).toEqual(`'Albania`);
  });
});
