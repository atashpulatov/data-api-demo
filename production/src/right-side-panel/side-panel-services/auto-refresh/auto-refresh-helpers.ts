import { sortObjectWorkingIds } from '@mstr/connector-components';

import { sidePanelService } from '../side-panel-service';

import { ObjectData } from '../../../types/object-types';

import { OfficeSettingsEnum } from '../../../constants/office-constants';

class AutoRefreshHelper {
  /**
   * This function is used to trigger an auto-refresh operation on a set of objects if data auto-refresh's
   * temporary parameter is currently disabled.
   * It uses services provided by sidePanelService to perform these operations.
   * It also displays a global warning dialog to allow the user to cancel the operation.
   * @param objects - working items to be refreshed
   */
  refreshAllOnLoad = async (objects: ObjectData[]): Promise<void> => {
    try {
      // Fetch data auto-refresh parameter's value from temporary storage.
      const shouldTriggerDataAutoRefresh = this.getShouldTriggerDataAutoRefresh();

      if (shouldTriggerDataAutoRefresh) {
        const loadedObjects = Object.values(objects) as any[];

        const objectWorkingIds = loadedObjects.reduce((ids, object) => {
          ids.push(object.objectWorkingId);
          return ids;
        }, [] as number[]);

        // Trigger auto-refresh operation on the working items if there are any.
        if (objectWorkingIds.length > 0) {
          // Need to maintain a top to bottom order of object operations,
          // thus, need to apply some sorting here
          objectWorkingIds.sort((a: number, b: number) =>
            sortObjectWorkingIds(a, b, loadedObjects)
          );

          sidePanelService.refresh(...objectWorkingIds);
        }
      }
    } catch (error) {
      console.error('Error occurred while triggering auto-refresh on load:', error);
      throw error; // Consider re-throwing the error for the caller to handle
    } finally {
      this.setShouldTriggerDataAutoRefresh(false);
    }
  };

  /**
   * Retrieves the SHOULD_TRIGGER_DATA_AUTO_REFRESH setting from the session storage.
   *
   * This method gets the value of SHOULD_TRIGGER_DATA_AUTO_REFRESH from the session storage,
   * which is stored as a string. It then compares this value to the string 'true'
   * to convert it to a boolean, and returns this boolean value.
   *
   * @returns - The value of DATA_AUTO_REFRESH from the session storage,
   * converted to a boolean. Returns true if SHOULD_TRIGGER_DATA_AUTO_REFRESH is 'true', and false otherwise.
   */
  getShouldTriggerDataAutoRefresh = (): boolean => {
    const shouldTriggerDataAutoRefresh = sessionStorage.getItem(
      OfficeSettingsEnum.shouldTriggerDataAutoRefresh
    );

    // Not defined in session storage then return true to trigger auto-refresh
    // because it's the first time the user logs in and auto-refresh can be triggered.
    if (shouldTriggerDataAutoRefresh === null) {
      return true;
    }

    return shouldTriggerDataAutoRefresh === 'true';
  };

  /**
   * Stores the SHOULD_TRIGGER_DATA_AUTO_REFRESH setting in the session storage.
   *
   * This method takes a boolean parameter, `dataAutoRefresh`, and stores it in the session storage.
   * The `sessionStorage.setItem` method is used to store the value. The boolean is converted to a string
   * using the `toString` method before it's stored, because `sessionStorage` can only store strings.
   *
   * @param shouldTriggerDataAutoRefresh - The value to be stored in the session storage.
   */
  setShouldTriggerDataAutoRefresh = (shouldTriggerDataAutoRefresh: boolean): void => {
    sessionStorage.setItem(
      OfficeSettingsEnum.shouldTriggerDataAutoRefresh,
      shouldTriggerDataAutoRefresh.toString()
    );
  };
}

const autoRefreshHelper = new AutoRefreshHelper();
export default autoRefreshHelper;
