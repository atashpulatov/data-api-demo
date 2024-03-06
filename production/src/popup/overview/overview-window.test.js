import React from 'react';
import { objectNotificationTypes } from '@mstr/connector-components';
import { render } from '@testing-library/react';

import { OverviewWindowNotConnected } from './overview-window';

import { mockedObjectsFromStore } from '../../_tests_/mockDataV2';

describe('OverviewWindowNotConnected', () => {
  it('should render DataOverview component', () => {
    // Given
    const props = {
      objects: [],
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
      notifications: []
    };

    window.Office = {
      EventType: {
        DialogParentMessageReceived: 'DialogParentMessageReceived',
      },
      context: {
        ui: {
          messageParent: () => {},
          addHandlerAsync: () => {}
        },
      },
    };
    // When
    const { getByText } = render(<OverviewWindowNotConnected {...props} />);

    // Then
    const dataOverviewWindowTitle = getByText('Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
  });

  it('should render DataOverview component with blocked actions when there is operation in progress', () => {
    // Given
    const mockedNotifications = [{
      objectWorkingId: 1707383886748,
      title: 'Duplicating',
      type: objectNotificationTypes.PROGRESS,
      operationType: 'DUPLICATE_OPERATION',
      isIndeterminate: false
    }];

    const props = {
      objects: mockedObjectsFromStore,
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
      notifications: mockedNotifications
    };

    // When
    const { getByText, container } = render(<OverviewWindowNotConnected {...props} />);

    const rowCheckbox = container.querySelector('.ag-checkbox-input-wrapper.ag-disabled');

    // Then
    const dataOverviewWindowTitle = getByText('Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
    expect(rowCheckbox).toBeInTheDocument();
  });

  it('should render DataOverview component with enabled actions when there is operation in progress', () => {
    // Given
    const mockedNotifications = [{
      objectWorkingId: 1707383886748,
      title: 'Duplicating',
      type: objectNotificationTypes.SUCCESS,
      operationType: 'DUPLICATE_OPERATION',
      isIndeterminate: false
    }];

    const props = {
      objects: mockedObjectsFromStore,
      onRefresh: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
      notifications: mockedNotifications
    };

    // When
    const { getByText, container } = render(<OverviewWindowNotConnected {...props} />);

    const rowCheckbox = container.querySelector('.ag-checkbox-input-wrapper.ag-disabled');

    // Then
    const dataOverviewWindowTitle = getByText('Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
    expect(rowCheckbox).not.toBeInTheDocument();
  });
});
