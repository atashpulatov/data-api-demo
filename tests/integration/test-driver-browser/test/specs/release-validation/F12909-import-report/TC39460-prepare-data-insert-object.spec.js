import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';

describe('F12909 - Ability to import a report from MicroStrategy report', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC39460] Insert a dataset/report with data prepare', () => {
    // should insert a dataset with data preparation
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.prepareObject(objectsList.datasets.basicDataset, ['Order Date', 'Country', 'Region', 'Total Cost', 'Total Revenue'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should insert a report with data preparation
    OfficeWorksheet.selectCell('A5');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.prepareObject(objectsList.reports.basicReport, ['Total Cost', 'Total Revenue'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
  });
});
