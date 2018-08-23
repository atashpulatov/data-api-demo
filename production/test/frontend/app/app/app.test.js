/* eslint-disable no-unused-vars */
import React from 'react';
import { mount } from 'enzyme';
import { App } from '../../../../src/frontend/app/app';
import { Header } from '../../../../src/frontend/app/header';
import { HashRouter as Router } from 'react-router-dom';
import { Footer } from '../../../../src/frontend/app/footer';
/* eslint-enable  */

describe('App', () => {
    it('should have header component with proper text', () => {
        // given
        const headerWrapper = mount(<Header />);
        // when
        const componentWrapper = mount(<App />);
        // then
        expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    });

    it('should have footer defined', () => {
        // given
        const footerWrapper = mount(<Footer />);
        // when
        const componentWrapper = mount(<App />);
        // then
        expect(componentWrapper.contains(footerWrapper.get(0))).toBe(true);
        expect(footerWrapper.find('footer').text()).toBeTruthy();
    });
});
