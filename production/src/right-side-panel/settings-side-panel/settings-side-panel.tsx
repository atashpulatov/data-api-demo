import React from 'react';
import { useSelector } from 'react-redux';
import { Settings, SettingsPanel, SettingsSection } from '@mstr/connector-components';

import { formattingSettingsHelper } from './formatting-settings/formatting-settings-helper';
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

  const importAttributesAsText = useSelector(settingsReducerSelectors.selectImportAttributesAsText);

  const mergeCrosstabColumns = useSelector(settingsReducerSelectors.selectMergeCrosstabColumns);

  const { getPromptSection, getObjectInfoSection, getPageBySection } = settingsSidePanelHelper;

  const { getImportFormattingSection } = formattingSettingsHelper;

  const settingsSections: SettingsSection[] = [
    getImportFormattingSection(importAttributesAsText, mergeCrosstabColumns),
    getPromptSection(reusePromptAnswers),
    getPageBySection(objectAndWorksheetNamingSetting, pageByDisplaySetting),
    getObjectInfoSection(
      sidePanelObjectInfoSettings,
      worksheetObjectInfoSettings,
      sidePanelMainSwitchValue,
      worksheetMainSwitchValue
    ),
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
