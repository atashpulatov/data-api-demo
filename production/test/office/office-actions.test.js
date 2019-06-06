import {officeProperties} from '../../src/office/office-properties';
import * as actions from '../../src/office/office-actions';

describe('Office Actions', () => {
  it('should dispatch proper toggleStoreSecuredFlag action', () => {
    // given
    const listener = jest.fn();

    // when
    actions.toggleStoreSecuredFlag(true)(listener);

    // then
    expect(listener).toHaveBeenCalledWith({type: officeProperties.actions.toggleSecuredFlag, isSecured: true});
  });
})
;
