import OfficeLogin from '../../../helpers/office/office.login';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('F25931 - Duplicate object', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  // Create test for each visType defined in visualizations
  it(`[TC65014] Side panel functionality for duplicated object) `, () => {
    PluginPopup.importObjectToCellAndAssertSuccess('A1', objectsList.reports.mergedHeaderReport, 'Importing Report', false);

    console.log('Duplicating the report');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);

    console.log('Select duplicated report');
    PluginRightPanel.clickObjectInRightPanel(1);

    console.log('Changing the name of duplicated report');
    PluginRightPanel.changeObjectName(1, dictionary.en.longText);

    console.log('Highligting the name of duplicated report');
    switchToPluginFrame();
    $(rightPanelSelectors.getNameInputForObject(1)).moveTo();
    browser.pause(1000);

    console.log('Refresh duplicated report');
    PluginRightPanel.refreshObject(1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);

    console.log('Remove duplicated report');
    PluginRightPanel.removeObject(1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.objectRemoved);

    browser.pause(1000);
  });
});
