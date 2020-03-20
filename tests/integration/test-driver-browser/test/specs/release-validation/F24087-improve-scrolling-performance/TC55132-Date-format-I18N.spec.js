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

    //Selecting which format should be used for assertion based on
    //the object 'Eastern Region Average Revenue per Customer' on MicroStrategy Tutorial modified date
    //and the Language and Region property value
    let expectedDateFormat = '8/12/2016 9:32 PM'; //Defaul and fallback - English US
    if (browser.config.languageRegion === 'de-de') expectedDateFormat = '12.8.2016 21:32'; //German
    else if (browser.config.languageRegion === 'da-dk') expectedDateFormat = '12.8.2016 21:32'; //Danish
    else if (browser.config.languageRegion === 'es-es') expectedDateFormat = '12/8/2016 21:32'; //Spanish
    else if (browser.config.languageRegion === 'fr-fr') expectedDateFormat = '12/8/2016 21:32'; //French
    else if (browser.config.languageRegion === 'it-it') expectedDateFormat = '12/8/2016 21:32'; //Italian
    else if (browser.config.languageRegion === 'pt-br') expectedDateFormat = '12/8/2016 21:32'; //Portugese
    else if (browser.config.languageRegion === 'sv-se') expectedDateFormat = '2016-8-12 21:32'; //Swedish
    else if (browser.config.languageRegion === 'nl-nl') expectedDateFormat = '2016-8-12 21:32'; //Dutch
    else if (browser.config.languageRegion === 'zh-cn') expectedDateFormat = '2016/8/12 21:32'; //Chinese Simplified
    else if (browser.config.languageRegion === 'zh-tw') expectedDateFormat = '2016/8/12 21:32'; //Chinese Traditional
    else if (browser.config.languageRegion === 'ja-jp') expectedDateFormat = '2016/08/12 21:32'; //Japanese
    else if (browser.config.languageRegion === 'ko-kr') expectedDateFormat = '2016.8.12 오후 9:32'; //Korean

    //Get date for the object 'Eastern Region Average Revenue per Customer' on MicroStrategy Tutorial
    //Expected date format '8/12/2016 9:32 PM' on en-us locale
    PluginPopup.searchForObject('Eastern Region Average Revenue per Customer');
    browser.pause(999); // waiting for search to filter the ObjectTable
    PluginPopup.selectFirstObject();
    expect(PluginPopup.getFirstRowDate() === expectedDateFormat).toBe(true);
  });
});
