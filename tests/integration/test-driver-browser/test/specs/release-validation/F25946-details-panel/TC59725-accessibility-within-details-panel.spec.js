import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { pressEnter, pressDownArrow } from '../../../helpers/utils/keyboard-actions';

describe('F25946 - Object Details Panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('TC59725] - [Object Details] Accessibility within details panel', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    // expand 1 row
    PluginPopup.selectObject();
    pressDownArrow();
    pressEnter();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(false);

    // hide details panel
    pressEnter();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);
  });
});