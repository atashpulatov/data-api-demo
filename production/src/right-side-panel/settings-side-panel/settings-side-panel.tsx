import React from 'react';
import { useSelector } from 'react-redux';
import { Settings, SettingsPanel, SettingsSection } from '@mstr/connector-components';

import { settingsSidePanelHelper } from './settings-side-panel-helper';

import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { settingsReducerSelectors } from '../../redux-reducer/settings-reducer/settings-reducer-selectors';

const SettingsSidePanel: React.FC<any> = () => {
  const isSidePanelLoaded = useSelector(officeSelectors.selectIsSettingsPanelLoaded);
  const reusePromptAnswers = useSelector(officeSelectors.selectReusePromptAnswers);
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

  const { getPromptSection, getObjectInfoSection } = settingsSidePanelHelper;
  const settingsSections: SettingsSection[] = [
    getPromptSection(reusePromptAnswers),
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
