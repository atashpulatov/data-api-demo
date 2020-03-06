import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F25968 - Dynamically update numbers of objects displayed next to categories in filter panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('TC58932 - Deselecting/selecting filters with no objects', () => {
    // open import data popup
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();

    // apply filters
    PluginPopup.switchLibrary(false);
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');
    PluginPopup.clickDisabledElement('MSTR User');

    // try to select a disabled checkbox
    PluginPopup.clickDisabledElement('MSTR User');
    expect($(popupSelectors.filterPanel.disabledCheckboxAllPanel).isSelected()).toBe(false);
  });
});
