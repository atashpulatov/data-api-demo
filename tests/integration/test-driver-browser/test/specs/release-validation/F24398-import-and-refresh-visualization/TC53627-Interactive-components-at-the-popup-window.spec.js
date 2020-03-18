import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { switchToPromptFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F24398 - import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC53627] Dossier top menu buttons', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = objectsList.dossiers.interactiveDossier;
    PluginPopup.openDossier(dossierObject.name);
    switchToPromptFrame();
    const { dossierWindow } = popupSelectors;

    // Change Page/Chapter
    PluginPopup.goToDossierPageOrChapter(4);
    browser.pause(2000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 2');
    PluginPopup.goToDossierPageOrChapter(2);
    browser.pause(1000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 1: Three vizualizations');

    // Apply Bookmark
    PluginPopup.applyDossierBookmark(1)
    browser.pause(3000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 1: Pie Chart');

    // Refresh Dossier
    PluginPopup.refreshDossier();
    browser.pause(1000);
    expect($(dossierWindow.visualizationName).getText()).toEqual('Chapter 1: Pie Chart');

    // Filtes
    waitAndClick($(dossierWindow.buttonFilters), 1000);
    PluginPopup.selectValuesFromDossierListFilter(1, [1, 2])
    PluginPopup.setValueOnDossierSliderFilter(2, 'right', '150000')
    waitAndClick($(dossierWindow.filtersMenu.buttonApplyFilters), 1000);
    browser.pause(1000);
    expect($(dossierWindow.filterCount).getText()).toEqual('FILTERS (2)');
  });
});
