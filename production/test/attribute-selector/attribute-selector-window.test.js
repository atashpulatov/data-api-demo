/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { AttributeSelectorWindow } from '../../src/attribute-selector/attribute-selector-window';
import { AttributeSelector } from '../../src/attribute-selector/attribute-selector';
/* eslint-enable */

describe('AttributeSelectorWindow', () => {
    it('should contain attribute selector', () => {
        // given
        const parsed = {};
        // when
        const componentWrapper = shallow(<AttributeSelectorWindow
            parsed={parsed} />);
        // then
        const selectorWrapper = componentWrapper.find(AttributeSelector);
        expect(selectorWrapper.get(0)).toBeDefined();
    });

    it('should parse props correctly', () => {
        // given
        const parsed = {
            envUrl: 'url',
            token: 'token',
            projectId: 'proId',
            reportId: 'repId',
        };
        // when
        const componentWrapper = shallow(<AttributeSelectorWindow
            parsed={parsed} />);
        // then
        expect(componentWrapper.state('session').url)
            .toEqual(parsed.envUrl);
        expect(componentWrapper.state('session').authToken)
            .toEqual(parsed.token);
        expect(componentWrapper.state('session').projectId)
            .toEqual(parsed.projectId);
        expect(componentWrapper.state('reportId'))
            .toEqual(parsed.reportId);
    });
});
