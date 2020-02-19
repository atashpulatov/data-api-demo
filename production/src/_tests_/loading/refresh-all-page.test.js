import React from 'react';
import { mount } from 'enzyme';
import { RefreshAllPageNotConnected } from '../../loading/refresh-all-page';

const refreshData = {
  data: [
    {
      key: 'testBinding1',
      name: 'testName1',
      result: false,
      isError: null,
    },
    {
      key: 'testBinding2',
      name: 'testName2',
      result: false,
      isError: null,
    },
  ],
  allNumber: 2,
  finished: false,
  currentNumber: 1,
};

describe('RefreshAllPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial state from local storage', () => {
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => JSON.stringify(refreshData));
    // when
    const wrappedComponent = mount(<RefreshAllPageNotConnected />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(mockStorageGetItem).toHaveBeenCalled();
    expect(wrappedComponent.state('name')).toBe('testName1');
    expect(wrappedComponent.state('currentNumber')).toBe(1);
    expect(wrappedComponent.state('results')).toEqual([...refreshData.data]);
    expect(wrappedComponent.state('finished')).toBe(false);
  });
  it('should render proper view from state', () => {
    // given
    const refreshDataMock = {
      data: [
        {
          key: 'testBinding1',
          name: 'testName1',
          result: 'testErrorMessage',
          isError: true,
        },
        {
          key: 'testBinding2',
          name: 'testName2',
          result: false,
          isError: false,
        },
      ],
      allNumber: 2,
      finished: false,
      currentNumber: 1,
    };
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => JSON.stringify(refreshDataMock));
    // when
    const wrappedComponent = mount(<RefreshAllPageNotConnected />);
    const wrappedResultsList = wrappedComponent.find('.result-container');
    const wrappedSuccessIcon = wrappedComponent.find('[type="refresh-success"]');
    const wrappedPopover = wrappedComponent.find('Popover');
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(mockStorageGetItem).toHaveBeenCalled();
    expect(wrappedResultsList).toHaveLength(refreshDataMock.data.length);
    expect(wrappedPopover.exists()).toBe(true);
    expect(wrappedSuccessIcon.exists()).toBe(true);
    // expect(wrappedResultsList[0]).toEqual(refreshData.data.length);
  });
  it('should get data on event from local storage', () => {
    // given
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => JSON.stringify(refreshData));
    const map = {};
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    // when
    const wrappedComponent = mount(<RefreshAllPageNotConnected />);
    map.storage({ newValue: 'refreshData' });
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    // expect(mockEventListener).toHaveBeenCalled();
    expect(mockStorageGetItem).toHaveBeenCalledTimes(2);
  });
  it('should get data with setInterval for IE', () => {
    // given
    jest.useFakeTimers();
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => JSON.stringify(refreshData));
    Object.defineProperty(navigator, 'userAgent', { get: jest.fn().mockImplementation(() => 'Trident.rv:11.'), });
    // when
    const wrappedComponent = mount(<RefreshAllPageNotConnected />);
    jest.advanceTimersByTime(500);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(mockStorageGetItem).toHaveBeenCalledTimes(2);
  });
  it('should call proper method when refresh all is unmounted', () => {
    // given
    jest.useFakeTimers();
    jest.spyOn(localStorage, 'getItem').mockImplementation(() => JSON.stringify(refreshData));
    const mockClearInterval = jest.spyOn(window, 'clearInterval');
    // when
    const wrappedComponent = mount(<RefreshAllPageNotConnected />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    wrappedComponent.unmount();
    expect(mockClearInterval).toHaveBeenCalled();
  });
});
