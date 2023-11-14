import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PrivilegeErrorSidePanel from './privilege-error-side-panel';
import { sessionHelper } from '../../storage/session-helper';

describe('PrivilegeErrorSidePanel', () => {
  it('should render PrivilegeErrorSidePanel', () => {
    // Given
    // When
    const { getByText } = render(<PrivilegeErrorSidePanel />);

    // Then
    expect(getByText('MicroStrategy for Office')).toBeInTheDocument();
    expect(getByText('You do not have the rights to access MicroStrategy for Office')).toBeInTheDocument();
    expect(getByText('Try Again')).toBeInTheDocument();
  });

  it('handleTryAgain should be called when button is clicked', () => {
    // Given
    const handleLogoutForPrivilegeMissingSpy = jest.spyOn(sessionHelper, 'handleLogoutForPrivilegeMissing').mockImplementation();

    // When
    const { getByText } = render(<PrivilegeErrorSidePanel />);
    const button = getByText('Try Again');

    // Then
    expect(button).toBeInTheDocument();

    // When
    fireEvent.click(button);

    // Then
    expect(handleLogoutForPrivilegeMissingSpy).toHaveBeenCalledTimes(1);
  });
});
