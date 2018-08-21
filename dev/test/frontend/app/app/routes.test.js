/* eslint-disable no-unused-vars */
import React from 'react';
import { MemoryRouter, Switch } from 'react-router-dom';
import Routes from '../../../../src/frontend/app/routes.jsx';
/* eslint-enable  */
import { mount } from 'enzyme';
import di from '../../../../src/frontend/app/root-di';
import PathEnum from '../../../../src/frontend/app/path-enum';

const Error = di.Error;

describe('Routes', () => {
    it('should return path to Navigator for / path', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[{pathname: '/',
                                            state: {origin: {}}}]}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(di.Navigator);
        expect(wrapperPart).toHaveLength(1);
    });
    it('should return Error for incorrect path', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[{pathname: '/auth23',
                                            state: {origin: {}}}]}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(Error);
        expect(wrapperPart).toHaveLength(1);
    });
    it('should return proper route for each valid path', () => {
        PathEnum.forEach((path) => {
            let entry = {pathname: path.pathName,
                state: {
                    origin: {},
                    }};
            entry.state[path.viewState] = [];
            let wrapper = mount(
                <MemoryRouter initialEntries={[entry]}>
                    <Routes />
                </MemoryRouter>
            );
            let wrapperPart = wrapper.find(di[path.component].name);
            expect(wrapperPart).toHaveLength(1);
        });
    });
});
