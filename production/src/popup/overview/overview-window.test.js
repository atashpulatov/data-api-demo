import React from 'react';
import { Provider } from 'react-redux';
import { ObjectNotificationTypes } from '@mstr/connector-components';
import { render } from '@testing-library/react';

import { reduxStore } from '../../store';
import configureMockStore from 'redux-mock-store';

import { OverviewWindowNotConnected } from './overview-window';

import { mockedObjectsFromStore } from '../../../__mocks__/mockDataV2';

const setupStore =(initialState) => {
  const mockStore = configureMockStore();
  return mockStore(initialState);
}

describe('OverviewWindowNotConnected', () => {
  let props;

  beforeEach(() => {
    props = {
      objects: [],
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
    };
  });

  beforeAll(() => {
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
  });

  it('should render DataOverview component', () => {
    // Given
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
    const mockedProgressingNotification = 
      {
        objectWorkingId: 1707383886748,
        title: 'Duplicating',
        type: ObjectNotificationTypes.PROGRESS,
        operationType: 'DUPLICATE_OPERATION',
        isIndeterminate: false,
      }
    ;

    const initialState = {
      notificationReducer: { notifications: [mockedProgressingNotification], globalNotification: { type: '' } },
    };
    const store = setupStore(initialState);


    // When
    const { getByText, container } = render(
      <Provider store={store}>
        <OverviewWindowNotConnected {...props, {objects:mockedObjectsFromStore}} />
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
    const mockedSuccesfulNotification = [
      {
        objectWorkingId: 1707383886748,
        title: 'Duplicating',
        type: ObjectNotificationTypes.SUCCESS,
        operationType: 'DUPLICATE_OPERATION',
        isIndeterminate: false,
      },
    ];

    const store = setupStore({
      notificationReducer: { notifications: [mockedSuccesfulNotification], globalNotification: { type: '' } },
    });

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
