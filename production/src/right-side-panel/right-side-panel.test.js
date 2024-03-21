import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import officeStoreHelper from '../office/store/office-store-helper';

import { reduxStore } from '../store';

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
    render(
      <Provider store={reduxStore}>
        <RightSidePanelNotConnected {...mockedProps} />
      </Provider>
    );

    // then
    expect(mockedProps.toggleSecuredFlag).toHaveBeenCalledWith(true);
    expect(mockedProps.toggleIsClearDataFailedFlag).toHaveBeenCalledWith(true);
  });
});
