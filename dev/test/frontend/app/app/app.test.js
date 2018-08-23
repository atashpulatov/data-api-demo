/* eslint-disable no-unused-vars */
import React from 'react';
import { mount } from 'enzyme';
import { App } from '../../../../src/frontend/app/app';
/* eslint-enable  */

describe('App', () => {
    it('should have header component with proper text', () => {
        // given
        // when
        const componentWrapper = mount(<App />);
        // then
        const nodeComponentWrapper = componentWrapper.find('Header');
        expect(nodeComponentWrapper).toHaveLength(1);
        expect(nodeComponentWrapper.find('p').text()).toBeTruthy();
    });
    it('should have routes defined', () => {
        // given
        // when
        const componentWrapper = mount(<App />);
        // then
        expect(componentWrapper.find('Routes')).toHaveLength(1);
    });
    it('should have footer defined', () => {
        // given
        // when
        const componentWrapper = mount(<App />);
        // then
        const nodeComponentWrapper = componentWrapper.find('Footer');
        expect(nodeComponentWrapper).toHaveLength(1);
        expect(nodeComponentWrapper.find('footer').text()).toBeTruthy();
    });
});
