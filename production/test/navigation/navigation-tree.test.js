/* eslint-disable */
import React from 'react';
import { NavigationTree } from '../../src/navigation/navigation-tree';
import { shallow, mount } from 'enzyme';
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
});
