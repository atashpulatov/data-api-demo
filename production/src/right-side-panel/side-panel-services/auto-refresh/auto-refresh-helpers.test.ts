import { sidePanelService } from '../side-panel-service';
import autoRefreshHelper from './auto-refresh-helpers';

import { ObjectData } from '../../../types/object-types';

jest.mock('../side-panel-service');

describe('AutoRefreshHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger auto-refresh on load when data auto-refresh is enabled', async () => {
    // given
    const objects = [
      { objectWorkingId: 1 },
      { objectWorkingId: 2 },
      { objectWorkingId: 3 },
    ] as ObjectData[];

    jest.spyOn(autoRefreshHelper, 'getShouldTriggerDataAutoRefresh').mockReturnValue(true);
    jest.spyOn(sidePanelService, 'refresh');

    // when
    await autoRefreshHelper.refreshAllOnLoad(objects);

    // then
    expect(sidePanelService.refresh).toHaveBeenCalledWith(1, 2, 3);
  });

  it('should not trigger auto-refresh on load when data auto-refresh is disabled', async () => {
    // given
    const objects = [
      { objectWorkingId: 1 },
      { objectWorkingId: 2 },
      { objectWorkingId: 3 },
    ] as ObjectData[];

    jest.spyOn(autoRefreshHelper, 'getShouldTriggerDataAutoRefresh').mockReturnValue(false);
    jest.spyOn(sidePanelService, 'refresh');

    // when
    await autoRefreshHelper.refreshAllOnLoad(objects);

    // then
    expect(sidePanelService.refresh).not.toHaveBeenCalled();
  });

  it('should set shouldTriggerDataAutoRefresh to false after triggering auto-refresh on load', async () => {
    // given
    const objects = [
      { objectWorkingId: 1 },
      { objectWorkingId: 2 },
      { objectWorkingId: 3 },
    ] as ObjectData[];

    jest.spyOn(autoRefreshHelper, 'getShouldTriggerDataAutoRefresh').mockReturnValue(true);
    jest.spyOn(sidePanelService, 'refresh');
    jest.spyOn(autoRefreshHelper, 'setShouldTriggerDataAutoRefresh');

    // when
    await autoRefreshHelper.refreshAllOnLoad(objects);

    // then
    expect(autoRefreshHelper.setShouldTriggerDataAutoRefresh).toHaveBeenCalledWith(false);
  });

  it('should get shouldTriggerDataAutoRefresh from session storage', () => {
    // given
    sessionStorage.setItem('shouldTriggerDataAutoRefresh', 'true');

    // when
    const shouldTriggerDataAutoRefresh = autoRefreshHelper.getShouldTriggerDataAutoRefresh();

    // then
    expect(shouldTriggerDataAutoRefresh).toBe(true);
  });

  it('should return true if shouldTriggerDataAutoRefresh is not defined in session storage', () => {
    // given
    sessionStorage.removeItem('shouldTriggerDataAutoRefresh');

    // when
    const shouldTriggerDataAutoRefresh = autoRefreshHelper.getShouldTriggerDataAutoRefresh();

    // then
    expect(shouldTriggerDataAutoRefresh).toBe(true);
  });

  it('should set shouldTriggerDataAutoRefresh in session storage', () => {
    // given
    const shouldTriggerDataAutoRefresh = true;

    // when
    autoRefreshHelper.setShouldTriggerDataAutoRefresh(shouldTriggerDataAutoRefresh);

    // then
    expect(sessionStorage.getItem('shouldTriggerDataAutoRefresh')).toBe('true');
  });
});
