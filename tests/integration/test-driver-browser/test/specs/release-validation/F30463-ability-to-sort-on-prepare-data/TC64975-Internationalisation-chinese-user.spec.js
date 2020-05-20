import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import settings from '../../../config';

describe('[F30463 - Ability to sort attributes and metrics on Prepare Data screen in Excel (Citibank)', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin(settings.env.chineseSimplifiedUser);
  });

  afterEach(() => {
    browser.closeWindow();
  });

  it(`[TC64975] Sort on prepare data for chinese user `, () => {
    switchToRightPanelFrame();
    OfficeWorksheet.selectCell('A3');

    console.log('Open Prepare Data');
    pluginRightPanel.clickImportDataButton();
    const report = objectsList.reports.reportToSortAttributeAndMetrics;
    pluginPopup.openPrepareData(report, false);

    switchToPluginFrame();
    console.log('Sort for attributes');
    const attributeContainer = $(popupSelectors.attributesContainer);
    const sortAttributeSelector = $(popupSelectors.sortAttributes);
    console.log('All attributes default sort');
    expect(attributeContainer.$$('li')[0].getText()).toEqual('年龄范围');
    console.log('All attributes ascending sort');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('Customer Latitude');
    console.log('All attributes descending sort');
    waitAndClick(sortAttributeSelector);
    expect(attributeContainer.$$('li')[0].getText()).toEqual('首个订单日期');
    console.log('Back to default sort');
    waitAndClick(sortAttributeSelector);

    console.log('sort for Metrics');
    const metricsContainer = $(popupSelectors.metricsContainer);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);
    console.log('All metrics default sort');
    expect(metricsContainer.$$('div')[0].getText()).toEqual('平均收入');
    console.log('All metrics ascending sort');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('Profit Per Year');
    console.log('All metrics descending sort');
    waitAndClick(sortMetricsSelector);
    expect(metricsContainer.$$('div')[0].getText()).toEqual('随机数');
    console.log('Back to default sort');
    waitAndClick(sortMetricsSelector);

    console.log('sort for Filters');
    const filterContainer = $(popupSelectors.filtersContainer);
    const sortFiltersSelector = $(popupSelectors.sortFilters);
    console.log('All filters default sort');
    expect(filterContainer.$$('li')[0].getText()).toEqual('年龄范围');
    console.log('All filters ascending sort');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('Customer Latitude');
    console.log('All filters descending sort');
    waitAndClick(sortFiltersSelector);
    expect(filterContainer.$$('li')[0].getText()).toEqual('首个订单日期');
    console.log('Back to default sort');
    waitAndClick(sortFiltersSelector);
  });
});
