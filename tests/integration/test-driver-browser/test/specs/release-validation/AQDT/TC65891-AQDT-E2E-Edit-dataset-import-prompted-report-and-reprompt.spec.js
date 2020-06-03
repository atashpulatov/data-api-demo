import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep, logFirstStep } from '../../../helpers/utils/allure-helper';
import { switchToPromptFrame, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

describe('US262640: E2E Test Case Automation for AQDT Environment', () => {
  it('[TC65891] - AQDT E2E - Edit a dataset, import prompted report and re-prompt', () => {
    logFirstStep('+ should import QA Cube by Sundarababu, Arun');
    const { aqdtMirrorTwoQACube } = objectsList.datasets;
    const { defectAnalysisPrompted } = objectsList.reports;
    const { importSuccess } = dictionary.en;
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(aqdtMirrorTwoQACube, false, 2);
    PluginPopup.selectObjectElements(['Client OS', 'Export Application', 'Tester', 'Test Set', 'Fun', 'Sca', 'Duration']);
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(importSuccess);
    PluginRightPanel.editObject(1);
    logStep('+ should remove all attributes and metrics');
    switchToPluginFrame();
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.selectObjectElements(['App Server', 'Browser type', 'Per', 'Sim']);
    PluginPopup.selectFilters([['App Server', ['IIS 8']]]);
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(importSuccess);
    logStep('+ should import Defect Analysis_with prompt by Wang, Zhixing');
    OfficeWorksheet.selectCell('A7');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importAnyObject(defectAnalysisPrompted);
    switchToPromptFrame();
    PluginPopup.answerPrompt('Attribute elements', 'Performance', 1);
    PluginPopup.answerPrompt('Attribute elements', 'Security', 1);
    PluginPopup.clickRun();
    PluginRightPanel.waitAndCloseNotification(importSuccess);
    logStep('+ should edit Defect Analysis_with prompt by Wang, Zhixing');
    PluginRightPanel.editObject(1);
    browser.pause(3000);
    switchToPluginFrame();
    PluginPopup.removeAllSelected();
    PluginPopup.answerPrompt('Attribute elements', 'Stability', 1);
    PluginPopup.answerPrompt('Attribute elements', 'Functionality', 1);
    PluginPopup.clickRun();
    PluginPopup.selectAttributesAndAttributeForms({ 'Creation Day': [], 'Submitted By (Defect)': [] });
    PluginPopup.selectObjectElements(['Days Open (Defect)']);
    PluginPopup.selectFilters([['Submitted By (Defect)', ['Rally']]]);
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(importSuccess);
  });
});
