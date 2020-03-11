import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F24087 - Improve performance of scrolling through the object list', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC54976][Object Table] End to End scenario on Excel implementation | E2E', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    switchToPluginFrame();
    PluginPopup.clickFilterButton();

    /* Select some filters from the owner category */
    PluginPopup.tickFilterCheckBox('Owner', 'Administrator');
    PluginPopup.clickHeader('Owner');
    expect($(popupSelectors.columnOwner).getAttribute('Title')).toEqual('Administrator');
    PluginPopup.clickHeader('Owner');
    expect($(popupSelectors.columnOwner).getAttribute('Title')).toEqual('Administrator');

    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    /* Open filters and select some filters from the Modified category */
    PluginPopup.clickFilterButton();
    PluginPopup.filterByDate('5/12/2006', '3/7/2018');
    const dateFrom = new Date(2006, 5, 12);
    const dateTo = new Date(2018, 3, 7);
    PluginPopup.clickFilterButton();

    PluginPopup.clickHeader('Modified');
    expect(PluginPopup.assertFirstObjectDateIsInTheRange(dateFrom, dateTo)).toBe(true);

    PluginPopup.clickHeader('Modified');
    expect(PluginPopup.assertFirstObjectDateIsInTheRange(dateFrom, dateTo)).toBe(true);

    PluginPopup.selectLastObject();
    PluginPopup.switchLibrary(false);

    PluginPopup.clickFilterButton();

    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickHeader('Owner');

    /* Open the filter panel and select some filters for 'Application', 'Type', 'Owner' */
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Owner', 'MSTR User');
    PluginPopup.tickFilterCheckBox('Application', 'MicroStrategy Tutorial');
    PluginPopup.tickFilterCheckBox('Type', 'Report');

    /* Scroll down and select any object from the list */
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.switchLibrary(true);
    PluginPopup.switchLibrary(false);

    /* Open filter panel & click 'Clear All' button in the bottom right corner */
    PluginPopup.clickFilterButton();
    PluginPopup.clearAll();

    browser.pause(3333);
  });
});
