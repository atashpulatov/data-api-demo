import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep } from '../../../helpers/utils/allure-helper';
import { switchToPromptFrame } from '../../../helpers/utils/iframe-helper';


it('[TC65891] - AQDT E2E - Edit a dataset, import prompted report and re-prompt', () => {
  logStep('+ should import QA Cube by Sundarababu, Arun');
  OfficeWorksheet.selectCell('A1');
  PluginRightPanel.clickImportDataButton();
  const QACube = objectsList.datasets.aqdtMirrorTwoQACube;
  PluginPopup.openPrepareData(QACube, false, 2);
  PluginPopup.selectObjectElements(['Client OS', 'Export Application', 'Tester', 'Test Set', 'Fun', 'Sca', 'Duration']);
  PluginPopup.clickImport();
  PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
  PluginRightPanel.editObject(1);
  logStep('+ should remove all attributes and metrics');
  PluginPopup.selectAllAttributesAndMetrics();
  PluginPopup.selectAllAttributesAndMetrics();
  PluginPopup.selectObjectElements(['App Server', 'Browser type', 'Per', 'Sim']);
  PluginPopup.selectFilters([['App Server', ['IIS 8']]]);
  PluginPopup.clickImport();
  PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
  logStep('+ should import Defect Analysis_with prompt by Wang, Zhixing');
  OfficeWorksheet.selectCell('A7');
  const promptedReport = objectsList.datasets.defectAnalysis;
  PluginRightPanel.clickAddDataButton();
  PluginPopup.importAnyObject(promptedReport);
  switchToPromptFrame();
  PluginPopup.answerPrompt('Attribute elements', 'Performance', 1);
  PluginPopup.answerPrompt('Attribute elements', 'Security', 1);
  PluginPopup.clickRun();
});
