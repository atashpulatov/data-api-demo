/* eslint-disable react/jsx-filename-extension */
import { browserReducer } from '../../browser/browser-reducer';
import {
  ON_MY_LIBRARY_CHANGED_CONST, ON_FILTER_CHANGED_CONST,
  ON_SORT_CHANGE_CONST, ON_SELECT_CONST, LOAD_BROWSING_STATE_CONST
} from '../../browser/browser-actions';
import { browserStoreService } from '../../browser/browser-store-service';

describe('Browser reducer', () => {
  beforeAll(() => {
    jest.spyOn(browserStoreService, 'getOfficeSettings')
      .mockReturnValue({
        set: jest.fn(),
        get: jest.fn(),
        saveAsync: jest.fn(),
      });
  });
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

  it('should load entire state', () => {
    // given
    const browsingState = 'browsingState';
    // when
    const browserState = browserReducer({}, {
      type: LOAD_BROWSING_STATE_CONST,
      browsingState,
    });
    // then
    expect(browserState).toBe(browsingState);
  });

  it('should save browsing filters to office settings', () => {
    // given
    jest.spyOn(browserStoreService, 'preserveBrowsingFilters');
    const defaultState = 'defaultState'
    // when
    browserReducer(defaultState, {});
    // then
    expect(browserStoreService.preserveBrowsingFilters).toBeCalledWith(defaultState);
  });
});
