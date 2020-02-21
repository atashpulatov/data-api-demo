import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';

describe('TC59987 - Import attribute forms', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Display attribute forms', () => {
    const objectName = '06 Sort by Revenue Rank - Month Report Filter';
    PluginRightPanel.clickImportDataButton();
    PluginPopup.prepareObject(objectName);
    PluginPopup.selectAllMetrics();
    PluginPopup.selectAttributesAndAttributeForms({ Region: ['ID'] });
    PluginPopup.selectAttributeFormVisualisation('On');
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(3000);
    expect($(rightPanelSelectors.importedObjectNameList).getText()).toEqual(objectName);
    PluginRightPanel.edit();
    browser.pause(3000);
    switchToPluginFrame();
    waitAndClick($('.item-title=Region')); // TODO: unselect the Region attribute
    PluginPopup.selectAttributesAndAttributeForms({ Employee: ['Last Name', 'ID'] });
    PluginPopup.selectAttributeFormVisualisation('Show attribute name once');
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(1500);
    switchToExcelFrame();
    const A4 = '#gridRows > div:nth-child(4) > div:nth-child(1) > div > div';
    OfficeWorksheet.selectCell('A4')
    expect($(A4).getText()).toEqual('Laura')
  });
});
