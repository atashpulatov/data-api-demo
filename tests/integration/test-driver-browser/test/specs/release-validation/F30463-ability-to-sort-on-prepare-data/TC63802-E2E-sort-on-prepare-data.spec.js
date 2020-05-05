import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame, switchToRightPanelFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';

describe('Ability to sort on prepare data', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  // Create test for each visType defined in visualizations
  it(`[TC63802] E2E-sort-on-prepare-data.spec) `, () => {
    switchToRightPanelFrame();
    OfficeWorksheet.selectCell('A3');

    // Open prepare data
    PluginRightPanel.clickImportDataButton();
    const report = objectsList.reports.reportToSortAttributeAndMetrics;
    PluginPopup.openPrepareData(report, false);

    switchToPluginFrame();

    // sort for Attributes
    const attributeContainer = $(popupSelectors.attributesContainer);
    const sortAttributeSelector = $(popupSelectors.sortAttributes);

    // All attributes Default sort
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Age Range');

    // All attributes Ascending sort
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Age Range');

    // All attributes Descending sort
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Zip Code');

    // Back to default sort
    waitAndClick(sortAttributeSelector);

    // sort for Metrics
    const metricsContainer = $(popupSelectors.metricsContainer);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);

    // All metrics Default sort
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Average Revenue');

    // All metrics Ascending sort
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Average Revenue');

    // All metrics Descending sort
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Sales Rank');

    // Back to default sort
    waitAndClick(sortMetricsSelector);

    // sort for Filters
    const filterContainer = $(popupSelectors.filtersContainer);
    const sortFiltersSelector = $(popupSelectors.sortFilters);

    // All filters Default sort
    expect(filterContainer.$$('li')[0].getText()).toEqual('Age Range');

    // All filters Ascending sort
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Age Range');

    // All filters Descending sort
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Zip Code');

    // Back to default sort
    waitAndClick(sortFiltersSelector);

    pluginPopup.searchForElements('age');
    // Sort for attributes by keyboard
    PluginPopup.pressTabUntilElementIsFocused(sortAttributeSelector);
    // Sort ascending
    browser.keys('\uE007'); // Press Enter
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Age Range');
    // Sort descending
    browser.keys('\uE007'); // Press Enter
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Phone Usage');
    // Back to normal sort attributes
    browser.keys('\uE007'); // Press Enter

    // Sort for metrics by keyboard
    PluginPopup.pressTabUntilElementIsFocused(sortMetricsSelector);
    // Sort ascending
    browser.keys('\uE007'); // Press Enter
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Average Revenue');
    // Sort descending
    browser.keys('\uE007'); // Press Enter
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Running Revenue Average');
    // Back to normal sort metrics
    browser.keys('\uE007'); // Press Enter

    // Sort for filters by keyboard
    PluginPopup.pressTabUntilElementIsFocused(sortFiltersSelector);
    // Sort ascending
    browser.keys('\uE007'); // Press Enter
    expect(filterContainer.$$('li')[0].getText()).toEqual('Age Range');
    // Sort descending
    browser.keys('\uE007'); // Press Enter
    expect(filterContainer.$$('li')[0].getText()).toEqual('Phone Usage');
    // Back to normal sort filters
    browser.keys('\uE007'); // Press Enter

    browser.pause(1111);

    pluginPopup.clearElementSearchWithBackspace();

    browser.pause(1111);

    // Check if attribute forms are changed - default, ascending
    waitAndClick(attributeContainer.$$('li')[0]);
    waitAndClick(attributeContainer.$$('li')[0].$$('span')[0]);
    expect(attributeContainer.$$('li')[0].$$('ul')[0].$$('li')[0].getText()).toEqual('DESC');
    waitAndClick(attributeContainer.$$('li')[0].$$('span')[0]);
    waitAndClick(attributeContainer.$$('li')[0]);

    // Check if attribute forms are changed - descending
    waitAndClick(sortAttributeSelector);
    waitAndClick(sortAttributeSelector);
    const lengh = attributeContainer.$$('li').length;
    waitAndClick(attributeContainer.$$('li')[lengh - 1]);
    waitAndClick(attributeContainer.$$('li')[lengh - 1].$$('span')[0]);
    expect(attributeContainer.$$('li')[lengh - 1].$$('ul')[0].$$('li')[0].getText()).toEqual('DESC');
    waitAndClick(attributeContainer.$$('li')[lengh - 1].$$('span')[0]);
    waitAndClick(attributeContainer.$$('li')[lengh - 1]);
    browser.pause(3000);

    // Import report
    pluginPopup.selectAllAttributes();
    pluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Age Range', ['25 to 34', '35 to 44']]]);
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);
  });
});
