import React from 'react';
import { useSelector } from 'react-redux';
import { Settings, SettingsPanel, SettingsSection } from '@mstr/connector-components';

import { formattingSettingsHelper } from './formatting-settings/formatting-settings-helper';
import { pivotTableSettingsHelper } from './pivot-table-settings/pivot-table-settings-helper';
import { settingsSidePanelHelper } from './settings-side-panel-helper';

import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { settingsReducerSelectors } from '../../redux-reducer/settings-reducer/settings-reducer-selectors';

const SettingsSidePanel: React.FC<any> = () => {
  const isSidePanelLoaded = useSelector(officeSelectors.selectIsSettingsPanelLoaded);
  const reusePromptAnswers = useSelector(officeSelectors.selectReusePromptAnswers);
  const objectAndWorksheetNamingSetting = useSelector(
    settingsReducerSelectors.selectObjectAndWorksheetNamingSetting
  );
  const pageByDisplaySetting = useSelector(settingsReducerSelectors.selectPageByDisplaySetting);
  const sidePanelObjectInfoSettings = useSelector(
    settingsReducerSelectors.selectSidePanelObjectInfoSettings
  );
  const sidePanelMainSwitchValue = useSelector(
    settingsReducerSelectors.selectSidePanelMainSwitchValue
  );
  const worksheetObjectInfoSettings = useSelector(
    settingsReducerSelectors.selectWorksheetObjectInfoSettings
  );
  const worksheetMainSwitchValue = useSelector(
    settingsReducerSelectors.selectWorksheetMainSwitchValue
  );
  const enableDataAutoRefresh = useSelector(settingsReducerSelectors.selectEnableDataAutoRefresh);

  const importAttributesAsText = useSelector(settingsReducerSelectors.selectImportAttributesAsText);

  const mergeCrosstabColumns = useSelector(settingsReducerSelectors.selectMergeCrosstabColumns);

  const defaultImportType = useSelector(settingsReducerSelectors.selectImportType);

  const pivotTableAddAttributesToColumns = useSelector(
    settingsReducerSelectors.selectPivotTableAddAttributesToColumns
  );

  const pivotTableAddMetricsToValues = useSelector(
    settingsReducerSelectors.selectPivotTableAddMetricsToValues
  );

  const { getPromptSection, getObjectInfoSection, getPageBySection, getAutoRefreshSection } =
    settingsSidePanelHelper;

  const { getImportFormattingSection } = formattingSettingsHelper;

  const { getPivotTableSection } = pivotTableSettingsHelper;

  const settingsSections: SettingsSection[] = [
    getImportFormattingSection(importAttributesAsText, mergeCrosstabColumns, defaultImportType),
    getPromptSection(reusePromptAnswers),
    getPageBySection(objectAndWorksheetNamingSetting, pageByDisplaySetting),
    getObjectInfoSection(
      sidePanelObjectInfoSettings,
      worksheetObjectInfoSettings,
      sidePanelMainSwitchValue,
      worksheetMainSwitchValue
    ),
    getPivotTableSection(pivotTableAddAttributesToColumns, pivotTableAddMetricsToValues),
    getAutoRefreshSection(enableDataAutoRefresh),
  ];

  return (
    <Settings
      handleToggleSettingsPanel={() =>
        settingsSidePanelHelper.toggleSettingsPanel(isSidePanelLoaded)
      }
      settingsChildren={<SettingsPanel sections={settingsSections} />}
    />
  );
};

export default SettingsSidePanel;
