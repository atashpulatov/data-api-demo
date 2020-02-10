import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objects as o } from '../../../constants/objects-list';
import settings from '../../../config';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { switchToPromptFrame } from '../../../helpers/utils/iframe-helper';
import { selectors } from '../../../constants/selectors/popup-selectors';

describe('F24398 - import and refresh visualization', () => {
  beforeEach(() => {
    browser.setWindowSize(1500, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC53627] Dossier top menu buttons', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.interactiveDossier;
    PluginPopup.openDossier(dossierObject.name);
    switchToPromptFrame();
    const { dossierWindow } = selectors;

    // Change Page/Chapter
    waitAndClick($(dossierWindow.buttonToC), 1000);
    waitAndClick($(dossierWindow.getTocItemAt(4)), 1000);
    browser.pause(2000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 2');
    waitAndClick($(dossierWindow.buttonToC), 1000);
    waitAndClick($(dossierWindow.getTocItemAt(2)), 1000);
    browser.pause(1000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 1: Three vizualizations');

    // Apply Bookmark
    waitAndClick($(dossierWindow.buttonBookmarks), 1000);
    waitAndClick($(dossierWindow.getBookmarkItemAt(1)), 1000);
    browser.pause(3000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 1: Pie Chart');

    // Refresh Dossier
    waitAndClick($(dossierWindow.buttonRefreshDossier), 1000);
    waitAndClick($(dossierWindow.buttonConfirmRefresh), 1000);
    browser.pause(1000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 1: Three vizualizations');

    // Filtes
    waitAndClick($(dossierWindow.buttonFilters), 1000);
    waitAndClick($(dossierWindow.filtersMenu.getFilterAt(1)), 1000);
    waitAndClick($(dossierWindow.filtersMenu.selectFilterValueAt(2)), 1000);
    waitAndClick($(dossierWindow.filtersMenu.getFilterAt(1)), 1000);

    const maxValueInput = $(`${dossierWindow.filtersMenu.getFilterAt(2)} ${dossierWindow.filtersMenu.getSliderInput('right')} > input`)
    maxValueInput.doubleClick();
    browser.keys('\uE003'); // Press Backspace
    maxValueInput.setValue('150000')
    waitAndClick($(dossierWindow.filtersMenu.buttonApplyFilters), 1000);
    browser.pause(1000);
    expect($(dossierWindow.filterCount).getText()).toEqual('FILTERS (2)');
  });
});
