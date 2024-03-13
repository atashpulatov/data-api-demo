import React from 'react';
import { render } from '@testing-library/react';

import officeStoreHelper from '../office/store/office-store-helper';

import { RightSidePanelNotConnected } from './right-side-panel';

describe('RightSidePanelNotConnected', () => {
  const mockedProps = {
    loadedObjects: [],
    toggleSecuredFlag: jest.fn(),
    toggleIsClearDataFailedFlag: jest.fn(),
  };

  it('should call toggleSecureFlag if file is secured', () => {
    // given
    jest.spyOn(officeStoreHelper, 'isFileSecured').mockReturnValue(true);
    jest.spyOn(officeStoreHelper, 'isClearDataFailed').mockReturnValue(true);

    // when
    render(<RightSidePanelNotConnected {...mockedProps} />);

    // then
    expect(mockedProps.toggleSecuredFlag).toHaveBeenCalledWith(true);
    expect(mockedProps.toggleIsClearDataFailedFlag).toHaveBeenCalledWith(true);
  });
});
