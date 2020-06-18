import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import { switchToExcelFrame } from '../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../constants/selectors/popup-selectors';
import { objectsList } from '../../constants/objects-list';

describe('F24751 - Import report with or without subtotals', () => {
  it('[TC53340] - Set subtotals toggle ON during import report with subtotals', () => {
    // step0 - open plugin
    OfficeLogin.openExcelAndLoginToPlugin();

    // step1 - press import data button
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);

    // step2 + step3 + step4 - turn my library toggle off, select a report with subtotals press prepare data
    PluginPopup.openPrepareData(objectsList.reports.basicSubtotalsReport, false);

    // step5 - select all metrics and all attributes
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    expect($(popupSelectors.subtotalToggler).getAttribute('aria-checked')).toEqual('true');

    // step6 - click import
    PluginPopup.clickImport();

    // step7 - data imported
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    switchToExcelFrame();
    const B13 = $('#gridRows > div:nth-child(13) > div:nth-child(2) > div > div');
    expect(B13.getText()).toEqual('Total');
    // TODO: expect(OfficeWorksheet.checkIfCellIsBolded('C13')).toEqual(true);
    const C13 = $('#gridRows > div:nth-child(13) > div:nth-child(3) > div > div');
    expect(C13.getText()).toEqual('$1,009,131');
  });
});
