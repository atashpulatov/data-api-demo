import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab, switchToPluginFrame, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeLogin from '../../../helpers/office/office.login';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('[F22955] - Ability to refresh prompted data already imported to the workbook', () => {
  beforeEach(() => {
    // officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    // browser.closeWindow();
    // changeBrowserTab(0);
  });

  it('[TC62619] Refreshing an edited object', () => {
    // should import a report
    PluginRightPanel.clickImportDataButton();
    // import random object
    const randomObject = Math.floor(Math.random() * 3);
    const report = objectsList.reports.BasicReportWBrand;
    const dataset = objectsList.datasets.salesData;
    const dossier = objectsList.dossiers.complexDossier.name;
    const objects = [report, dataset, dossier];
    console.log(objects[randomObject]);

    PluginPopup.importAnyObject(objects[randomObject], 1);

    if (objects[randomObject] === report || objects[randomObject] === dataset) {
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();

      //  should edit object
      switchToPluginFrame();
      PluginRightPanel.editObject(1);
      browser.pause(5000);

      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();

      //  should edit report
      switchToPluginFrame();
      PluginRightPanel.editObject(1);
      browser.pause(5000);

      switchToPluginFrame();
      PluginPopup.selectAttributesAndAttributeForms({ Subcategory: [] });
      PluginPopup.selectAllMetrics();
      switchToPluginFrame();
      PluginPopup.clickImport();
      waitForNotification();
      PluginRightPanel.closeNotificationOnHover();
      browser.pause(2000);

    } else {
      PluginPopup.selectAndImportVizualiation(objectsList.dossiers.complexDossier.visualizations.grid);
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();

      switchToPluginFrame();
      PluginRightPanel.editObject(1);
      browser.pause(5000);

      PluginPopup.selectAndImportVizualiation(objectsList.dossiers.complexDossier.visualizations.heatMap);
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();
    }

    // should refresh the object
    switchToPluginFrame();
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();
  });
});
