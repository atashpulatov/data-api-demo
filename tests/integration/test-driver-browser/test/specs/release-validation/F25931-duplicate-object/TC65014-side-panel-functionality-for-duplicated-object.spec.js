import OfficeLogin from '../../../helpers/office/office.login';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
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
    pluginPopup.importObjectToCellAndAssertSuccess('A1', objectsList.reports.mergedHeaderReport, 'Importing Report', false);

    console.log('Duplicating the report');
    pluginRightPanel.duplicateObject(1);
    pluginRightPanel.clickDuplicatePopupImportBtn();
    pluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);

    console.log('Select duplicated report');
    pluginRightPanel.clickObjectInRightPanel(1);

    console.log('Changing the name of duplicated report');
    const name = 'This is a veeery long text that would exceed the limit of the input text field';
    pluginRightPanel.changeObjectName(1, name);

    console.log('Highligting the name of duplicated report');
    switchToPluginFrame();
    $(rightPanelSelectors.getNameInputForObject(1)).moveTo();
    browser.pause(1000);

    console.log('Refresh duplicated report');
    pluginRightPanel.refreshObject(1);
    pluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);

    console.log('Remove duplicated report');
    pluginRightPanel.removeObject(1);
    pluginRightPanel.waitAndCloseNotification(dictionary.en.objectRemoved);

    browser.pause(1000);
  });
});
