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

  it('[TC59877][Table of Objects] Highlighting the row on hover/selection | FUN', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    switchToPluginFrame();
    //Switching to non My Libray view as there is more objects available
    PluginPopup.switchLibrary(false);
    browser.pause(500); //wait before next action

    //Expected background colors
    const backgroundColorNotSelectedNotHighlighted = '#000000';
    const backgroundColorNotSelectedHighlighted = '#f9f9f9';
    const backgroundColorSelected = '#f0f7fe';

    //Check the background color for not selected and not highlighted object
    expect(PluginPopup.getBackgroundColor(popupSelectors.anyObject(4)) === backgroundColorNotSelectedNotHighlighted).toBe(true);

    //Move the mouse cursor to one of the objects and check the background color for it - highlighted
    $(popupSelectors.anyObject(4)).moveTo();
    expect(PluginPopup.getBackgroundColor(popupSelectors.anyObject(4)) === backgroundColorNotSelectedHighlighted).toBe(true);

    //Select one of the objects and check the background color for it - selected
    PluginPopup.selectAnyObject(4);
    browser.pause(500); //wait for the selection to get active before getting color value
    expect(PluginPopup.getBackgroundColor(popupSelectors.anyObject(4)) === backgroundColorSelected).toBe(true);

    //Move the mouse cursor to the not selected object and check the background color for it - highlighted
    $(popupSelectors.anyObject(5)).moveTo();
    expect(PluginPopup.getBackgroundColor(popupSelectors.anyObject(5)) === backgroundColorNotSelectedHighlighted).toBe(true);

    //Move the mouse cursor back to the selected object and check the background color for it - selected
    $(popupSelectors.anyObject(4)).moveTo();
    expect(PluginPopup.getBackgroundColor(popupSelectors.anyObject(4)) === backgroundColorSelected).toBe(true);
  });
});