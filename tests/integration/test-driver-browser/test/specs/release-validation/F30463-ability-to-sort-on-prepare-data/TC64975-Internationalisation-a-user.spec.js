import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('[F30463] Ability to sort on prepare data', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  // Create test for each visType defined in visualizations
  it(`[TC64975] sort on prepare data for a user) `, () => {
    switchToRightPanelFrame();
    OfficeWorksheet.selectCell('A3');

    // Open prepare data
    pluginRightPanel.clickImportDataButton();
    const report = objectsList.reports.reportToSortAttributeAndMetrics;
    pluginPopup.openPrepareData(report, false);

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
  });
});
