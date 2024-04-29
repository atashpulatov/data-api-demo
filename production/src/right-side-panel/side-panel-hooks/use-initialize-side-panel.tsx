import { useEffect } from 'react';

import { formattingSettingsHelper } from '../settings-side-panel/formatting-settings/formatting-settings-helper';
import { settingsSidePanelHelper } from '../settings-side-panel/settings-side-panel-helper';
import { sidePanelEventHelper } from '../side-panel-services/side-panel-event-helper';
import { sidePanelHelper } from '../side-panel-services/side-panel-helper';

const useInitializeSidePanel = (updateActiveCellAddress?: (cellAddress: string) => void): void => {
  useEffect(() => {
    async function initializeSidePanel(): Promise<void> {
      await sidePanelEventHelper.addRemoveObjectListener();
      await sidePanelEventHelper.initializeActiveCellChangedListener(updateActiveCellAddress);
      await settingsSidePanelHelper.initReusePromptAnswers();
      await settingsSidePanelHelper.initPageByDisplayAnswers();
      await settingsSidePanelHelper.initWorksheetNamingAnswers();
      await settingsSidePanelHelper.initObjectInfoSettings();
      await formattingSettingsHelper.initImportFormattingSettings();
      sidePanelHelper.clearRepromptTask();
      sidePanelHelper.initializeClearDataFlags();
    }

    initializeSidePanel();
  }, [updateActiveCellAddress]);
};

export default useInitializeSidePanel;
