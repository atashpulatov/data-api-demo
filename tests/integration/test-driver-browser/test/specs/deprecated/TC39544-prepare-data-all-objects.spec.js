import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import { objectsList } from '../../constants/objects-list';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../constants/selectors/popup-selectors';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC39544] Preparing data with "All" objects', () => {
    // should import a report from preconditions
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
    PluginRightPanel.clickAddDataButton();
    switchToPluginFrame();
    PluginPopup.searchForObject(objectsList.reports.seasonalReport);
    PluginPopup.selectObject();
    PluginPopup.clickPrepareData();

    // should select one metric from many listed
    PluginPopup.selectObjectElements(['Month Index']);
    expect($(popupSelectors.selectorTitle(2)).getText()).toEqual('METRICS (1/2)');

    // should select one more metric from many listed
    PluginPopup.selectObjectElements(['Revenue']);
    expect($(popupSelectors.selectorTitle(2)).getText()).toEqual('METRICS (2/2)');

    // should click on "All" object in metrics column
    PluginPopup.selectAllMetrics();
    expect($(popupSelectors.selectorTitle(2)).getText()).toEqual('METRICS (0/2)');

    // should click on "All" object in metrics column again
    PluginPopup.selectAllMetrics();
    expect($(popupSelectors.selectorTitle(2)).getText()).toEqual('METRICS (2/2)');

    // should click on "All" object in attributes column
    PluginPopup.selectAllAttributes();
    expect($(popupSelectors.selectorTitle(1)).getText()).toEqual('ATTRIBUTES (2/2)');

    // should click on "All" object in attributes column again
    PluginPopup.selectAllAttributes();
    expect($(popupSelectors.selectorTitle(1)).getText()).toEqual('ATTRIBUTES (0/2)');

    // should select one attribute from many listed
    PluginPopup.selectAttributeIndex([1]);
    expect($(popupSelectors.selectorTitle(1)).getText()).toEqual('ATTRIBUTES (1/2)');

    // should select one more attribute from many listed
    PluginPopup.selectAttributeIndex([2]);
    expect($(popupSelectors.selectorTitle(1)).getText()).toEqual('ATTRIBUTES (2/2)');

    // should click on one of the filters and select (All) object in the last column
    PluginPopup.selectFilters([['Month', []]]);
    PluginPopup.selectAllFilters();
    expect($(popupSelectors.selectorFilter).getText()).toEqual('FILTERS (1/2)');

    // should select (All) object in the last column once again
    PluginPopup.selectAllFilters();
    expect($(popupSelectors.selectorFilter).getText()).toEqual('FILTERS (0/2)');

    // should select one of attribute filter values in the last columnn
    PluginPopup.selectObjectElements(['Jan 2014']);
    expect($(popupSelectors.selectorFilter).getText()).toEqual('FILTERS (1/2)');

    // should select one more of attribute filter values in the last columnn
    PluginPopup.selectObjectElements(['Feb 2014']);
    expect($(popupSelectors.selectorFilter).getText()).toEqual('FILTERS (1/2)');

    // // should click on a different filter and select (All) object in the last column
    PluginPopup.selectFilters([['Month of Year', []]]);
    browser.pause(2000);
    PluginPopup.selectAllFilters();
    expect($(popupSelectors.selectorFilter).getText()).toEqual('FILTERS (2/2)');
  });
});
