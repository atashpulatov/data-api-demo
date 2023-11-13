import React from 'react';
import { render } from '@testing-library/react';
import PrivilegeErrorSidePanel from './privilege-error-side-panel';

/* eslint-env jest */

describe('PrivilegeErrorSidePanel', () => {
  beforeAll(() => {
    jest.unmock('@mstr/connector-components');
  });
  it('should render PrivilegeErrorSidePanel', () => {
    // Given
    // When
    const { getByText } = render(<PrivilegeErrorSidePanel />);

    // Then
    expect(getByText('MicroStrategy for Office')).toBeInTheDocument();
    expect(getByText('You do not have the rights to access MicroStrategy for Office')).toBeInTheDocument();
    expect(getByText('Try Again')).toBeInTheDocument();
  });
});
