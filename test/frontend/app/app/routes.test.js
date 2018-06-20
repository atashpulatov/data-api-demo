/* eslint-disable no-unused-vars */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
/* eslint-enable  */
import { mount } from 'enzyme';
import Navigator from '../../../../src/frontend/app/navigator/navigator';
import Login from '../../../../src/frontend/app/authentication/auth-component';
import Projects from '../../../../src/frontend/app/project/project-list';
import MstrObjects from '../../../../src/frontend/app/mstr-object/mstr-object-list';
import Routes from '../../../../src/frontend/app/routes';

describe('App', () => {
    it('/auth should display auth component', () => {
        const wrapper = mount(
            // <MemoryRouter
            //         initialEntries={['/auth', '/projects', '/objects', { pathname: '/auth' }, '/error']}
            //         initialIndex={0}>
            <MemoryRouter initialEntries={['/auth']}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(Login);
        console.debug(wrapperPart);
        expect(wrapperPart).toHaveLength(1);
    });
});