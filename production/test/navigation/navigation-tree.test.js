/* eslint-disable */
import React from 'react';
import { NavigationTree } from '../../src/navigation/navigation-tree';
import { shallow, mount } from 'enzyme';
import { selectorProperties } from '../../src/attribute-selector/selector-properties';
/* eslint-enable */

describe('NavigationTree', () => {
    it('should (full)render with props given', () => {
        // given
        const parsed = {
            envUrl: 'env',
            token: 'token',
            projectId: 'projectId',
        };
        // when
        const wrappedComponent = mount(<NavigationTree parsed={parsed} />);
        // then
        expect(wrappedComponent.instance()).toBeDefined();
        expect(wrappedComponent.find('FolderTree').get(0)).toBeDefined();
        expect(wrappedComponent.find('PopupButtons').length).toBe(1);
    });

    it('should have buttons with secondary action', () => {
        // given
        const parsed = {
            envUrl: 'env',
            token: 'token',
            projectId: 'projectId',
        };
        // when
        const wrappedComponent = mount(<NavigationTree parsed={parsed} />);
        // then
        const popupButtonsWrapped = wrappedComponent.find('PopupButtons');
        expect(popupButtonsWrapped.exists('#prepare')).toBeTruthy();
    });

    it('should send proper message on secondary action', () => {
        // given
        jest
        const parsed = {
            envUrl: 'env',
            token: 'token',
            projectId: 'projectId',
        };
        const actionObject = {
            command: selectorProperties.commandSecondary,
            chosenObject: this.state.chosenObjectId,
            chosenProject: this.state.chosenProjectId,
        };
        const wrappedComponent = mount(<NavigationTree parsed={parsed} />);
        // when
        wrappedComponent.instance().handleSecondary();
        // then
        const popupButtonsWrapped = wrappedComponent.find('PopupButtons');
        expect(popupButtonsWrapped.exists('#prepare')).toBeTruthy();
    });
});
