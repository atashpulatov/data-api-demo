import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForSuccessNotification } from '../../../helpers/utils/wait-helper';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('Smart Folder - IMPORT -', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
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


    // // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.openPrompt(o.reports.valueDayPromptReport);
    // PluginPopup.writeValueText('07/07/2015\uE004\uE004'); // function presses tab only once for re-prompt to work

    // // should re-prompt a report
    // waitForNotification();
    // OfficeWorksheet.selectCell('A1');
    // const oldCellA1 = $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    // PluginRightPanel.repromptFirstObjectFromTheList();
    // browser.pause(5555);
    // PluginPopup.writeValueText('09/09/2016\uE004');
    // waitForNotification();
    // expect($(se.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    // OfficeWorksheet.selectCell('A1');
    // const newCellA1 = $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    // expect(oldCellA1).not.toEqual(newCellA1);

    // should click prepare data on selected report
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // switchToPluginFrame();
    // PluginPopup.preparePrompt(o.reports.numericPromptedReport);
    // browser.pause(2222);


    // PluginRightPanel.clickImportDataButton();
    // switchToPluginFrame();
    // PluginPopup.searchForObject('Basic Report (Cat, Subcat, Item ; Profit, Revenue)');
    // PluginPopup.selectFirstObject();
    // PluginPopup.clickPrepareData();

    // // // should select one metric from many listed
    // PluginPopup.selectFilters([['Region', ['Central', 'South']]]);

    // PluginRightPanel.clickImportDataButton();
    // switchToPluginFrame();
    // browser.pause(1000);
    // PluginPopup.clickHeader('Modified');

    // PluginPopup.deleteFromSearch();

    // /////////

    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.openPrompt(o.reports.metricExpPromptedReport);
    // waitAndClick($('div[title="- none -"]'));
    // waitAndClick($('div[title="Revenue"]'));
    // $(s.promptTextBox).setValue('1000\uE004\uE004\uE004\uE006');

    // waitForNotification();
    // OfficeWorksheet.selectCell('D2');
    // const oldCellD2 = $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    // PluginRightPanel.repromptFirstObjectFromTheList();
    // browser.pause(5555);
    // PluginPopup.writeAttrQualificationValue(10000);

    // //////////////

    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.openPrompt(o.reports.multiplePromptsReport);
    // PluginPopup.writeMultiPrompt('07/07/2015\uE004\uE004');

    // //////////////
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.openPrompt(o.reports.attributePromptedReport);
    // waitAndClick($('.mstrBGIcon_tbAdd'));
    // PluginPopup.clickRun();
    // waitForNotification();

    // browser.pause(5555);
    // PluginRightPanel.repromptFirstObjectFromTheList();
    // browser.pause(5555);
    // PluginPopup.removeAllSelected();
    // PluginPopup.promptSelectObject('Music');


    // /////////////////////////////////

    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.importPromptDefault(o.reports.hierarchyExpPromptedReport);

    // browser.pause(2222);
    // waitForNotification();
    // OfficeWorksheet.selectCell('A1');
    // const oldCellC2 = $('#gridRows > div:nth-child(2) > div:nth-child(3) > div > div').getText();
    // PluginRightPanel.repromptFirstObjectFromTheList();
    // browser.pause(5555);
    // PluginPopup.changeExpressionQualificationAndRun('Not In List');

    // ///////////////////////

    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.importPromptDefaultNested(o.reports.nestedPrompt);

    // ///////////////////

    // OfficeWorksheet.selectCell('A1048576');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.importObject(o.reports.reportXML);
    // waitForNotification();
    // PluginRightPanel.closeNotification();

    // ///////////////////////

    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.importObject(o.reports.secureDataFiltering);
    // waitForNotification();

    // switchToPluginFrame();
    // PluginRightPanel.clickSettings();
    // PluginRightPanel.clearData();
    // browser.pause(4000);

    // // should log out
    // switchToPluginFrame();
    // PluginRightPanel.clickSettings();
    // PluginRightPanel.clickLogout();

    // // should log in with Tim user
    // PluginRightPanel.loginToPlugin('a', '');

    // // should click "View Data" and close the "Refresh All Data" pop-up
    // switchToPluginFrame();
    // PluginRightPanel.viewDataBtn();
    // ///////////////////

    // should import a report
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(objectsList.reports.reportXML, 1); // importObject(objectsList.reports.reportXML)
    // waitForNotification();
    // waitForSuccessNotification();
    waitForNotification();
    PluginRightPanel.hoverOnOjbectToCloseNotification();
    browser.pause(1000);
    OfficeWorksheet.selectCell('J1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.blankReport);
    waitForNotification(); waitForNotification();


    pluginRightPanel.closeNotification();
    // waitForSuccessNotification();
    // PluginRightPanel.hoverOnOjbectToCloseNotification();


    // // should import a dataset to the adjacent column of the first object
    // OfficeWorksheet.selectCell('A20');
    //  PluginRightPanel.clickAddDataButton();
    //  PluginPopup.importObject(o.datasets.datasetSQL);
    //  waitForNotification();

    // // should import a report to the adjacent row of the second object
    //  OfficeWorksheet.selectCell('F20');
    //  PluginRightPanel.clickAddDataButton();
    //  PluginPopup.importObject(o.reports.reportXML);
    //  waitForNotification();

    // // should import a dataset to a cell not adjacent to any imported objects
    //  OfficeWorksheet.selectCell('J1');
    //  PluginRightPanel.clickAddDataButton();
    //  PluginPopup.importObject(o.datasets.datasetSQL);
    //  waitForNotification();

    //  switchToPluginFrame();
    // const objects =  $$(se.importedObjectList);
    // const objectNames =  $$(se.importedObjectNameList);

    // // should hover over objects in the right panel
    // browser.pause(5000);
    //  PluginRightPanel.hoverOverObjects(objects);

    // // should hover over object names in the right panel
    //  PluginRightPanel.hoverOverObjectNames(objectNames);

    // should click on objects in the right panel
    //  PluginRightPanel.clickOnObject(objects[0], 'J1');
    //  PluginRightPanel.clickOnObject(objects[1], 'F20');
    //  PluginRightPanel.clickOnObject(objects[2], 'A20');
    //  PluginRightPanel.clickOnObject(objects[3], 'A1');

    // //////////////////////
    browser.pause(5000);
  });
});
