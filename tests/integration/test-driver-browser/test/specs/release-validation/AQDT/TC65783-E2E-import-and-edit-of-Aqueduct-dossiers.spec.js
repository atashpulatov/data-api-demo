import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import {
  switchToPluginFrame, switchToExcelFrame, changeBrowserTab, switchToPopupFrame, switchToDialogFrame, switchToPromptFrame
} from '../../../helpers/utils/iframe-helper';
import { logStep } from '../../../helpers/utils/allure-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';


describe('US262640: E2E Test Case Automation for AQDT Environment', () => {
  it(`[TC61046] E2E import and edit of Aqueduct Dossiers`, () => {
    const { tecQa } = objectsList.aqdtMirror2Objects;
    const qaPage = popupSelectors.dossierWindow.getPageAt(5);
    const qaPage2 = popupSelectors.dossierWindow.getPageAt(12);
    const vis1 = tecQa.visualizations.automationByUnitVis1;
    const vis2 = tecQa.visualizations.useCaseDetail;
    const { tecPd } = objectsList.aqdtMirror2Objects;
    const pdPage = popupSelectors.dossierWindow.getPageAt(8);
    const vis3 = tecPd.visualizations.defectsByRelase;

    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary();
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');
    PluginPopup.searchForObject(tecQa.name);
    switchToDialogFrame();
    PluginPopup.selectFirstObjectWithoutSearch();
    PluginPopup.clickImport();

    logStep('+ should import TEC.QA');
    browser.pause(5000);
    switchToPromptFrame();
    PluginPopup.goToDossierPageOrChapter(7);
    PluginPopup.selectVisualizationOnPage(qaPage, vis1);
    switchToPluginFrame();
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    browser.pause(6000);

    logStep('+ should edit imported TEC.QA visualization');
    PluginRightPanel.editObject(1);
    browser.pause(2000);
    PluginPopup.goToDossierPageOrChapter(15);
    PluginPopup.selectVisualizationOnPage(qaPage2, vis2);
    switchToPluginFrame();
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep('+ should import TEC.PD visualization');
    switchToExcelFrame();
    OfficeWorksheet.selectCell('I1');
    PluginRightPanel.clickAddDataButton();
    switchToDialogFrame();
    PluginPopup.searchForObject(tecPd.name);
    PluginPopup.selectFirstObjectWithoutSearch();
    PluginPopup.clickImport();
    browser.pause(5000);
    switchToPromptFrame();
    PluginPopup.goToDossierPageOrChapter(9);
    PluginPopup.selectVisualizationOnPage(pdPage, vis3);
    switchToPluginFrame();
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);


    logStep('+ should clear data');
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();
    PluginRightPanel.viewDataBtn();
    waitForNotification();

    logStep('+ should log out');
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
