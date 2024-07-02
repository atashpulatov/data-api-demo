import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { reduxStore } from '../store';

import { HomeNotConnected } from './home';

jest.mock('./home-helper');

describe('HomeNotConnected', () => {
  it('should render home component and side panel', () => {
    // given
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <HomeNotConnected />
      </Provider>
    );

    // then
    expect(getByText('Excel')).toBeInTheDocument();
    expect(getByText('Username')).toBeInTheDocument();
  });

  it('should render no rights message if no authToken is provided', () => {
    // given

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <HomeNotConnected authToken='noRightsToken' />
      </Provider>
    );

    // then
    getByText('You do not have the rights to access MicroStrategy for Office');
  });

  it('should call connectionLost when offline event is triggered and dialog is not open', () => {
    // given
    reduxStore.dispatch = jest.fn();
    const props = {
      loading: false,
      isDialogOpen: false,
      authToken: 'testToken',
      hideDialog: jest.fn(),
      toggleIsSettingsFlag: jest.fn(),
      clearDialogState: jest.fn(),
    };

    // when
    render(
      <Provider store={reduxStore}>
        <HomeNotConnected {...props} />
      </Provider>
    );
    window.dispatchEvent(new Event('offline'));

    // then
    expect(reduxStore.dispatch).toHaveBeenCalled();
  });
});
