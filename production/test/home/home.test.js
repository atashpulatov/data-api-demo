/* eslint-disable no-unused-vars */
import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {Home} from '../../src/home/home.jsx';
import {Header} from '../../src/home/header.jsx';
import {reduxStore} from '../../src/store';
/* eslint-enable  */

describe('Home', () => {
  it('should have header component with proper text', () => {
    // given
    const headerWrapper = mount(<Header />);
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <Home />
        </Provider>
    );
    // then
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
  });
});
