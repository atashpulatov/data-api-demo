import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

describe('F24087 - Improve performance of scrolling through the object list', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC55132][Object Table] Date format | I18N', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    switchToPluginFrame();
    PluginPopup.switchLibrary(false);

    // Selecting which format should be used for assertion based on
    // the object 'Eastern Region Average Revenue per Customer' on MicroStrategy Tutorial modified date
    // and the Language and Region property value
    const REGION_TO_DATE = {
      'de-de': '12.8.2016 19:32', // German
      'da-dk': '12.8.2016 19:32', // Danish
      'es-es': '12/8/2016 19:32', // Spanish
      'fr-fr': '12/8/2016 19:32', // French
      'it-it': '12/8/2016 19:32', // Italian
      'pt-br': '12/8/2016 19:32', // Portugese
      'sv-se': '2016-8-12 19:32', // Swedish
      'nl-nl': '2016-8-12 19:32', // Dutch
      'zh-cn': '2016/8/12 19:32', // Chinese Simplified
      'zh-tw': '2016/8/12 19:32', // Chinese Traditional
      'ja-jp': '2016/08/12 19:32', // Japanese
      'ko-kr': '2016.8.12 오후 7:32', // Korean
    };
    const selectDateFormatByLanguageRegion = (languageRegion) => {
      if (languageRegion in REGION_TO_DATE) {
        return REGION_TO_DATE[languageRegion];
      }
      return '8/12/2016 7:32 PM'; // Defaul and fallback - English US
    };

    // Get date for the object 'Eastern Region Average Revenue per Customer' on MicroStrategy Tutorial
    // Expected date format '8/12/2016 7:32 PM' on en-us locale
    PluginPopup.searchForObject('Eastern Region Average Revenue per Customer');
    browser.pause(999); // waiting for search to filter the ObjectTable
    PluginPopup.selectObject();
    expect(
      PluginPopup.getFirstRowDate() === selectDateFormatByLanguageRegion(browser.config.languageRegion)
    ).toBe(true);
  });
});
