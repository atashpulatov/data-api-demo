import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import officeStoreHelper from '../../office/store/office-store-helper';
import autoRefreshHelper from '../side-panel-services/auto-refresh/auto-refresh-helpers';

import { selectObjects } from '../../redux-reducer/object-reducer/object-reducer-selectors';
import { settingsReducerSelectors } from '../../redux-reducer/settings-reducer/settings-reducer-selectors';
import { OfficeSettingsEnum } from '../../constants/office-constants';

const useAutoRefreshObjects = (): void => {
  // Read the user setting to determine if data auto-refresh is enabled.
  const isAutoRefreshObjectsEnabled = useSelector(
    settingsReducerSelectors.selectEnableDataAutoRefresh
  );
  // Get the list of available working items (objects) from the store.
  // This collection should be already restored from the document and persisted in the store.
  const objects = useSelector(selectObjects);

  useEffect(() => {
    // DE300281: reading office properties that govern whether to show 'Clear Data' related
    // banners and notifications. When 'isSecured' is true, the data clear banners shows up
    // and expects user to manually dismiss it. When 'isClearDataFailed' is true, an error
    // banner is shown to inform the user that the data clear operation failed.
    const isSecured = officeStoreHelper.getPropertyValue(OfficeSettingsEnum.isSecured);
    const isClearDataFailed = officeStoreHelper.getPropertyValue(
      OfficeSettingsEnum.isClearDataFailed
    );
    // Trigger auto-refresh when data auto-refresh user setting is enabled.
    // DE300281: also, do not trigger auto-refresh when the "Clear Data" banner is shown.
    if (isAutoRefreshObjectsEnabled && !isSecured && !isClearDataFailed) {
      autoRefreshHelper.refreshAllOnLoad(objects);
    }
  }, [isAutoRefreshObjectsEnabled, objects]);
};

export default useAutoRefreshObjects;
