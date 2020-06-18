import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import {
  switchToPluginFrame, switchToExcelFrame, changeBrowserTab, switchToPopupFrame, switchToDialogFrame, switchToPromptFrame
} from '../../../helpers/utils/iframe-helper';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('US262640: E2E Test Case Automation for AQDT Environment', () => {
  it(`[TC61046] E2E import and edit of Aqueduct Dossiers`, () => {
    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary();
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');
    PluginPopup.searchForObject(objectsList.dossiers.aqueductTECQA.name);
    switchToDialogFrame();
    PluginPopup.selectFirstObjectWithoutSearch();
    PluginPopup.clickImport();

    logStep('+ should import TEC.QA');
    browser.pause(5000);
    switchToPromptFrame();
    PluginPopup.goToDossierPageOrChapter(7);
    PluginPopup.selectAndImportVizualiation(objectsList.dossiers.aqueductTECQA.visualizations.automationProgress);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(6000);

    logStep('+ should edit imported TEC.QA visualization');
    PluginRightPanel.editObject(1);
    browser.pause(2000);
    PluginPopup.selectAndImportVizualiation(objectsList.dossiers.aqueductTECQA.visualizations.testSets);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ should import TEC.PD visualization');
    switchToExcelFrame();
    OfficeWorksheet.selectCell('I1');
    PluginRightPanel.clickAddDataButton();
    switchToDialogFrame();
    PluginPopup.searchForObject(objectsList.dossiers.aqueductTECPD.name);
    PluginPopup.selectFirstObjectWithoutSearch();
    PluginPopup.clickImport();
    browser.pause(5000);
    switchToPromptFrame();
    PluginPopup.goToDossierPageOrChapter(8);
    PluginPopup.selectAndImportVizualiation(objectsList.dossiers.aqueductTECPD.visualization);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ should clear data');
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();
    PluginRightPanel.viewDataBtn();

    logStep('+ should log out');
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
