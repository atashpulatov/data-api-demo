import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import officeLogin from '../../../helpers/office/office.login';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('[F24751] Import report with or without subtotals', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC53745] Checking if subtotals toggle is hidden while importing objects without subtotals and prompted report with attributes with and without subtotals', () => {
    const { basicReport } = objectsList.reports.withoutSubtotals;
    const { reportBasedOnIntelligentCube } = objectsList.reports.withoutSubtotals;
    const { promptedReport } = objectsList.reports.withoutSubtotals;
    const { reportWithCrosstabs } = objectsList.reports.withoutSubtotals;
    const { promptedReportWithCrosstabs } = objectsList.reports.withoutSubtotals;
    const { dataset } = objectsList.reports.withoutSubtotals;
    const { PromptedReportWithandWithoutSubtotals } = objectsList.reports;
    const objects = [basicReport, reportBasedOnIntelligentCube, promptedReport, reportWithCrosstabs, promptedReportWithCrosstabs, promptedReportWithCrosstabs, dataset];


    PluginRightPanel.clickImportDataButton();
    objects.forEach((obj) => {
      if (obj.includes('Prompted')) {
        console.log(`Check toggle for ${obj}`);
        PluginPopup.preparePrompt(obj, false);
        PluginPopup.clickRun();
        console.log('swich to prepare data');
        switchToDialogFrame();
        expect($(popupSelectors.subtotalToggler).isExisting(false));
        PluginPopup.clickBack();
      } else {
        console.log(`Check toggle for ${obj}`);
        PluginPopup.openPrepareData(obj, false);
        expect($(popupSelectors.subtotalToggler).isExisting(false));
        PluginPopup.clickBack();
      }
    });

    console.log(`Assert there is no toggle when report is prompted without subtotals`);
    PluginPopup.preparePrompt(PromptedReportWithandWithoutSubtotals, false);
    switchToDialogFrame();
    PluginPopup.removeAllSelected();
    PluginPopup.promptSelectObjectForEdit('Subcategory');
    PluginPopup.clickRun();
    browser.pause(3000);
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();
  });
});
