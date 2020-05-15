import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';

describe('Personal TC for AQDT Mirror2', () => {

  it('[TC65666] AQDT E2E - Prepare Data for reports and datasets', () => {
    const { tcAutomation } = objectsList.aqdtMirror2Objects;

    console.log('Should import prompted report');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(tcAutomation, false);

    switchToPluginFrame();
    browser.pause(5555); // temp solution
    console.log('Should sort attributes and metrics');
    const sortAttributeSelector = $(popupSelectors.sortAttributes);
    const sortMetricsSelector = $(popupSelectors.sortMetrics);
    const sortFiltersSelector = $(popupSelectors.sortFilters);

    waitAndClick(sortAttributeSelector);
    waitAndClick(sortMetricsSelector);
    waitAndClick(sortFiltersSelector);

    PluginPopup.searchForElements('Test Case Owner');

    // PluginPopup.clickRun();
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
