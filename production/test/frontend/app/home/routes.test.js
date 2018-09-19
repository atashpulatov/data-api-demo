/* eslint-disable no-unused-vars */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Routes } from '../../../../src/frontend/app/home/routes.jsx';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { pathEnum } from '../../../../src/frontend/app/home/path-enum';
import { Error } from '../../../../src/frontend/app/error.jsx';
import { routeContainer } from '../../../../src/frontend/app/home/routeContainer';
import { reduxStore } from '../../../../src/frontend/app/store';
/* eslint-enable  */

describe('Routes', () => {
    it.skip('should return path to Projects for / path', () => {
        const wrapper = mount(
            <Provider store={reduxStore}>
                <MemoryRouter initialEntries={[{
                    pathname: '/',
                }]}>
                    <Routes />
                </MemoryRouter>
            </Provider>
        );
        let wrapperPart = wrapper.find('Projects');
        expect(wrapperPart).toHaveLength(1);
    });

    it('should return Error for incorrect path', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[{
                pathname: '/auth23',
                state: { origin: {} },
            }]}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(Error);
        expect(wrapperPart).toHaveLength(1);
    });
    it.skip('should return proper route for each valid path', () => {
        pathEnum.forEach((path) => {
            let entry = {
                pathname: path.pathName,
                state: {
                    origin: {},
                },
            };
            entry.state[path.viewState] = [];
            let wrapper = mount(
                <MemoryRouter initialEntries={[entry]}>
                    <Routes />
                </MemoryRouter>
            );
            let wrapperPart = wrapper.find(routeContainer[path.component].name);
            expect(wrapperPart).toHaveLength(1);
        });
    });
});
