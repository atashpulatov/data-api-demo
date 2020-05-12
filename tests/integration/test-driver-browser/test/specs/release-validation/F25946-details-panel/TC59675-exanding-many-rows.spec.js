import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { pressEnter, pressDownArrow } from '../../../helpers/utils/keyboard-actions';

describe('F25946 - details panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('TC59725] - [Object Details] Accessibility within details panel', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    // expand 1 row
    PluginPopup.selectFirstObject();
    pressDownArrow();
    pressEnter();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(false);

    PluginPopup.scroll(['End']);
    PluginPopup.selectFirstObject();
    pressDownArrow();
    pressEnter();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(false);

    // hide details panel
    pressEnter();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);
    PluginPopup.scroll(['Start']);
    PluginPopup.selectFirstObject();
    pressDownArrow();
    pressEnter();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);
  });
});
