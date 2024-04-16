import React from 'react';
import { useSelector } from 'react-redux';
import { Settings, SettingsPanel, SettingsSection } from '@mstr/connector-components';

import { settingsSidePanelHelper } from './settings-side-panel-helper';

import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';

const SettingsSidePanel: React.FC<any> = () => {
  const reusePromptAnswers = useSelector(officeSelectors.selectReusePromptAnswers);

  const settingsSections: SettingsSection[] = [
    settingsSidePanelHelper.getPromptSection(reusePromptAnswers),
  ];

  return (
    <Settings
      handleToggleSettingsPanel={settingsSidePanelHelper.toggleSettingsPanel}
      settingsChildren={<SettingsPanel sections={settingsSections} />}
    />
  );
};

export default SettingsSidePanel;
