/* eslint-disable */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import MenuBar from '../../../../src/frontend/app/menu-bar';
/* eslint-enable */

describe('menu bar', () => {
    it('should go up', () => {
        // given
        const barWrapper = mount(
            <Router>
                <MenuBar />
            </Router>
        );
        const buttons = barWrapper.find('button');
        const goBackButton = buttons.filterWhere((button) =>
            button.text().includes('Back'));
        // when
        goBackButton.simulate('click');
        // then
        expect(goBackButton).toBeTruthy();
        expect(true).toBeFalsy();
    });
});
