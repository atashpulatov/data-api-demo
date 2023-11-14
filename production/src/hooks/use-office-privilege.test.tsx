import { renderHook } from '@testing-library/react-hooks';
import { sessionHelper } from '../storage/session-helper';
import useOfficePrivilege from './use-office-privilege';

jest.mock('../storage/session-helper');

describe('useOfficePrivilege', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const authToken = 'abc-123-cba';

  // By default jest will mock timers, but we need to use the real implementation here to empty callback queue
  function flushPromises(): Promise<void> {
    return new Promise(jest.requireActual('timers').setImmediate);
  }

  it('should return true if user has office privilege', async () => {
    // Given
    const getCanUseOfficePrivilegeMock = jest.spyOn(sessionHelper, 'getCanUseOfficePrivilege').mockResolvedValue(true);

    // When
    const { result } = renderHook(() => useOfficePrivilege(authToken));

    // Then
    expect(getCanUseOfficePrivilegeMock).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(result.current).toBe(true);
  });

  it('should return false if user does not have office privilege', async () => {
    // Given
    const getCanUseOfficePrivilegeMock = jest.spyOn(sessionHelper, 'getCanUseOfficePrivilege').mockResolvedValue(false);

    // When
    const { result } = renderHook(() => useOfficePrivilege(authToken));

    // Then
    expect(getCanUseOfficePrivilegeMock).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(result.current).toBe(false);
  });
});
