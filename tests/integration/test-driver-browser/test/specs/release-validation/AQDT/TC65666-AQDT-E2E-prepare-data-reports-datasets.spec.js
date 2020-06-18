import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToDialogFrame, switchToExcelFrame, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('Personal TC for AQDT Mirror2', () => {
  it('[TC65666] AQDT E2E - Prepare Data for reports and datasets', () => {
    const A2 = '#gridRows > div:nth-child(2) > div:nth-child(1) > div > div';
    const { tcAutomation } = objectsList.aqdtMirror2Objects;
    const { pdCube } = objectsList.aqdtMirror2Objects;
    const { importSuccess, duplicateSucces, objectRemoved } = dictionary.en;

    OfficeWorksheet.selectCell('A1');
    logStep(`Should import ${tcAutomation}`);
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(tcAutomation, false);

    logStep('+ Sort attributes, metrics and filters');
    const sortAttributeSelector = $(popupSelectors.sortAttributes);
    const attributeContainer = $(popupSelectors.attributesContainer);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);
    const metricsContainer = $(popupSelectors.metricsContainer);
    const sortFiltersSelector = $(popupSelectors.sortFilters);
    const filterContainer = $(popupSelectors.filtersContainer);

    logStep('Should sort attributes ascending');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Date (Test Case Result)');
    logStep('Should sort attributes decending');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Test Case Type');
    logStep('Should sort attributes default');
    browser.pause(2000);
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Test Case Owner');

    logStep('Should sort metrics ascending');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Row Count - Last_Verdict');
    logStep('Should sort metrics decending');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Row Count - Tester');
    logStep('Should sort metrics default');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Row Count - Last_Verdict');

    logStep('Should sort filters ascending');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Date (Test Case Result)');
    logStep('Should sort filters decending');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Test Case Type');
    logStep('Should sort filters default');
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
    PluginRightPanel.waitAndCloseNotification(importSuccess);

    switchToExcelFrame();
    OfficeWorksheet.selectCell('A2');
    expect($(A2).getText()).toEqual('Sonia Lukaszewicz');
    browser.pause(1000);

    logStep('Duplicate and edit report');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    PluginPopup.selectAttributesAndAttributeForms({ 'Test Case Status': [], 'Test Case Method': [], 'Date (Test Case Result)': [] });
    PluginPopup.selectFilters([['Test Case Status', ['Active']]]);
    PluginPopup.selectAttributeFormVisualisation('On');
    PluginPopup.clickSubtotalToggler();
    expect($(popupSelectors.subtotalToggler).getAttribute('aria-checked')).toEqual('false');
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(duplicateSucces);

    OfficeWorksheet.deleteSheet(2);

    PluginRightPanel.waitAndCloseNotification(objectRemoved);

    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${tcAutomation}`);

    logStep(`+Import ${pdCube} sort on 'Modified' header and prepare data to import`);
    OfficeWorksheet.openNewSheet();
    switchToExcelFrame();
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.sortAndOpenPrepareData(pdCube, 'descending', 'Modified');
    PluginPopup.selectObjectElements(['Feature', 'Initiative', 'QA Status', 'SE Status']);
    PluginPopup.selectFilters([['Scrum Team', []]]);

    PluginPopup.searchForElements('Excel');
    PluginPopup.selectFilterInstance(['CT-Application-Excel']);
    PluginPopup.clearElementSearchWithBackspace();
    browser.pause(1111);

    logStep('+ Sort attributes, metrics and filters');
    logStep('Should sort attributes ascending');
    waitAndClick(sortAttributeSelector);
    const attributesContainerForDataset = $(popupSelectors.attributesContainerForDataset);
    expect(attributesContainerForDataset.$$('div')[0].getText()).toEqual('Area (Timesheet)');
    logStep('Should sort attributes decending');
    waitAndClick(sortAttributeSelector);
    expect(attributesContainerForDataset.$$('div')[0].getText()).toEqual('Work Item Work Type');
    logStep('Should sort attributes default');
    waitAndClick(sortAttributeSelector);
    expect(attributesContainerForDataset.$$('div')[0].getText()).toEqual('Feature');

    logStep('Should sort metrics ascending');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('(Feature level) Percentdonebystorycount');
    logStep('Should sort metrics decending');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('WorkItemPoints');
    logStep('Should sort metrics default');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('QA Status');

    logStep('Should sort filters ascending');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Area (Timesheet)');
    logStep('Should sort filters decending');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Work Item Work Type');
    logStep('Should sort filters default');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Feature');

    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    PluginRightPanel.removeAllObjectsFromTheList();
    PluginRightPanel.waitAndCloseAllNotifications(dictionary.en.objectRemoved);
  });
});
