import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('F25931 - Duplicate object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC64607] - Duplicate object', () => {
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

    console.log('Open duplcate popup for 1st imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();

    console.log('Check success of duplication');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.basicReport} Copy`);

    console.log('Check number of worksheets - should increase by 1');
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets + 1);
  });
});
