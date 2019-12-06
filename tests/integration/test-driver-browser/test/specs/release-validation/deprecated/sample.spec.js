import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import {switchToPluginFrame} from '../../../pageObjects/utils/iframe-helper';
import {writeDataIntoFile, getJsonData} from '../../../pageObjects/utils/benchmark-helper';
import { objects as o} from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../pageObjects/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('Smart Folder - IMPORT -', function() {

  beforeAll( () => {
    browser.setWindowSize(2200,900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin('a', '');
  });

  afterAll( () => {
    browser.closeWindow();
    const handles =  browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Import object (1st time)', () => {
    // should import a report in the first sheet and log the E2E time
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.importObject(o.reports.reportXML);
    // waitForNotification();
    // expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // // should refresh all
    // PluginRightPanel.refreshAll();
    // waitForPopup();
    // const refreshedObjects = $$('.report-name');
    // expect(refreshedObjects.length).toEqual(1);
    // browser.pause(4444);


    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrompt(o.reports.valueDayPromptReport);
    PluginPopup.writeValueText('07/07/2015\uE004\uE004'); // function presses tab only once for re-prompt to work

    // should re-prompt a report
    // await waitForNotification();
    // await OfficeWorksheet.selectCell('A1');
    // const oldCellA1 = await $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    // await PluginRightPanel.repromptFirstObjectFromTheList();
    // await browser.sleep(5555);
    // await PluginPopup.writeValueText('9/9/2016\uE004');
    // await waitForNotification();
    // await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    // await OfficeWorksheet.selectCell('A1');
    // const newCellA1 = await $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    // await expect(oldCellA1).not.toEqual(newCellA1);



  });
});

