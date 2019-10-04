/* eslint-disable react/jsx-filename-extension */
import { browserReducer } from './browser-reducer';
import {
  ON_MY_LIBRARY_CHANGED_CONST, ON_FILTER_CHANGED_CONST,
  ON_SORT_CHANGE_CONST, ON_SELECT_CONST
} from './browser-actions';
import { officeStoreService } from '../office/store/office-store-service';

describe('Browser reducer', () => {
  it('should return default state', () => {
    // given
    const defaultState = 'defaultState'
    // when
    const browserState = browserReducer(defaultState, {});
    // then
    expect(browserState).toEqual(defaultState);
  });

  it('should set myLibrary flag', () => {
    // given
    const myLibrary = 'myLibraryFilter';
    // when
    const browserState = browserReducer({}, {
      type: ON_MY_LIBRARY_CHANGED_CONST,
      myLibrary,
    });
    // then
    expect(browserState.myLibrary).toBe(myLibrary);
  });

  it('should set filter', () => {
    // given
    const filter = 'filterToSet';
    // when
    const browserState = browserReducer({}, {
      type: ON_FILTER_CHANGED_CONST,
      filter,
    });
    // then
    expect(browserState.filter).toBe(filter);
  });

  it('should set sort', () => {
    // given
    const sort = 'sortOrder';
    // when
    const browserState = browserReducer({}, {
      type: ON_SORT_CHANGE_CONST,
      sort,
    });
    // then
    expect(browserState.sort).toBe(sort);
  });

  it('should set selected', () => {
    // given
    const selected = 'selectedObject';
    // when
    const browserState = browserReducer({}, {
      type: ON_SELECT_CONST,
      selected,
    });
    // then
    expect(browserState.selected).toBe(selected);
  });

  it('should save browsing filters to office settings', () => {
    // given
    jest.spyOn(officeStoreService, 'preserveBrowsingFilters');
    const defaultState = 'defaultState'
    // when
    browserReducer(defaultState, {});
    // then
    expect(officeStoreService.preserveBrowsingFilters).toBeCalledWith(defaultState);
  });
});
