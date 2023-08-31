import { createStore } from 'redux';
import { configReducer } from '../../../redux-reducer/config-reducer/config-reducer';
import { configActions } from '../../../redux-reducer/config-reducer/config-actions';

describe('officeReducer', () => {
  const configStore = createStore(configReducer);

  beforeEach(() => {
    // default state should be empty
    expect(configStore.getState()).toEqual({
      showHidden: false
    });
  });

  it('should set showHidden to false', () => {
    // given
    const oldState = { showHidden: false };
    const action = configActions.setShowHidden(true);

    // when
    const newState = configReducer(oldState, action);

    // then
    expect(newState.showHidden).toBe(true);
  });
});
