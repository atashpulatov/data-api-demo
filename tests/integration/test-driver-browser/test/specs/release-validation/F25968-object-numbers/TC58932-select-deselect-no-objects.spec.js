import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import {waitAndClick} from '../../../helpers/utils/click-helper';

describe('TC58932 - Deselecting/selecting filters with no objects', () => {
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
    browser.pause(800);
    switchToPluginFrame();

    // apply filters
    PluginPopup.switchLibrary(false);
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    // PluginPopup.tickFilterCheckBox('Type', 'Report');
    PluginPopup.tickFilterCheckBox('Certified Status', 'Certified');

    // find empty owner
    const someEmptyElement = $(popupSelectors.filterPanel.disabledCheckboxAllPanel);

    // deselect empty owner
    someEmptyElement.click();

    // try to select it again
    someEmptyElement.click();
    expect(someEmptyElement.isSelected()).toBe(false);
  });
});
