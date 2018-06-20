/* eslint-disable no-unused-vars */
import React from 'react';
import { MemoryRouter, Switch } from 'react-router-dom';
/* eslint-enable  */
import { mount } from 'enzyme';
import di from '../../../../src/frontend/app/root-di';
import Routes from '../../../../src/frontend/app/routes.jsx';
import PathEnum from '../../../../src/frontend/app/path-enum';
import Error from '../../../../src/frontend/app/error';

describe('Routes', () => {
    it('should return path to Navigator for / path', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[{pathname: '/auth23', state: {origin: {}}}]}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(Error);
        expect(wrapperPart).toHaveLength(1);
    });
    it('should return Error for incorrect path', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[{pathname: '/auth23', state: {origin: {}}}]}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(Error);
        expect(wrapperPart).toHaveLength(1);
    });
    it('should return proper route for each valid path', () => {
        PathEnum.forEach((path) => {
            let wrapper = mount(
                <MemoryRouter initialEntries={[{pathname: path.pathName, state: {origin: {}}}]}>
                    <Routes />
                </MemoryRouter>
            );
            let wrapperPart = wrapper.find(di[path.component].name);
            expect(wrapperPart).toHaveLength(1);
        });
    });
});
