import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { HomeNotConnected } from '../../home/home';
import { reduxStore } from '../../store';

jest.mock('../../home/home-helper');

describe('Home', () => {
  it('should render home component and side panel', () => {
    // given

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <HomeNotConnected />
      </Provider>,
    );

    // then
    getByText('Excel');
    getByText('Username');
  });

  it('should render no rights message if no authToken is provided', () => {
    // given

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <HomeNotConnected authToken="noRightsToken" />
      </Provider>,
    );

    // then
    getByText('You do not have the rights to access MicroStrategy for Office');
  });
});
