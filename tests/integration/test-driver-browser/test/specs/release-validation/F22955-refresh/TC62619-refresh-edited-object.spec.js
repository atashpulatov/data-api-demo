import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
// import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import {
  changeBrowserTab, switchToPluginFrame, switchToDialogFrame, switchToRightPanelFrame
} from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeLogin from '../../../helpers/office/office.login';
// import { excelSelectors } from '../../../constants/selectors/office-selectors';

describe('F22955 - Ability to refresh prompted data already imported to the workbook', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC62619] Refreshing an edited object', () => {
    const randomObject = Math.floor(Math.random() * 3);
    const report = objectsList.reports.BasicReportWBrand;
    const dataset = objectsList.datasets.salesData;
    const dossier = objectsList.dossiers.complexDossier.name;
    const objects = [report, dataset, dossier];
    const object = objects[randomObject];

    console.log('Should import random object');
    PluginRightPanel.clickImportDataButton();
    console.log(`"${object}" will be imported`);

    PluginPopup.importAnyObject(object, 1);

    if (object === report || object === dataset) {
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();

      console.log(`Should edit "${object}"`);
      switchToRightPanelFrame();
      PluginRightPanel.editObject(1);
      browser.pause(1000);
      switchToPluginFrame();
      PluginPopup.selectObjectElements(['Subcategory']);
      PluginPopup.selectFilters([['Subcategory', ['Sandals']]]);
      PluginPopup.clickImport();
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();
      browser.pause(3000);
    } else {
      PluginPopup.selectAndImportVisualization(objectsList.dossiers.complexDossier.visualizations.grid);
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();

      console.log(`Should edit "${object}"`);
      switchToPluginFrame();
      PluginRightPanel.editObject(1);
      browser.pause(5000);

      PluginPopup.selectAndImportVisualization(objectsList.dossiers.complexDossier.visualizations.heatMap);
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
      PluginRightPanel.closeNotificationOnHover();
    }
    switchToPluginFrame();
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    // TODO:
    // expect is not working for the cells
    // const B2 = $(excelSelectors.getCell(2, 2)).getText();

    // switch (object) {
    //   case report:
    //     OfficeWorksheet.selectCell('B2');
    //     expect(B2).toContain('San Francisco');
    //     break;
    //   case dataset:
    //     OfficeWorksheet.selectCell('B2');
    //     expect(B2).toContain('San Francisco');
    //     break;
    //   case dossier:
    //     OfficeWorksheet.selectCell('B2');
    //     expect(B2).toContain('San Francisco');
    //     break;
    //   default:
    //     console.log('Import is empty');
    // }
  });
});
