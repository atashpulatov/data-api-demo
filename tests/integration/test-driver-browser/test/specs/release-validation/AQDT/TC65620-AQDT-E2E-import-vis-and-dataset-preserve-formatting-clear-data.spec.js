import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep, logFirstStep } from '../../../helpers/utils/allure-helper';
import {
  switchToPromptFrameForImportDossier, switchToPromptFrame, switchToDialogFrame, switchToPluginFrame, switchToPopupFrame, switchToExcelFrame
} from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';


describe('US262640: E2E Test Case Automation for AQDT Environment', () => {
  it('[TC65620] - AQDT E2E - Import vis, import dataset, preserve formatting, secure data', () => {
    // logFirstStep('+ should import a visualisation from TEC.QA dossier owned by Andrew Smith');
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // switchToDialogFrame();
    // PluginPopup.clickFilterButton();
    // PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');

    const { tecQa } = objectsList.aqdtMirror2Objects;
    const vis1 = tecQa.visualizations.automationByUnitVis1;
    const vis2 = tecQa.visualizations.workDetailLedger;

    // PluginPopup.importAnyObject(tecQa.name);
    // PluginPopup.selectVisualization(vis1);
    // switchToPluginFrame();
    // PluginPopup.clickImport();
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // PluginRightPanel.closeNotificationOnHover();

    logStep('+ should edit the imported visualisation and import a different one');

    PluginRightPanel.editObject(1);
    switchToDialogFrame();
    browser.pause(4000);
    PluginPopup.goToDossierPageOrChapter(16);
    switchToExcelFrame();
    PluginPopup.selectVisualization(vis2);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    // logStep('+ should clear data');
    // switchToPluginFrame();
    // PluginRightPanel.clearData();

    // logStep('+ should logout');
    // PluginRightPanel.logout();
  });
});
