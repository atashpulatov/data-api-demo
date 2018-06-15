/* eslint-disable no-unused-vars */
import React from 'react';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
/* eslint-enable */
import { mount } from 'enzyme';
import propertiesEnum from '../../../../src/frontend/app/storage/properties-enum';


describe('navigator', () => {
    it('should save sessionObject', () => {
        // given
        const expectedToken = 'testt';
        const sessionObject = {};
        const location = { sessionObject };
        sessionObject[propertiesEnum.authToken] = expectedToken;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(propertiesEnum.authToken))
            .toEqual(expectedToken);
    });
});
