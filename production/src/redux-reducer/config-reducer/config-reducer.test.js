import { createStore } from 'redux';

import { configActions } from './config-actions';
import { configReducer } from './config-reducer';

describe('officeReducer', () => {
  const configStore = createStore(configReducer);

  beforeEach(() => {
    // default state should be empty
    expect(configStore.getState()).toEqual({
      showHidden: false,
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
