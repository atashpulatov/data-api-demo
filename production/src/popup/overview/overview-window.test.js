import React from 'react';
import { Provider } from 'react-redux';
import { ObjectNotificationTypes } from '@mstr/connector-components';
import { render } from '@testing-library/react';

import { reduxStore } from '../../store';
// eslint-disable-next-line import/order
import configureMockStore from 'redux-mock-store';

import { OverviewWindowNotConnected } from './overview-window';

import { mockedObjectsFromStore } from '../../../__mocks__/mockDataV2';

describe('OverviewWindowNotConnected', () => {
  it('should render DataOverview component', () => {
    // Given
    const props = {
      objects: [],
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
    };

    window.Office = {
      EventType: {
        DialogParentMessageReceived: 'DialogParentMessageReceived',
      },
      context: {
        ui: {
          messageParent: () => {},
          addHandlerAsync: () => {},
        },
      },
    };
    // When
    const { getByText } = render(
      <Provider store={reduxStore}>
        <OverviewWindowNotConnected {...props} />
      </Provider>
    );

    // Then
    const dataOverviewWindowTitle = getByText('Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
  });

  it('should render DataOverview component with blocked actions when there is operation in progress', () => {
    // Given
    const mockStore = configureMockStore();
    const mockedNotifications = [
      {
        objectWorkingId: 1707383886748,
        title: 'Duplicating',
        type: ObjectNotificationTypes.PROGRESS,
        operationType: 'DUPLICATE_OPERATION',
        isIndeterminate: false,
      },
    ];

    const initialState = {
      notificationReducer: { notifications: mockedNotifications, globalNotification: { type: '' } },
    };
    const store = mockStore(initialState);

    const props = {
      objects: mockedObjectsFromStore,
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
      notifications: mockedNotifications,
    };

    // When
    const { getByText, container } = render(
      <Provider store={store}>
        <OverviewWindowNotConnected {...props} />
      </Provider>
    );

    const rowCheckbox = container.querySelector('.ag-checkbox-input-wrapper.ag-disabled');

    // Then
    const dataOverviewWindowTitle = getByText('Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
    expect(rowCheckbox).toBeInTheDocument();
  });

  it('should render DataOverview component with enabled actions when there is operation completed succesfully', () => {
    // Given
    const mockStore = configureMockStore();
    const mockedNotifications = [
      {
        objectWorkingId: 1707383886748,
        title: 'Duplicating',
        type: ObjectNotificationTypes.SUCCESS,
        operationType: 'DUPLICATE_OPERATION',
        isIndeterminate: false,
      },
    ];

    const initialState = {
      notificationReducer: { notifications: mockedNotifications, globalNotification: { type: '' } },
    };
    const store = mockStore(initialState);

    const props = {
      objects: mockedObjectsFromStore,
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
    };

    // When
    const { getByText, container } = render(
      <Provider store={store}>
        <OverviewWindowNotConnected {...props} />
      </Provider>
    );

    const rowCheckbox = container.querySelector('.ag-checkbox-input-wrapper.ag-disabled');

    // Then
    const dataOverviewWindowTitle = getByText('Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
    expect(rowCheckbox).not.toBeInTheDocument();
  });
});
