import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { authenticationService } from '../../authentication/authentication-service';

import '@testing-library/jest-dom'; // TODO check why tests are not passing without it
import PrivilegeErrorSidePanel from './privilege-error-side-panel';

describe('PrivilegeErrorSidePanel', () => {
  it('should render PrivilegeErrorSidePanel', () => {
    // Given
    // When
    const { getByText } = render(<PrivilegeErrorSidePanel />);

    // Then
    expect(getByText('MicroStrategy for Office')).toBeInTheDocument();
    expect(
      getByText('You do not have the rights to access MicroStrategy for Office')
    ).toBeInTheDocument();
    expect(getByText('Try Again')).toBeInTheDocument();
  });

  it('handleTryAgain should be called when button is clicked', () => {
    // Given
    const handleLogoutForPrivilegeMissingSpy = jest
      .spyOn(authenticationService, 'handleLogoutForPrivilegeMissing')
      .mockImplementation();

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
