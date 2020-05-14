import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import officeLogin from '../../../helpers/office/office.login';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('[F24751] Import report with or without subtotals', () => {
  beforeEach(() => {
    // officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    // browser.closeWindow();
    // const handles = browser.getWindowHandles();
    // browser.switchToWindow(handles[0]);
  });

  it('[TC53745] Checking if subtotals toggle is hidden while importing objects without subtotals and prompted report with attributes with and without subtotals', () => {
    const { basicReport } = objectsList.reports.withoutSubtotals;
    const { reportBasedOnIntelligentCube } = objectsList.reports.withoutSubtotals;
    const { promptedReport } = objectsList.reports.withoutSubtotals;
    const { reportWithCrosstabs } = objectsList.reports.withoutSubtotals;
    const { promptedReportWithCrosstabs } = objectsList.reports.withoutSubtotals;
    const { dataset } = objectsList.reports.withoutSubtotals;
    const objects = [basicReport, reportBasedOnIntelligentCube, promptedReport, reportWithCrosstabs, promptedReportWithCrosstabs, promptedReportWithCrosstabs, dataset];



    objects.forEach((obj) => {
      
    })

    // // should check if the toggle is hidden for basic report without subtotals
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.openPrepareData(basicReport, false);
    // expect($(popupSelectors.subtotalToggler).isExisting(false));
    // PluginPopup.clickBack();

    // // should check if the toggle is hidden for report without subtotals based on intelligent cube
    // PluginPopup.openPrepareData(reportBasedOnIntelligentCube, false);
    // expect($(popupSelectors.subtotalToggler).isExisting(false));
    // PluginPopup.clickBack();

    // // should check if the toggle is hidden for prompted report without subtotals

    // PluginPopup.preparePrompt(promptedReport, false);
    // PluginPopup.clickRun();
    // console.log('swich to prepare data');
    // switchToDialogFrame();
    // expect($(popupSelectors.subtotalToggler).isExisting(false));
    // PluginPopup.clickBack();

    // // should check if the toggle is hidden for  report with crosstabs without subtotals

    // PluginPopup.openPrepareData(reportWithCrosstabs, false);
    // expect($(popupSelectors.subtotalToggler).isExisting(false));
    // PluginPopup.clickBack();

    // // should check if the toggle is hidden for prompted report with crosstabs and without subtotals

    // PluginPopup.preparePrompt(promptedReportWithCrosstabs, false);
    // PluginPopup.clickRun();
    // console.log('swich to prepare data');
    // switchToDialogFrame();
    // expect($(popupSelectors.subtotalToggler).isExisting(false));
    // PluginPopup.clickBack();

    // // should  check if the toggle is hidden for dataset
    
    // PluginPopup.openPrepareData(dataset, false);
    // expect($(popupSelectors.subtotalToggler).isExisting(false));
    // PluginPopup.clickBack();
  });
});
