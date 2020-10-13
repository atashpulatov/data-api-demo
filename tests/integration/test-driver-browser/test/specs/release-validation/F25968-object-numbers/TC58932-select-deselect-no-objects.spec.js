import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';

describe('F25968 - Dynamically update numbers of objects displayed next to categories in filter panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC58932] Deselecting/selecting filters with no objects', () => {
    // open import data popup
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();

    // apply filters
    PluginPopup.switchLibrary(false);
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');

    // find empty owner
    const someEmptyElement = $(popupSelectors.filterPanel.disabledCheckboxAllPanel);
    expect(someEmptyElement.$('input').isSelected()).toBe(true);

    // deselect empty owner
    someEmptyElement.$('input').click();
    expect(someEmptyElement.$('input').isSelected()).toBe(false);

    // try to select it again
    someEmptyElement.$('input').click();
    expect(someEmptyElement.$('input').isSelected()).toBe(false);
  });
});
