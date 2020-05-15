import * as actions from '../../redux-reducer/office-reducer/office-actions';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import officeStoreHelper from '../../office/store/office-store-helper';

describe('Office Actions', () => {
  it('should dispatch proper toggleStoreSecuredFlag action', () => {
    // given
    jest.spyOn(officeStoreHelper, 'setFileSecuredFlag').mockImplementation();
    const listener = jest.fn();

    // when
    actions.toggleSecuredFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleSecuredFlag, isSecured: true });

    expect(officeStoreHelper.setFileSecuredFlag).toBeCalledTimes(1);
    expect(officeStoreHelper.setFileSecuredFlag).toBeCalledWith(true);
  });

  it('should dispatch proper toggleIsSettingsFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.toggleIsSettingsFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleIsSettingsFlag, isSettings: true });
  });

  it('should dispatch proper toggleIsConfirmFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.toggleIsConfirmFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleIsConfirmFlag, isConfirm: true });
  });

  it('should dispatch proper toggleRenderSettingsFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.toggleRenderSettingsFlag()(listener);

    // then
    expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleRenderSettingsFlag });
  });

  it('should dispatch proper toggleIsClearDataFailedFlag action', () => {
    // given
    jest.spyOn(officeStoreHelper, 'setIsClearDataFailed').mockImplementation();
    const listener = jest.fn();

    // when
    actions.toggleIsClearDataFailedFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith(
      {
        type: officeProperties.actions.toggleIsClearDataFailedFlag,
        isClearDataFailed: true
      }
    );

    expect(officeStoreHelper.setIsClearDataFailed).toBeCalledTimes(1);
    expect(officeStoreHelper.setIsClearDataFailed).toBeCalledWith(true);
  });
});
