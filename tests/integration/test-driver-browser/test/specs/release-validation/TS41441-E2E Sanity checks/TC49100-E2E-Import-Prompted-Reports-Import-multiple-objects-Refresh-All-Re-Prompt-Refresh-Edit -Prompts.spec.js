import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('IMPORT diferent types of vizualizations', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  // Create test for each visType defined in visualizations
  it(`[TC49100] Import Prompted Reports | Import multiple objects | Refresh All | Re-Prompt | Refresh | Edit - Prompts) `, () => {
    // beforeEach
    OfficeWorksheet.selectCell('A3');
    browser.pause(4000);
    PluginRightPanel.clickImportDataButton();
    const firstReport = objectsList.reports.attributePromptedReport;
    PluginPopup.openPrepareData(firstReport, false);
    // test
    PluginPopup.promptSelectObject('Books');
    PluginPopup.promptSelectObject('Electronics');
    browser.pause(3000);
    PluginPopup.clickRun();
    browser.pause(3000);
    PluginPopup.selectAttributesAndAttributeForms({ Year: [], Region:[] });
    // browser.pause(3000);
    PluginPopup.selectAllMetrics();
    browser.pause(3000);
    PluginPopup.selectFilters([['Category', ['Books']]]);
    PluginPopup.clickDataPreview();
    browser.pause(5000);
    PluginPopup.closePreview();
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    OfficeWorksheet.selectCell('G3');
    PluginRightPanel.clickAddDataButton();
    const secondReport = objectsList.reports.attributePromptedReport;
    PluginPopup.importObject(secondReport, false);
    PluginPopup.promptSelectObject('Electronics');
    PluginPopup.clickRun();
    waitForNotification();
    switchToPluginFrame();
    browser.pause(2000);
    waitAndClick($(rightPanelSelectors.selectObject(1))); // ///// may be different...
    browser.pause(2000);
    $(rightPanelSelectors.getRefreshBtnForObject(1)).moveTo();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    browser.pause(5000);


    /*
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000); */
  })
});
