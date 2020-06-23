import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep, logFirstStep } from '../../../helpers/utils/allure-helper';
import { switchToDialogFrame, switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { excelSelectors } from '../../../constants/selectors/office-selectors';

describe('US262640: E2E Test Case Automation for AQDT Environment', () => {
  it('[TC65620] - AQDT E2E - Import vis, import dataset, preserve formatting, secure data', () => {
    const { tecQa } = objectsList.aqdtMirror2Objects;
    const vis1 = tecQa.visualizations.automationByUnitVis1;
    const vis2 = tecQa.visualizations.useCaseDetail;
    const page = popupSelectors.dossierWindow.getPageAt(18);
    const { reportFormatting } = objectsList.aqdtMirror2Objects;

    logFirstStep('+ should import a visualisation from TEC.QA dossier owned by Andrew Smith');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    switchToDialogFrame();
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');

    PluginPopup.importAnyObject(tecQa.name);
    PluginPopup.selectVisualization(vis1);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ should edit the imported visualisation and import a different one');
    PluginRightPanel.editObject(1);
    switchToDialogFrame();
    browser.pause(4000);
    PluginPopup.goToDossierPageOrChapter(23);
    switchToDialogFrame();
    PluginPopup.selectVisualizationOnPage(page, vis2);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    // TODO: after GA add the object with MSTR applied formatting
    // logStep('+ should import a report with MSTR formatting');
    // switchToExcelFrame();
    // OfficeWorksheet.selectCell('M1');
    // PluginRightPanel.clickAddDataButton();
    // switchToDialogFrame();
    // PluginPopup.clickFilterButton();
    // PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');
    // PluginPopup.importAnyObject(reportFormatting);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // PluginRightPanel.closeNotificationOnHover();

    // PluginRightPanel.clickObjectInRightPanel(1);
    // browser.pause(4000);
    // OfficeWorksheet.formatTable();
    // browser.pause(4000);

    logStep('+ should clear data');
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();

    logStep('+ should click View Data');
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    browser.pause(1000);
    const a1 = excelSelectors.getCell(1, 1);
    const a1Value = $(a1).getText();
    browser.waitUntil(() => a1Value === 'ITEM', { timeout: 20000 });

    logStep('+ should logout');
    switchToPluginFrame();
    PluginRightPanel.logout();
  });
});
