import React from 'react'; // eslint-disable-line
import { shallow } from 'enzyme';
import AuthComponent from '../../../../src/frontend/app/authentication/auth-component'; // eslint-disable-line no-unused-vars


describe('AuthComponent', () => {
    it('should render my component', () => {
        // given
        const origin = { pathname: '/' };
        const state = { origin: origin };
        const location = { state: state };
        // when
        const component = shallow(<AuthComponent location={location} />);
        // then
        expect(component.getElements()).toMatchSnapshot();
    });
});
