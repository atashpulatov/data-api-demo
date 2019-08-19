import {officeProperties} from '../../src/office/office-properties';
import {officeStoreService} from '../../src/office/store/office-store-service';
import * as actions from '../../src/office/office-actions';

describe('Office Actions', () => {
  it('should dispatch proper toggleStoreSecuredFlag action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.toggleSecuredFlag(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: officeProperties.actions.toggleSecuredFlag, isSecured: true});
  });

  it('should dispatch proper toggleIsSettingsFlag action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.toggleIsSettingsFlag(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: officeProperties.actions.toggleIsSettingsFlag, isSettings: true});
  });

  it('should dispatch proper toggleIsConfirmFlag action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.toggleIsConfirmFlag(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: officeProperties.actions.toggleIsConfirmFlag, isConfirm: true});
  });
})
;
