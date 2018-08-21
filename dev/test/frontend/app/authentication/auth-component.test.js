import React from 'react'; // eslint-disable-line
import { shallow } from 'enzyme';
import { Authenticate } from '../../../../src/frontend/app/authentication/auth-component.jsx'; // eslint-disable-line no-unused-vars

describe('AuthComponent', () => {
    const location = {};

    beforeAll(() => {
        const origin = { pathname: '/' };
        const state = { origin: origin };
        location.state = state;
    });

    it('should render my component', () => {
        // when
        const component = shallow(<Authenticate location={location} />);
        // then
        expect(component.getElements()).toMatchSnapshot();
    });
});
