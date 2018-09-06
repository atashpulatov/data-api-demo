/* eslint-disable */
import React from 'react';
import { Projects, _Projects } from '../../../../src/frontend/app/project/project-list';
import { mount } from 'enzyme';
import { projects } from './mock-data';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { projectRestService } from '../../../../src/frontend/app/project/project-rest-service';
import { reduxStore } from '../../../../src/frontend/app/store';
import { Provider } from 'react-redux';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
/* eslint-enable */

jest.mock('../../../../src/frontend/app/project/project-rest-service');

describe('ProjectList', () => {
    beforeEach(() => {
        expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();

        projectRestService.getProjectList
            .mockResolvedValue(projects.projectsArray);
    });

    afterEach(() => {
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    });

    // User sees data loaded
    it('should load projects on mount', async () => {
        // when
        const componentWrapper = mount(<_Projects />);
        await componentWrapper.instance().componentDidMount();
        // then
        expect(componentWrapper.state().projects).toBe(projects.projectsArray);
    });

    it('should dispatch logout on unauthorized', async () => {
        // given
        projectRestService.getProjectList
            .mockImplementation(() => {
                throw new UnauthorizedError();
            });
        // when
        await mountAndReturn();
        // then
        expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
    });

    it('should pass error on other error types', async () => {
        try {
            // given
            projectRestService.getProjectList
                .mockImplementation(() => {
                    throw new Error();
                });
            // when
            await mountAndReturn();
            // then
        } catch (err) {
            // done!
        }
    });

    // User sees all data
    it('shoud have all rows', async () => {
        // when
        const componentWrapper = await mountAndReturn();
        // then
        const items = componentWrapper.find('ul');
        expect(items.children()).toHaveLength(projects.projectsArray.length);
    });

    // User notices projects' info
    it('shoud row be rendered', async () => {
        // when
        const componentWrapper = await mountAndReturn();
        // then
        const items = componentWrapper.find('ul');
        // should have proper css class
        expect(items.hasClass('project-row-container')).toBeTruthy();

        items.children().forEach((row) => {
            const projectRow = row.props().projectRow;
            // should have row defined
            expect(projectRow).toBeDefined();

            // should have name and alias
            expect(row.find('label').text()).toBeTruthy();
        });
    });

    // User sees that project is clickable
    it('should have proper mouse pointer icon on Mouse Over', async () => {
        // when
        const componentWrapper = await mountAndReturn();
        const items = componentWrapper.find('ul');
        const projectRowLi = items.childAt(0).find('li');
        // then
        expect(projectRowLi.hasClass('cursor-is-pointer')).toBeTruthy();
    });

    // User can click the project
    it('shoud row be clickable', async () => {
        // when
        const componentWrapper = await mountAndReturn();
        const items = componentWrapper.find('ul');
        const firstItem = items.childAt(0);

        // then
        expect(firstItem.find('li').props().onClick).toBeDefined();
    });

    it('shoud row be reponsive', async () => {
        const originalMethod = _Projects.prototype.projectChosen;
        // given
        const mockClick = jest.fn();
        try {
            _Projects.prototype.projectChosen = mockClick;
            // when
            const componentWrapper = await mountAndReturn();
            const items = componentWrapper.find('ul');
            const firstItem = items.childAt(0);

            firstItem.find('li').simulate('click');

            // then
            expect(mockClick).toBeCalled();
            expect(originalMethod).toBeDefined();
        } finally {
            _Projects.prototype.projectChosen = originalMethod;
        }
    });

    it('should dispatch project when clicked', async () => {
        // given
        const expectedProjectId = projects.projectsArray[0].id;
        const expectedProjectName = projects.projectsArray[0].name;
        const wrappedProvider = await mountAndReturn();

        const items = wrappedProvider.find('ul');
        const firstItem = items.childAt(0);
        expect(reduxStore.getState().historyReducer.project).not.toBeDefined();

        // when
        firstItem.find('li').simulate('click');

        // then
        const savedProject = reduxStore.getState().historyReducer.project;
        expect(savedProject).toBeDefined();
        expect(savedProject.projectId).toBe(expectedProjectId);
        expect(savedProject.projectName).toBe(expectedProjectName);
    });

    // User sees it reacts to project chosen
    it('should be wrapped w/ withNavigation HOC', () => {
        // given
        const history = {
            push: jest.fn(),
        };
        // when
        const wrappedProvider = mount(
            <Provider store={reduxStore}>
                <Projects history={history} />
            </Provider>);
        // then
        const wrappedConnect = wrappedProvider.childAt(0);
        const wrappedWithNavigation = wrappedConnect.childAt(0);
        const wrappedComponent = wrappedWithNavigation.childAt(0);
        expect(
            wrappedComponent.type().prototype instanceof React.Component
        ).toBeTruthy();
        expect(_Projects.prototype.isPrototypeOf(wrappedComponent.instance()));
    });
});

async function mountAndReturn() {
    const history = {
        push: jest.fn(),
    };
    const wrappedProvider =
        mount(<Provider store={reduxStore}>
            <Projects history={history} />
        </Provider>);
    const wrappedConnect = wrappedProvider.childAt(0);
    const wrappedWithNavigation = wrappedConnect.childAt(0);
    const componentWrapper = wrappedWithNavigation.childAt(0);
    await componentWrapper.instance().componentDidMount();
    wrappedProvider.update();
    return wrappedProvider;
}

