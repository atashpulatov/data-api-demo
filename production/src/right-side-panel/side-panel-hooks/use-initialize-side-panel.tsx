import { Dispatch, SetStateAction, useEffect } from 'react';

import { formattingSettingsHelper } from '../settings-side-panel/formatting-settings/formatting-settings-helper';
import { pivotTableSettingsHelper } from '../settings-side-panel/pivot-table-settings/pivot-table-settings-helper';
import { settingsSidePanelHelper } from '../settings-side-panel/settings-side-panel-helper';
import { sidePanelEventHelper } from '../side-panel-services/side-panel-event-helper';
import { sidePanelHelper } from '../side-panel-services/side-panel-helper';

const useInitializeSidePanel = (
  setActiveSheetId: Dispatch<SetStateAction<string>>,
  isAnyPopupOrSettingsDisplayedRef: React.MutableRefObject<boolean>
): void => {
  useEffect(() => {
    async function initializeSettings(): Promise<void> {
      await settingsSidePanelHelper.initReusePromptAnswers();
      await settingsSidePanelHelper.initPageByDisplayAnswers();
      await settingsSidePanelHelper.initWorksheetNamingAnswers();
      await settingsSidePanelHelper.initObjectInfoSettings();
      await settingsSidePanelHelper.initDataAutoRefreshSetting();
      await formattingSettingsHelper.initImportFormattingSettings();
      await pivotTableSettingsHelper.initPivotTableSettings();
      sidePanelHelper.clearRepromptTask();
      sidePanelHelper.initializeClearDataFlags();
    }

    initializeSettings();
  }, []);

  useEffect(() => {
    async function initializeListeners(): Promise<void> {
      await sidePanelEventHelper.addRemoveObjectListener();
      await sidePanelEventHelper.initObjectWorksheetTrackingListeners();
      await sidePanelEventHelper.initActiveSelectionChangedListener(
        setActiveSheetId,
        isAnyPopupOrSettingsDisplayedRef
      );
    }

    initializeListeners();
  }, [setActiveSheetId, isAnyPopupOrSettingsDisplayedRef]);
};

export default useInitializeSidePanel;
