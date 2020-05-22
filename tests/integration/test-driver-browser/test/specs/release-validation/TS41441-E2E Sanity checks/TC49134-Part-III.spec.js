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
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { excelSelectors } from '../../../constants/selectors/office-selectors';
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

    // should open a new sheet & import a report with number formatting
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.numberFormating, false);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // Assert the values of imported report "Number Formatting" are correct
    switchToExcelFrame();
    const arrayWithValuesOfThirdRow = [];
    const arrayWithExpectedValues = ['$3,456.00', '678.00%', '14/07/2098', '7:21:55 PM', '34/12', '1.35E+17', '123.45', '23,456,789,123', '-3', '23146', '7,896,434 PLN '];
    for (let i = 2; i < 13; i++) {
      const textFromCell = $(`#gridRows > div:nth-child(3) > div:nth-child(${i}) > div > div`).getText();
      arrayWithValuesOfThirdRow.push(textFromCell);
      expect(textFromCell).toEqual(arrayWithExpectedValues[i - 2]);
    }

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
    const b4 = '#gridRows > div:nth-child(4) > div:nth-child(2) > div > div';
    expect($(b4).getText()).toEqual('890700.00%');
    OfficeWorksheet.selectCell('C4');
    const numberFormatCommaButton = '#m_excelWebRenderer_ewaCtl_Number\\.NumberFormatComma-Medium';
    waitAndClick($(numberFormatCommaButton));
    browser.pause(500);
    const c4 = '#gridRows > div:nth-child(4) > div:nth-child(3) > div > div';
    expect($(c4).getText()).toEqual('                   2.46 ');

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
    OfficeWorksheet.selectCell('L4');
    browser.pause(1000);
    let cellL4value = $(cellL4).getText();
    expect(cellL4value).toBe('');

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
    OfficeWorksheet.selectCell('L4');
    browser.pause(1000);
    cellL4value = $(cellL4).getText();
    expect(cellL4value).toBe('245,677 PLN ');
  });
});
