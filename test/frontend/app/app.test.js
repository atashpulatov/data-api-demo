import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import App from '../../../src/frontend/app/app'; // eslint-disable-line no-unused-vars
import Navigator from '../../../src/frontend/app/navigator/navigator';
import Login from '../../../src/frontend/app/authentication/auth-component';
import Projects from '../../../src/frontend/app/project/project-list';
import MstrObjects from '../../../src/frontend/app/mstr-object/mstr-object-list';

describe('App', () => {
    it('should have routes defined', () => {
        // given
        const routesExpected = [
            {path: '/', component: Navigator},
            {path: '/auth', component: Login},
            {path: '/projects', component: Projects},
            {path: '/objects', component: MstrObjects},
        ];
        const routesDefined = [];
        // when
        const componentWrapper = mount(<App />);
        // then
        const routesWrapper = componentWrapper.find('Route');
        routesWrapper.forEach((routeWrapper) => {
            routesDefined.push({
                path: routeWrapper.props().path,
                component: routeWrapper.props().component,
            });
        });
        expect(routesDefined.sort()).toEqual(routesExpected.sort());
    });
});
