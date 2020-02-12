import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';
import { switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
// /test/constants/selectors/popup-selectors.js

describe('F24751 Import report with or without subtotals', () => {
  it('[TC53340] - Set subtotals toggle ON during import report with subtotals', () => {
    // step0 - open plugin
    browser.setWindowSize(1500, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
    // step1 - press import data button
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    // step2 + step3 + step4 - turn my library toggle off, select a report with subtotals press prepare data
    PluginPopup.openPrepareData('Report Totals Subtotals 1', false);
    // step5 - select all metrics and all attributes
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    // TODO: expect subtotals toggle to be visible and set to true
    expect($(popupSelectors.subtotalToggler).getAttribute('aria-checked')).toEqual('true');
    // step6 - click import
    PluginPopup.clickImport();
    // step7 - data imported correctly
    // Assert that import is successfully imported and cell D18 contains "1/1/2013"
    waitForNotification();
    // expect succesfull notification
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // expect total to be bolded and contain correct data
    switchToExcelFrame();
    const B13 = $('#gridRows > div:nth-child(13) > div:nth-child(2) > div > div');
    expect(B13.getText()).toEqual('Total');
    // TODO: expect(OfficeWorksheet.checkIfCellIsBolded('C13')).toEqual(true);
    const C13 = $('#gridRows > div:nth-child(13) > div:nth-child(3) > div > div');
    expect(C13.getText()).toEqual('$1,009,131');
  });
});
