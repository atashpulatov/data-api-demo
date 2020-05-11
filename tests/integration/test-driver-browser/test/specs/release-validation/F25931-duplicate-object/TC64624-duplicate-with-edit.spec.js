import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToDialogFrame, switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';

describe('F25931 - Duplicate object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  it('[TC64624] - Duplicate with edit', () => {
    console.log('Import BasicReport');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Save number of worksheets');
    const initialNumberOfWorksheets = OfficeWorksheet.getNumberOfWorksheets();

    console.log('Open duplicate popup for 1st imported object and click edit button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupEditBtn();

    console.log('Uncheck all attributes and all metrics in prepare data screen');
    switchToDialogFrame();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();

    console.log('Select first attribute and first metric in prepare data screen');
    PluginPopup.selectAttributeIndex([1]);
    PluginPopup.selectObjectElements(['Total Cost']);

    console.log('Click import button in Prepare Data popup');
    PluginPopup.clickImport();

    console.log('Check success of duplication');
    switchToPluginFrame();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.basicReport} Copy`);

    console.log('Check number of worksheets - should increase by 1');
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets + 1);

    // TODO: console.log('Check imported data - table should have 2 columns and 77 rows');
    // switchToExcelFrame();
    // const A2 = $('#gridRows > div:nth-child(2) > div:nth-child(1) > div > div');
    // const B77 = $('#gridRows > div:nth-child(77) > div:nth-child(2) > div > div');
    // expect(A2.getText()).toEqual('Albania');
    // expect(B77.getText()).toEqual('398042.4');
  });
});
