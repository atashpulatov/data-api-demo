import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { formattingSettingsHelper } from '../settings-side-panel/formatting-settings/formatting-settings-helper';
import { settingsSidePanelHelper } from '../settings-side-panel/settings-side-panel-helper';
import { sidePanelEventHelper } from '../side-panel-services/side-panel-event-helper';
import { sidePanelHelper } from '../side-panel-services/side-panel-helper';

const useInitializeSidePanel = (
  updateActiveCellAddress: (cellAddress: string) => void,
  setActiveSheetIndex: Dispatch<SetStateAction<number>>,
  isAnyPopupOrSettingsDisplayed: boolean
): void => {
  useEffect(() => {
    async function initializeSidePanel(): Promise<void> {
      await sidePanelEventHelper.addRemoveObjectListener();
      await settingsSidePanelHelper.initReusePromptAnswers();
      await settingsSidePanelHelper.initPageByDisplayAnswers();
      await settingsSidePanelHelper.initWorksheetNamingAnswers();
      await settingsSidePanelHelper.initObjectInfoSettings();
      await formattingSettingsHelper.initImportFormattingSettings();
      sidePanelHelper.clearRepromptTask();
      sidePanelHelper.initializeClearDataFlags();
    }

    initializeSidePanel();
  }, []);
  
  const activeSelectionChangedListenerEventResult =
    useRef<OfficeExtension.EventHandlerResult<Excel.SelectionChangedEventArgs>>();
  useEffect(() => {
    async function initializeSidePanelActiveSelectionChangedListener(): Promise<void> {
      activeSelectionChangedListenerEventResult.current =
        await sidePanelEventHelper.initializeActiveSelectionChangedListener(
          updateActiveCellAddress,
          setActiveSheetIndex,
          isAnyPopupOrSettingsDisplayed
        );
    }
    // Clear the event listener and sync context whenever dependencies change, prior to running next initialization
    function clearSidePanelActiveSelectionChangedListener(): void {
      activeSelectionChangedListenerEventResult.current?.remove?.();
      activeSelectionChangedListenerEventResult.current?.context?.sync?.();
    }

    initializeSidePanelActiveSelectionChangedListener();

    return clearSidePanelActiveSelectionChangedListener();
  }, [setActiveSheetIndex, updateActiveCellAddress, isAnyPopupOrSettingsDisplayed])
};

export default useInitializeSidePanel;
