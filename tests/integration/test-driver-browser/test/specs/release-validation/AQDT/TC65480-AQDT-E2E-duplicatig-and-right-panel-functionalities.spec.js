import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';


  it('[TC65480] - AQDT E2E - Duplicatig and Right Panel Functionalities', () => {
    logStep(+ `should import grid visualization`);
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(objectsList.AQDT.owner, 4);
    PluginPopup.goToDossierPageOrChapter(2);
    PluginPopup.selectAndImportVizualiation(objectsList.AQDT.visualization1);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    logStep(+ `should duplicate and edit imported object`);
    OfficeWorksheet.selectCell('H1');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    PluginRightPanel.clickDuplicatePopupEditBtn();
    browser.pause(5555);
    PluginPopup.selectAndImportVizualiation(objectsList.AQDT.visualization2);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep(+ `should duplicate imported object`);
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep(+ `should change name of imported object`);
    PluginRightPanel.changeObjectName(3, 'My own visualization');
    PluginRightPanel.refreshObject(2);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep(+ `should remove imported object`);
    PluginRightPanel.removeFirstObjectFromTheList();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep(+ `should refresh all objects`);
    PluginRightPanel.refreshAll();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep(+ `should logout`);
    PluginRightPanel.logout();
  });
});
