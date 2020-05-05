import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab, switchToPromptFrame, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F21402 - Handle Prompted Object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[Import prompt] Navigation while importing prompted reports (Run, Back and Cancel buttons)', () => {
    // should click prepare data on selected report
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrompt(objectsList.reports.objectPromptedReport);
    switchToDialogFrame();

    console.log('Should click Back button');
    PluginPopup.clickBack();
    PluginPopup.preparePrompt(objectsList.reports.objectPromptedReport);
    switchToDialogFrame();

    console.log('Should Click Run button');
    PluginPopup.clickRun();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();

    console.log('Should click Back button');
    PluginPopup.clickBack();
    PluginPopup.openPrompt(objectsList.reports.objectPromptedReport);
    switchToDialogFrame();

    console.log('Should click Cancel button');
    PluginPopup.clickCancel();
  });
});
