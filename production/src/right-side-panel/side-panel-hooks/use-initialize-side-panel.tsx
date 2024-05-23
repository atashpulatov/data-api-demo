import { Dispatch, SetStateAction, useEffect } from 'react';

import { formattingSettingsHelper } from '../settings-side-panel/formatting-settings/formatting-settings-helper';
import { pivotTableSettingsHelper } from '../settings-side-panel/pivot-table-settings/pivot-table-settings-helper';
import { settingsSidePanelHelper } from '../settings-side-panel/settings-side-panel-helper';
import { sidePanelEventHelper } from '../side-panel-services/side-panel-event-helper';
import { sidePanelHelper } from '../side-panel-services/side-panel-helper';

const useInitializeSidePanel = (
  updateActiveCellAddress: (cellAddress: string) => void,
  setActiveSheetIndex: Dispatch<SetStateAction<number>>,
  isAnyPopupOrSettingsDisplayedRef: React.MutableRefObject<boolean>
): void => {
  // Assign most event listeners and initialize settings
  useEffect(() => {
    async function initializeSidePanel(): Promise<void> {
      await sidePanelEventHelper.addRemoveObjectListener();
      await sidePanelEventHelper.initObjectWorksheetTrackingListeners();
      await settingsSidePanelHelper.initReusePromptAnswers();
      await settingsSidePanelHelper.initPageByDisplayAnswers();
      await settingsSidePanelHelper.initWorksheetNamingAnswers();
      await settingsSidePanelHelper.initObjectInfoSettings();
      await formattingSettingsHelper.initImportFormattingSettings();
      await pivotTableSettingsHelper.initPivotTableSettings();
      sidePanelHelper.clearRepromptTask();
      sidePanelHelper.initializeClearDataFlags();
    }

    initializeSidePanel();
  }, []);

  // Separately assign active selection changed event listener due to dependency differences
  useEffect(() => {
    async function initializeSidePanelActiveSelectionChangedListener(): Promise<void> {
      await sidePanelEventHelper.initActiveSelectionChangedListener(
        updateActiveCellAddress,
        setActiveSheetIndex,
        isAnyPopupOrSettingsDisplayedRef
      );
    }

    initializeSidePanelActiveSelectionChangedListener();
  // disable exhaustive-deps rule because this effect should only run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useInitializeSidePanel;
