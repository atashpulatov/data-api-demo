/* eslint-disable */
import React from 'react';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
import { shallow, mount } from 'enzyme';
import propertiesEnum from '../../../../src/frontend/app/storage/properties-enum';
/* eslint-enable */

describe('navigator', () => {
    const location = {};
    beforeAll(() => {
        location.pathname = '/';
    });

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

    it('should save folderId', () => {
        // given
        const expectedValue = 'testt';
        const sessionObject = {};
        const location = { sessionObject };
        sessionObject[propertiesEnum.folderId] = expectedValue;
        // when
        mount(<Navigator location={location} />);
        // then
        expect(sessionStorage.getItem(propertiesEnum.folderId))
            .toEqual(expectedValue);
    });

    it('should navigate to authComponent', async () => {
        // given
        const mockPush = jest.fn();
        const originalMethod = Navigator.prototype.pushHistory;
        const expectedRoute = {
            pathname: '/auth',
            state: {
            },
        };
        try {
            Navigator.prototype.pushHistory = mockPush;
            // when
            const navigatorWrapper = mount(<Navigator location={location} />);
            await navigatorWrapper.instance().componentDidMount();
            expectedRoute.state.origin = navigatorWrapper.props().location;
            // then
            expect(mockPush).toBeCalled();
            expect(mockPush)
                .toBeCalledWith(expectedRoute);
        } finally {
            Navigator.prototype.pushHistory = originalMethod;
        }
    });
});
