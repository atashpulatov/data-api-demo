import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import {
  changeBrowserTab, switchToDialogFrame, switchToPluginFrame, switchToExcelFrame
} from '../../../helpers/utils/iframe-helper';

describe('F25931 - Duplicate object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC64624] - Duplicate with edit', () => {
    // import a basicReport to duplicate it later
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.basicReport);

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('BasicReport is imported');

    // Get initial number of worksheets
    const initialNumberOfWorksheets = OfficeWorksheet.getNumberOfWorksheets();

    // Click duplicate button on first object on the list
    PluginRightPanel.duplicateObject(1);
    console.log('Duplicate Popup is opened');

    // Click edit button in duplicate popup
    PluginRightPanel.clickDuplicatePopupEditBtn();
    console.log('Edit button in Duplicate Popup is clicked');

    switchToDialogFrame();
    // should click on "All" object in attributes and metrics columns to uncheck all elelemnts
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    console.log('Uncheck all attributes and all metrics');

    // should click on first object in attributes and metrics columns to select them
    PluginPopup.selectAttributeIndex([1]);
    PluginPopup.selectObjectElements(['Total Cost']);
    console.log('Seletc 1 attribute and 1 metric');

    PluginPopup.clickImport();
    console.log('Click import in Prepare Data popup');

    switchToPluginFrame();
    // Expect succesfull duplication notification
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    console.log('BasicReport is duplicated with edit');

    // Expect new object name to be old name with added copy
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.basicReport} Copy`);

    // Expect new sheet beeing added - number of worksheets got increased
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets + 1);

    // TODO: Expect data in table to be filtered out to 2 columns and 77 rows.
    // switchToExcelFrame();
    // const A2 = $('#gridRows > div:nth-child(2) > div:nth-child(1) > div > div');
    // const B77 = $('#gridRows > div:nth-child(77) > div:nth-child(2) > div > div');
    // expect(A2.getText()).toEqual('Albania');
    // expect(B77.getText()).toEqual('398042.4');
  });
});
