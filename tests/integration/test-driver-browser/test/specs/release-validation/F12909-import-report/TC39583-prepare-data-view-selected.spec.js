import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';

describe('F12909 - Ability to import a report from MicroStrategy report', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC39583] Preparing data with "View selected"', () => {
    // should import a report
    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.seasonalReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should select a supported report
    switchToExcelFrame();
    OfficeWorksheet.selectCell('Y1');
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    switchToPluginFrame();
    PluginPopup.searchForObject(objectsList.reports.basicReport);
    PluginPopup.selectObject();
    PluginPopup.clickPrepareData();

    // should select some metrics, attrobutes and valuies for filters
    PluginPopup.selectObjectElements(['Units Sold', 'Unit Price']);
    PluginPopup.selectAttributeIndex([6, 5]);
    PluginPopup.selectFilters([['Region', ['Europe', 'Asia']]]);
    browser.pause(1000);

    // should click "View selected"
    PluginPopup.clickViewSelected();

    // should enter a string
    PluginPopup.searchForPreparedObject('Unit');
    const list = $$('input[type=checkbox]').length;
    expect(list).toEqual(2);

    // should click "Back"
    PluginPopup.clickBack();
  });
});
