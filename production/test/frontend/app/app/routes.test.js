/* eslint-disable no-unused-vars */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Routes } from '../../../../src/frontend/app/routes.jsx';
/* eslint-enable  */
import { shallow, mount } from 'enzyme';
import { pathEnum } from '../../../../src/frontend/app/path-enum';
import { Error } from '../../../../src/frontend/app/error.jsx';
import { routeContainer } from '../../../../src/frontend/app/routeContainer';

describe('Routes', () => {
    it('should return path to Navigator for / path', () => {
        const wrapper = shallow(
            <MemoryRouter initialEntries={[{
                pathname: '/',
                state: { origin: {} },
            }]}>
                <Routes />
            </MemoryRouter>
        );
        let wrapperPart = wrapper.find(routeContainer.Projects);
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
    it('should return proper route for each valid path', () => {
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
