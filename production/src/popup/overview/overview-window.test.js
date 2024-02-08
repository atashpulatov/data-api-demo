import React from 'react';

import { render } from '@testing-library/react';
import { OverviewWindowNotConnected } from './overview-window';

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
        ui: { addHandlerAsync: () => {} },
      },
    };
    // When
    const { getByText } = render(<OverviewWindowNotConnected {...props} />);

    // Then
    const dataOverviewWindowTitle = getByText('Imported Data Overview');
    expect(dataOverviewWindowTitle).toBeInTheDocument();
  });
});
