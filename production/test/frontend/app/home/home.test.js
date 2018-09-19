/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Home } from '../../../../src/frontend/app/home/home.jsx';
import { Header } from '../../../../src/frontend/app/home/header.jsx';
import { Footer } from '../../../../src/frontend/app/home/footer.jsx';
import { reduxStore } from '../../../../src/frontend/app/store';
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

    it('should have footer defined', () => {
        // given
        const footerWrapper = mount(<Footer />);
        // when
        const componentWrapper = mount(
            <Provider store={reduxStore}>
                <Home />
            </Provider>
        );
        // then
        expect(componentWrapper.contains(footerWrapper.get(0))).toBe(true);
        expect(footerWrapper.find('footer').text()).toBeTruthy();
    });
});
