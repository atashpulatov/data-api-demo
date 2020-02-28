import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';

describe('F24398 - Import and refresh visualization', () => {
  const { name, timeToOpen, visualizations } = objectsList.dossiers.complexDossier;

  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  it(`[TC53561] import different types of visualisations: bubbleChart, pieChart, comboChart, geospatialService, network`, () => {
    let isFirstReport = true;
    const onlyFiveVisualizations = Object.keys(visualizations).slice(5, 9).map(key => ({ [key]:visualizations[key] }));

    Object.keys(onlyFiveVisualizations).forEach(i => {
      OfficeWorksheet.selectCell('A1');
      if (isFirstReport) {
        PluginRightPanel.clickImportDataButton();
        isFirstReport = false;
      } else {
        PluginRightPanel.clickAddDataButton();
      }
      PluginPopup.openDossier(name, timeToOpen);

      // test
      const visType = Object.keys(onlyFiveVisualizations[i])[0];
      const visSelector = onlyFiveVisualizations[i][visType];
      PluginPopup.selectAndImportVizualiation(visSelector);
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

      // afterEach
      browser.pause(100);
      console.log(`${visType} successfully imported`);
      OfficeWorksheet.openNewSheet();
      browser.pause(1000);
    });
  })
});
