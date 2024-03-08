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
        <HomeNotConnected authToken="testToken" />
      </Provider>,
    );
    // then
    getByText('MicroStrategy for Office');
  });
});
