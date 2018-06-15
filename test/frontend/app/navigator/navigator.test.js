/* eslint-disable no-unused-vars */
import React from 'react';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
/* eslint-enable */
import { mount } from 'enzyme';
import propertiesEnum from '../../../../src/frontend/app/storage/properties-enum';


describe('navigator', () => {
    it('should save authToken', () => {
        // given
        const expectedValue = 'testt';
        const sessionObject = {};
        const location = { sessionObject };
        sessionObject[propertiesEnum.authToken] = expectedValue;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(propertiesEnum.authToken))
            .toEqual(expectedValue);
    });

    it('should save directoryId', () => {
        // given
        const expectedValue = 'testt';
        const sessionObject = {};
        const location = { sessionObject };
        sessionObject[propertiesEnum.directoryId] = expectedValue;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(propertiesEnum.directoryId))
            .toEqual(expectedValue);
    });
});
