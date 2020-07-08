import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import { objectsList } from '../../constants/objects-list';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC39600] Data preview', () => {
    // should import a report
    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.seasonalReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should select a supported report
    OfficeWorksheet.selectCell('Y1');
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    switchToPluginFrame();
    PluginPopup.searchForObject(objectsList.reports.basicReport);
    PluginPopup.selectObject();
    PluginPopup.clickPrepareData();

    // should select some metrics, attributes and values for filters
    PluginPopup.selectObjectElements(['Units Sold']);
    PluginPopup.selectAttributeIndex(6);
    PluginPopup.selectFilters([['Region', ['Europe', 'Asia']]]);

    // should click "Data Preview"
    PluginPopup.clickDataPreview();
    browser.pause(2000);
    expect($('#rcDialogTitle0').isDisplayed()).toBe(true);

    // should click "Close Preview"
    PluginPopup.closePreview();
    browser.pause(2000);
    expect($('#rcDialogTitle0').isDisplayed()).toBe(false);

    // should click "Cancel"
    PluginPopup.clickCancel();
  });
});
