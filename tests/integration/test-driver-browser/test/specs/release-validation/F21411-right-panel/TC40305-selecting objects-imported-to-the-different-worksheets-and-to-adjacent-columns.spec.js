
import officeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification, waitById } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToExcelFrame, switchToPluginFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('F21411 - Selecting an object in the side panel highlights the data in the workbook', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC40305] Selecting objects imported to the different worksheets', () => {
    // should import a report
    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importAnyObject(objectsList.reports.reportXML, 2);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Report is imported');

    // should import a report to a different worksheet
    OfficeWorksheet.openNewSheet();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.datasets.basicDataset);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Dataset is imported');

    // should click on the object imported to the first sheet in the right panel
    PluginRightPanel.clickObjectInRightPanelAndAssert(2, 'A1');
    console.log('Report\'s placeholder in the right panel is clicked');

    // should hover on the object imported to the second sheet in the right panel
    switchToPluginFrame();
    const objectSelected = $(rightPanelSelectors.getObjectSelector(1));
    objectSelected.moveTo();
    console.log('Hovered overt the dataset\'s placeholder in the right panel is clicked');

    // should click on the object imported to the second sheet in the right panel
    PluginRightPanel.clickObjectInRightPanelAndAssert(1, 'A1');
    console.log('Dataset\'s placeholder in the right panel is clicked');

    // should click on the object's name imported to the second sheet in the right panel
    switchToPluginFrame();
    $(rightPanelSelectors.importedObjectNameList).doubleClick();
    console.log('Dataset\'s name in the right panel is clicked');

    // refresh the object imported to the second sheet
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Dataset is refreshed');
  });
});
