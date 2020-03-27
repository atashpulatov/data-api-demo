
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

   it('[TC53745] Checking if subtotals toggle is hidden while importing report/dataset without subtotals', () => {
    // should check if the toggle is hidden for basic report without subtotals
    const basicReport = objectsList.reports.withoutSubtotals.basicReport;
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(basicReport, false);
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();

    // should check if the toggle is hidden for report without subtotals based on intelligent cube
    const reportBasedOnIntelligentCube = objectsList.reports.withoutSubtotals.reportBasedOnIntelligentCube;
    PluginPopup.openPrepareData(reportBasedOnIntelligentCube, false);
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();
    

    // should check if the toggle is hidden for prompted report without subtotals
    const promptedReportWithoutSubtotals = objectsList.reports.withoutSubtotals.promptedReport;
    PluginPopup.preparePrompt(promptedReportWithoutSubtotals, false);
    PluginPopup.clickRun();
    console.log('swich to prepare data'); 
    switchToDialogFrame();
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();

    //should check if the toggle is hidden for  report with crosstabs without subtotals
    const reportWithCrosstabsWithoutSubtotals = objectsList.reports.withoutSubtotals.reportWithCrosstabs;
    PluginPopup.openPrepareData(reportWithCrosstabsWithoutSubtotals, false);
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();

    // should check if the toggle is hidden for prompted report with crosstabs and without subtotals
    const promptedReportWithCrosstabsWithoutSubtotals = objectsList.reports.withoutSubtotals.promptedReportWithCrosstabs;
    PluginPopup.preparePrompt(promptedReportWithCrosstabsWithoutSubtotals, false);
    PluginPopup.clickRun();
    console.log('swich to prepare data'); 
    switchToDialogFrame();
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();

    // should  check if the toggle is hidden for dataset
    const dataset = objectsList.reports.withoutSubtotals.dataset;
    PluginPopup.openPrepareData(dataset, false);
    expect($(popupSelectors.subtotalToggler).isExisting(false));
    PluginPopup.clickBack();



  });

}); 

