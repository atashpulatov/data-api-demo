import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import objectsAutoRefreshHelper from '../../helpers/objects-auto-refresh-helpers';

import { selectObjects } from '../../redux-reducer/object-reducer/object-reducer-selectors';
import { settingsReducerSelectors } from '../../redux-reducer/settings-reducer/settings-reducer-selectors';

const useAutoRefreshObjects = (): void => {
  // Read the user setting to determine if data auto-refresh is enabled.
  const isAutoRefreshObjectsEnabled = useSelector(
    settingsReducerSelectors.selectEnableDataAutoRefresh
  );
  // Get the list of available working items (objects) from the store.
  // This collection should be already restored from the document and persisted in the store.
  const objects = useSelector(selectObjects);

  useEffect(() => {
    // Trigger auto-refresh when data auto-refresh user setting is enabled.
    if (isAutoRefreshObjectsEnabled) {
      objectsAutoRefreshHelper.refreshAllOnLoad(objects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoRefreshObjectsEnabled]);
};

export default useAutoRefreshObjects;
