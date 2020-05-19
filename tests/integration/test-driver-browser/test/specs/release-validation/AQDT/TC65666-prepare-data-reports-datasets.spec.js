import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToDialogFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { excelSelectors } from '../../../constants/selectors/office-selectors';

describe('Personal TC for AQDT Mirror2', () => {

  it('[TC65666] AQDT E2E - Prepare Data for reports and datasets', () => {
    const A2 = '#gridRows > div:nth-child(2) > div:nth-child(1) > div > div';
    const { tcAutomation } = objectsList.aqdtMirror2Objects;

    OfficeWorksheet.selectCell('A1');
    console.log('Should import prompted report');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(tcAutomation, false);

    switchToDialogFrame();
    console.log('Should sort attributes and metrics');
    const sortAttributeSelector = $(popupSelectors.sortAttributes);
    const attributeContainer = $(popupSelectors.attributesContainer);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);
    const metricsContainer = $(popupSelectors.metricsContainer);
    const sortFiltersSelector = $(popupSelectors.sortFilters);
    const filterContainer = $(popupSelectors.filtersContainer);

    console.log('Should sort ascending');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Date (Test Case Result)');
    console.log('Should sort decending');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Test Case Type');
    console.log('Should sort default');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Test Case Owner');

    console.log('Should sort ascending');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Row Count - Last_Verdict');
    console.log('Should sort decending');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Row Count - Tester');
    console.log('Should sort default');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Row Count - Last_Verdict');

    console.log('Should sort ascending');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Date (Test Case Result)');
    console.log('Should sort decending');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Test Case Type');
    console.log('Should sort default');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Test Case Owner');

    PluginPopup.selectAttributesAndAttributeForms({ 'Test Case Owner': ['Synonym 1', 'Synonym 2', 'Synonym 3', 'ID'] });



    PluginPopup.selectFilters([['Test Case Owner', []]]);

    PluginPopup.searchForElements('326610459064');
    PluginPopup.selectFilterInstance(['326610459064']);
    PluginPopup.clearElementSearchWithBackspace();
    PluginPopup.selectAttributeFormVisualisation('Show attribute name once');
    PluginPopup.selectAllMetrics();

    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    switchToExcelFrame();
    OfficeWorksheet.selectCell('A2');
    expect($(A2).getText()).toEqual('Sonia Lukaszewicz');
    browser.pause(1000);

    console.log('Duplicate and edit report');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    PluginPopup.selectObjectElements(['Test Case Status', 'Test Case Method', 'Date (Test Case Result)']);
    PluginPopup.selectFilters([['Test Case Status', ['Active']]]);
    PluginPopup.selectAttributeFormVisualisation('On');
    PluginPopup.clickSubtotalToggler();
    expect($(popupSelectors.subtotalToggler).getAttribute('aria-checked')).toEqual('false');
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();


    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    // PluginRightPanel.closeNotificationOnHover();

    // console.log('Should refresh prompted report');
    // PluginRightPanel.refreshFirstObjectFromTheList();
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    // PluginRightPanel.closeNotificationOnHover();
  });
});
