import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F25943 - refresh move to add-in side panel and removal of blocking behavior', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59003] - show action buttons on hover, select objects for batch actions', () => {
    console.log('import first object');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.clickHeader('Owner');
    PluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('duplicate first object');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();

    console.log('import a prompted report');
    OfficeWorksheet.selectCell('P1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importPromptDefaultNested(objectsList.reports.nestedPrompt);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('check if icon bar is not visible');
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getIconBar(2))).toBe(false);
    console.log('check if number of imported objects in UI is equal to 3');
    expect($(rightPanelSelectors.importedData).getText()).toContain('3');

    console.log('hover over the third object');
    $(rightPanelSelectors.getObjectSelector(3)).moveTo();
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getDuplicateBtnForObject(3))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getEdithBtnForObject(3))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRefreshBtnForObject(3))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRemoveBtnForObject(3))).toBe(true);

    console.log('hover over individual action icons');
    $(rightPanelSelectors.getObjectSelector(1)).moveTo();
    expect(PluginRightPanel.getIconBarTooltipText(1, 1)).toContain('Duplicate');
    expect(PluginRightPanel.getIconBarTooltipText(1, 2)).toContain('Edit');
    expect(PluginRightPanel.getIconBarTooltipText(1, 3)).toContain('Refresh');
    expect(PluginRightPanel.getIconBarTooltipText(1, 4)).toContain('Remove');

    console.log('check if all objects have checkboxes displayed');
    expect($(rightPanelSelectors.getObjectCheckbox(1)).isDisplayed()).toBe(true);
    expect($(rightPanelSelectors.getObjectCheckbox(2)).isDisplayed()).toBe(true);
    expect($(rightPanelSelectors.getObjectCheckbox(3)).isDisplayed()).toBe(true);

    console.log('click master checkbox to select all objects');
    PluginRightPanel.clickMasterCheckbox();
    expect($(rightPanelSelectors.getObjectCheckbox(1)).getAttribute('aria-checked')).toBe('true');
    expect($(rightPanelSelectors.getObjectCheckbox(2)).getAttribute('aria-checked')).toBe('true');
    expect($(rightPanelSelectors.getObjectCheckbox(3)).getAttribute('aria-checked')).toBe('true');

    console.log('click master checkbox to deselect selected objects');
    PluginRightPanel.clickMasterCheckbox();
    expect($(rightPanelSelectors.getObjectCheckbox(1)).getAttribute('aria-checked')).toBe('false');
    expect($(rightPanelSelectors.getObjectCheckbox(2)).getAttribute('aria-checked')).toBe('false');
    expect($(rightPanelSelectors.getObjectCheckbox(3)).getAttribute('aria-checked')).toBe('false');

    console.log('select a single object from the right side panel');
    PluginRightPanel.clickObjectCheckbox(1);
    expect($(rightPanelSelectors.checkBoxAll).getAttribute('aria-checked')).toBe('false');
    expect($(rightPanelSelectors.checkBoxAll).getAttribute('class')).toBe('checkbox-cell active');

    console.log('check if refreshAll and removeAll buttons are visible');
    expect($(rightPanelSelectors.refreshAllBtn).isDisplayed()).toBe(true);
    expect($(rightPanelSelectors.deleteAllBtn).isDisplayed()).toBe(true);

    console.log('check if refreshAll and removeAll buttons have correct tooltips');
    expect(PluginRightPanel.getMasterIconBarTooltipText(1)).toContain('Refresh');
    expect(PluginRightPanel.getMasterIconBarTooltipText(2)).toContain('Remove');
  });
});
