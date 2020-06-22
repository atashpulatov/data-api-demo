import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep, logFirstStep, logEndStep } from '../../../helpers/utils/allure-helper';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';

describe('US262640: E2E Test Case Automation for AQDT Environment', () => {
  it('[TC65480] - AQDT E2E - Duplicatig and Right Panel Functionalities', () => {
    logFirstStep('+ Should import grid visualization');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(objectsList.AQDT.owner, 4);
    PluginPopup.goToDossierPageOrChapter(2);
    switchToDialogFrame();
    PluginPopup.selectAndImportVisualization(objectsList.AQDT.visualization1);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ Should duplicate and edit imported object');
    OfficeWorksheet.selectCell('H1');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    PluginRightPanel.clickDuplicatePopupEditBtn();
    browser.pause(5555);
    PluginPopup.selectAndImportVisualization(objectsList.AQDT.visualization2);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ Should duplicate imported object');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ Should change name of imported object');
    PluginRightPanel.changeObjectName(3, 'My own visualization');
    PluginRightPanel.refreshObject(2);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ Should remove imported object');
    PluginRightPanel.removeFirstObjectFromTheList();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should refresh all objects');
    PluginRightPanel.refreshAll();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logEndStep('+ Should logout');
    PluginRightPanel.logout();
  });
});
