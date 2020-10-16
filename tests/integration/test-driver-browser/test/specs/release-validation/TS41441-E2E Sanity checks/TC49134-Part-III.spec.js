import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import {
  switchToPluginFrame, switchToRightPanelFrame, switchToExcelFrame, changeBrowserTab
} from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { pressBackspace, pressEnter } from '../../../helpers/utils/keyboard-actions';

function changeFontNameInCell(fontName, cell) {
  switchToExcelFrame();
  if (cell !== undefined) {
    OfficeWorksheet.selectCell(cell);
  }
  const excelFontName = '#m_excelWebRenderer_ewaCtl_Font\\.FontName';
  waitAndClick($(excelFontName));
  pressBackspace();
  $(excelFontName).setValue(fontName);
  pressEnter();
}

describe('TS41441 - Sanity checks', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC49134] Part III - Formatting | Secure Data - Additional Checks', () => {
    const user2 = { username: 'user2', password: 'user2' };
    const cellL4 = '#gridRows > div:nth-child(4) > div:nth-child(12)';

    OfficeWorksheet.selectCell('A1');
    // should open a new sheet & import a report with number formatting
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.numberFormating, false);

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    // Assert the values of imported report "Number Formatting" are correct
    OfficeWorksheet.selectCellAndAssertValue('B2', '4560');

    switchToExcelFrame();
    // applying table formatting
    const tableDesignTab = '#m_excelWebRenderer_ewaCtl_Ribbon\\.Table\\.Design-title > a > span';
    waitAndClick($(tableDesignTab));
    const greenTableStyle = '#m_excelWebRenderer_ewaCtl_Ribbon\\.TableTools\\.TableStyles\\.Style6-Large > div > div > table';
    waitAndClick($(greenTableStyle));

    // different number formats (percentage & comma)
    const homeTab = '#m_excelWebRenderer_ewaCtl_Ribbon\\.Home-title > a > span';
    waitAndClick($(homeTab));
    browser.pause(500);
    OfficeWorksheet.selectCell('B4');
    const percentageButton = '#m_excelWebRenderer_ewaCtl_Number\\.Percentage-Medium';
    waitAndClick($(percentageButton));
    browser.pause(500);
    OfficeWorksheet.selectCellAndAssertValue('B4', '890700%');
    OfficeWorksheet.selectCell('C4');
    const numberFormatCommaButton = '#m_excelWebRenderer_ewaCtl_Number\\.NumberFormatComma-Medium';
    waitAndClick($(numberFormatCommaButton));
    browser.pause(500);
    OfficeWorksheet.selectCellAndAssertValue('C4', '2.459');

    // cell content alignment and fonts
    OfficeWorksheet.selectCell('B2');
    const alignMiddleButton = '#m_excelWebRenderer_ewaCtl_Alignment\\.AlignMiddle-Medium';
    waitAndClick($(alignMiddleButton));
    OfficeWorksheet.selectCell('C2');
    const alignleftButton = '#m_excelWebRenderer_ewaCtl_Alignment\\.AlignLeft-Medium';
    waitAndClick($(alignleftButton));

    OfficeWorksheet.selectCell('D2');
    const boldButton = '#m_excelWebRenderer_ewaCtl_Font\\.Bold-Small';
    waitAndClick($(boldButton));
    OfficeWorksheet.selectCell('E2');
    const fontColorButton = '#m_excelWebRenderer_ewaCtl_Font\\.FontColorWithSplit-Small';
    waitAndClick($(fontColorButton));
    OfficeWorksheet.selectCell('G2');
    const fillColorButton = '#m_excelWebRenderer_ewaCtl_Font\\.FillColorWithSplit-Small';
    waitAndClick($(fillColorButton));
    changeFontNameInCell('Arial Black');


    // should clear data
    browser.pause(1000);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();
    browser.pause(4000);

    // should assert data was cleared
    switchToExcelFrame();
    OfficeWorksheet.selectCellAndAssertValue('L4', '');

    // should log out
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();

    // should log in with another user
    browser.pause(1000);
    switchToRightPanelFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(2000, false);
    PluginRightPanel.clickLoginRightPanelBtn();
    changeBrowserTab(2);
    PluginRightPanel.enterCredentialsAndPressLoginBtn(user2.username, user2.password);
    changeBrowserTab(1);

    // should click "View Data" and close the "Refresh All Data" pop-up
    browser.pause(1000);
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    switchToExcelFrame();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);

    // should assert data was refreshed
    switchToExcelFrame();
    OfficeWorksheet.selectCellAndAssertValue('L4', '245677');
  });
});
