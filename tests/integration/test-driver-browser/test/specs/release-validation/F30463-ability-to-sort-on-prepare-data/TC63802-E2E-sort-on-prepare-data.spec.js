import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame, switchToRightPanelFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { pressEnter } from '../../../helpers/utils/keyboard-actions';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('F30463 - Ability to sort attributes and metrics on Prepare Data screen in Excel (Citibank)', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });


  it(`[TC63802] E2E sort on prepare data) `, () => {
    switchToRightPanelFrame();
    OfficeWorksheet.selectCell('A3');

    logStep(`+ Opening prepare data`);
    pluginRightPanel.clickImportDataButton();
    const report = objectsList.reports.reportToSortAttributeAndMetrics;
    pluginPopup.openPrepareData(report, false);

    switchToPluginFrame();

    logStep(`+ Sorting attributes`);
    const attributeContainer = $(popupSelectors.attributesContainer);
    const sortAttributeSelector = $(popupSelectors.sortAttributes);

    logStep(`+ Default sort for all attributes`);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Age Range');

    logStep(`+ Sort ascending`);
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Age Range');

    logStep(`+ Sort descending`);
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Zip Code');

    logStep(`+ Sort back to default`);
    waitAndClick(sortAttributeSelector);

    logStep(`+ Sorting metrics`);
    const metricsContainer = $(popupSelectors.metricsContainer);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);

    logStep(`+ Default sort for all metrics`);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Average Revenue');

    logStep(`+ Sort ascending`);
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Average Revenue');

    logStep(`+ Sort descending`);
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Sales Rank');

    logStep(`+ Sort back to default`);
    waitAndClick(sortMetricsSelector);

    logStep(`+ Sorting filters`);
    const filterContainer = $(popupSelectors.filtersContainer);
    const sortFiltersSelector = $(popupSelectors.sortFilters);

    logStep(`+ Default sort for all filters`);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Age Range');

    logStep(`+ Sort ascending`);
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Age Range');

    logStep(`+ Sorting descending`);
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Zip Code');

    logStep(`+ Sort back to default`);
    waitAndClick(sortFiltersSelector);

    logStep(`+ Searching for attribute element age`);
    pluginPopup.searchForElements('age');

    logStep(`+ Sorting attributes by keyboard`);
    pluginPopup.pressTabUntilElementIsFocused(sortAttributeSelector);

    logStep(`+ Sort ascending`);
    pressEnter();
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Age Range');

    logStep(`+ Sort descending`);
    pressEnter();
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Phone Usage');

    logStep(`+ Sort back to default`);
    pressEnter();

    logStep(`+ Sorting metrics by keyboard`);
    pluginPopup.pressTabUntilElementIsFocused(sortMetricsSelector);

    logStep(`+ Sort ascending`);
    pressEnter();
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Average Revenue');

    logStep(`+ Sort descending`);
    pressEnter();
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Running Revenue Average');

    logStep(`+ Sort back to default`);
    pressEnter();

    logStep(`+ Sorting for filters by keyboard`);
    pluginPopup.pressTabUntilElementIsFocused(sortFiltersSelector);

    logStep(`+ Sort ascending`);
    pressEnter();
    expect(filterContainer.$$('li')[0].getText()).toEqual('Age Range');

    logStep(`+ Sort descending`);
    pressEnter();
    expect(filterContainer.$$('li')[0].getText()).toEqual('Phone Usage');
    //
    logStep(`+ Sort back to default`);
    pressEnter();

    browser.pause(1111);

    pluginPopup.clearElementSearchWithBackspace();

    browser.pause(1111);

    logStep(`+ Check if attribute forms are changed - default, ascending`);
    waitAndClick(attributeContainer.$$('li')[0]);
    waitAndClick(attributeContainer.$$('li')[0].$$('span')[0]);
    expect(attributeContainer.$$('li')[0].$$('ul')[0].$$('li')[0].getText()).toEqual('DESC');
    waitAndClick(attributeContainer.$$('li')[0].$$('span')[0]);
    waitAndClick(attributeContainer.$$('li')[0]);

    logStep(`+ Check if attribute forms are changed - default, descending`);
    waitAndClick(sortAttributeSelector);
    waitAndClick(sortAttributeSelector);
    browser.pause(999);
    const lengh = attributeContainer.$$('li').length;

    logStep(`+ Scrolling to last element and select it`);
    attributeContainer.$$('li')[lengh - 1].scrollIntoView();
    browser.pause(999);
    waitAndClick(attributeContainer.$$('li')[lengh - 1]);
    waitAndClick(attributeContainer.$$('li')[lengh - 1].$$('span')[0]);
    expect(attributeContainer.$$('li')[lengh - 1].$$('ul')[0].$$('li')[0].getText()).toEqual('DESC');
    waitAndClick(attributeContainer.$$('li')[lengh - 1].$$('span')[0]);
    waitAndClick(attributeContainer.$$('li')[lengh - 1]);
    browser.pause(3000);

    logStep(`+ import report`);
    pluginPopup.selectAllAttributes();
    pluginPopup.selectAllMetrics();
    pluginPopup.selectFilters([['Age Range', ['25 to 34', '35 to 44']]]);
    pluginPopup.clickImport();
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);
  });
});
