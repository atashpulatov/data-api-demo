import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

const ELLIPSIS = '...';

/**
 * Check if the tooltip for the element is correct.
 * If the displayed text for the element is:
 * - not ellipsized, the tooltip should be 'Click to copy'
 * - ellipsized, the tooltip should show the full text for the element
 *
 * @param {String} displayed actual text for the element in details table
 * @param {String} tooltip text displayed in the tooltip for the element
 * @returns {Boolean} true if tooltip is correct, false otherwise
 */
function isTooltipCorrect(displayed, tooltip) {
  const ellipsisIndex = displayed.indexOf(ELLIPSIS);
  if (ellipsisIndex === -1) {
    return tooltip === dictionary.en.clickToCopy;
  }

  const [start, end] = displayed.split(ELLIPSIS);
  return tooltip.substring(0, ellipsisIndex) === start
      && tooltip.substring(tooltip.length - end.length) === end;
}

describe('F25946 - Display more information about the objects in the objects list', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('TC60112 - [Object Details] Tooltips for details elements', () => {
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    PluginPopup.switchLibrary(false);

    PluginPopup.searchForObject('Report for ellipsis test');
    browser.pause(2000); // wait for search to filter the Object Table

    PluginPopup.expandFirstRows(1);
    const detailsTable = PluginPopup.getDetailsTableByIndex(1);

    const descriptionText = PluginPopup.getDescriptionText(detailsTable);
    const descriptionTooltipText = PluginPopup.getDescriptionTooltipText(detailsTable);
    expect(isTooltipCorrect(descriptionText, descriptionTooltipText)).toBe(true);

    const locationText = PluginPopup.getLocationText(detailsTable);
    const locationTooltipText = PluginPopup.getLocationTooltipText(detailsTable);
    expect(isTooltipCorrect(locationText, locationTooltipText)).toBe(true);
  });
});
