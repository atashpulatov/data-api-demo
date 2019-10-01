/* eslint-disable react/jsx-filename-extension */
import { createStore } from 'redux';
import { browserReducer } from './browser-reducer';
import { ON_MY_LIBRARY_CHANGED_CONST, ON_FILTER_CHANGED_CONST, ON_SORT_CHANGE_CONST, ON_SELECT_CONST } from './browser-actions';

describe('Browser reducer', () => {
  const browserStore = createStore(browserReducer);
  it('should return proper default state', () => {
    // given
    // when
    const defaultState = browserStore.getState();
    // then
    expect(defaultState).toEqual({
      myLibrary: true,
    });
  });

  it('should set myLibrary flag', () => {
    // given
    const myLibrary = 'myLibraryFilter';
    // when
    browserStore.dispatch({
      type: ON_MY_LIBRARY_CHANGED_CONST,
      myLibrary,
    });
    // then
    const browserState = browserStore.getState();
    expect(browserState.myLibrary).toBe(myLibrary);
  });

  it('should set filter', () => {
    // given
    const filter = 'filterToSet';
    // when
    browserStore.dispatch({
      type: ON_FILTER_CHANGED_CONST,
      filter,
    });
    // then
    const browserState = browserStore.getState();
    expect(browserState.filter).toBe(filter);
  });

  it('should set sort', () => {
    // given
    const sort = 'sortOrder';
    // when
    browserStore.dispatch({
      type: ON_SORT_CHANGE_CONST,
      sort,
    });
    // then
    const browserState = browserStore.getState();
    expect(browserState.sort).toBe(sort);
  });

  it('should set selected', () => {
    // given
    const selected = 'selectedObject';
    // when
    browserStore.dispatch({
      type: ON_SELECT_CONST,
      selected,
    });
    // then
    const browserState = browserStore.getState();
    expect(browserState.selected).toBe(selected);
  });
});
