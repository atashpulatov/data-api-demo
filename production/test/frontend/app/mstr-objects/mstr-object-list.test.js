/* eslint-disable */
import React from 'react';
import { MstrObjects, _MstrObjects } from '../../../../src/frontend/app/mstr-object/mstr-object-list';
import { mount } from 'enzyme';
import { mstrTutorial } from '../mockData';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { mstrObjectRestService } from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import { reduxStore } from '../../../../src/frontend/app/store';
import { historyReducer } from '../../../../src/frontend/app/history/history-reducer';
import { historyHelper } from '../../../../src/frontend/app/history/history-helper';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { Provider } from 'react-redux';
/* eslint-enable */

jest.mock('../../../../src/frontend/app/mstr-object/mstr-object-rest-service');

describe('MstrObjectList', () => {
    const mockProjectObjects = [];
    const mockFolderObjects = [];
    const givenEnvUrl = 'envUrl';
    const givenToken = 'token';
    const givenProject = {
        projectId: 'projectId',
        projectName: 'projectName',
    };
    const props = {
        authToken: givenToken,
        project: givenProject,
    };

    beforeAll(() => {
        mockProjectObjects.push(...mstrTutorial);
        mockFolderObjects.push(...mstrTutorial.slice(0, 1));

        mstrObjectRestService.getProjectContent
            .mockResolvedValue(mockProjectObjects);
        mstrObjectRestService.getFolderContent
            .mockResolvedValue(mockFolderObjects);
    });

    beforeEach(() => {
        expect(reduxStore.getState().historyReducer.directoryArray)
            .not.toBeDefined();

        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            envUrl: givenEnvUrl,
            username: 'user',
        });
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: givenToken,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            ...givenProject,
        });
    });

    afterEach(() => {
        mstrObjectRestService.getProjectContent.mockClear();
        mstrObjectRestService.getFolderContent.mockClear();
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    });

    it('should load project content when no dir saved', async () => {
        // when
        const wrappedComponent = mount(<_MstrObjects />);
        await wrappedComponent.instance().componentDidMount();
        // then
        expect(mstrObjectRestService.getProjectContent).toBeCalled();
        expect(mstrObjectRestService.getProjectContent)
            .toBeCalledWith(givenEnvUrl, givenToken, givenProject.projectId);
        expect(wrappedComponent.state().mstrObjects)
            .toBe(mockProjectObjects);
    });

    it('should load folder content when some dir saved', async () => {
        // given
        const givenDirId = 'dirId';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: givenDirId,
            dirName: 'dirName',
        });
        // when
        const wrappedComponent = mount(<_MstrObjects />);
        await wrappedComponent.instance().componentDidMount();
        // then
        expect(mstrObjectRestService.getFolderContent).toBeCalled();
        expect(mstrObjectRestService.getFolderContent)
            .toBeCalledWith(givenEnvUrl, givenToken, givenProject.projectId,
                givenDirId);
        expect(wrappedComponent.state().mstrObjects)
            .toBe(mockFolderObjects);
    });

    // User sees all data
    it('should have all rows', async () => {
        // when
        const wrappedComponent = mount(<_MstrObjects />);
        await wrappedComponent.instance().componentDidMount();
        wrappedComponent.update();
        // then

        // mockMstrObjects consists of project representation also,
        // which we don't want to display here
        expect(wrappedComponent.find('li'))
            .toHaveLength(mockProjectObjects.length - 1);
    });

    // User notices directories' info
    it('should directory rows be rendered', async () => {
        // when
        const wrappedComponent = mount(<_MstrObjects />);
        await wrappedComponent.instance().componentDidMount();
        wrappedComponent.update();
        // then
        expect(wrappedComponent.find('li'))
            .toHaveLength(mockProjectObjects.length - 1);

        const items = wrappedComponent.find('ul');
        const directories = items.at(0); // directories first

        directories.children().forEach((row) => {
            const directory = row.props().directory;
            // should have row defined
            expect(directory).toBeDefined();

            // should have name and image
            expect(row.find('label').text()).toBeTruthy();
            expect(row.find('img').html()).toBeTruthy();
        });
    });

    // User notices reports' info
    it('should report rows be rendered', async () => {
        // when
        const componentWrapper = mount(<_MstrObjects />);
        await componentWrapper.instance().componentDidMount();
        componentWrapper.update();
        // then
        expect(componentWrapper.find('li'))
            .toHaveLength(mockProjectObjects.length - 1);

        const items = componentWrapper.find('ul');
        const reports = items.at(1); // reports second

        reports.children().forEach((row) => {
            const report = row.props().report;
            // should have row defined
            expect(report).toBeDefined();

            // should have name and image
            expect(row.find('label').text()).toBeTruthy();
            expect(row.find('img').html()).toBeTruthy();
        });
    });

    // User sees directories may be clicked
    it('should directory rows be clickable', async () => {
        // when
        const componentWrapper = mount(<_MstrObjects />);
        await componentWrapper.instance().componentDidMount();
        componentWrapper.update();
        // then
        expect(componentWrapper.find('li'))
            .toHaveLength(mockProjectObjects.length - 1);

        const items = componentWrapper.find('ul');
        const directories = items.at(0); // directories first

        directories.children().forEach((row) => {
            const directoryRowLi = row.find('li');
            expect(directoryRowLi.hasClass('cursor-is-pointer')).toBeTruthy();
        });
    });

    // User can click a directory
    it('should directory row be reponsive', async () => {
        // given
        const originalMethod = _MstrObjects.prototype.navigateToDir;
        const mockClick = jest.fn();
        try {
            _MstrObjects.prototype.navigateToDir = mockClick;
            // when
            const componentWrapper = mount(<_MstrObjects />);
            await componentWrapper.instance().componentDidMount();
            componentWrapper.update();

            // then
            const items = componentWrapper.find('ul');
            const directories = items.at(0); // directories first

            directories.children().forEach((row) => {
                const directoryRowLi = row.find('li');
                directoryRowLi.simulate('click');
                expect(mockClick).toBeCalled();
            });
            expect(originalMethod).toBeDefined();
        } finally {
            _MstrObjects.prototype.navigateToDir = originalMethod;
        }
    });

    // User can open a directory
    it('should dispatch directory when clicked', async () => {
        // given
        const componentWrapper = mount(<_MstrObjects />);
        await componentWrapper.instance().componentDidMount();
        componentWrapper.update();

        const items = componentWrapper.find('ul');
        const directories = items.at(0); // directories first

        // when
        let iterateId = 0;
        directories.children().forEach((row) => {
            const dirId = mockProjectObjects[iterateId].id;
            const dirName = mockProjectObjects[iterateId].name;
            const directoryRowLi = row.find('li');
            directoryRowLi.simulate('click');

            // then
            const dirrArray = reduxStore.getState()
                .historyReducer.directoryArray;
            const currDir = historyHelper.getCurrentDirectory(dirrArray);
            expect(currDir.dirId).toBe(dirId);
            expect(currDir.dirName).toBe(dirName);
            ++iterateId;
        });
    });

    it('should rerender with different content dir changed in redux state',
        async () => {
            // given
            const expectedDir = {
                dirId: 'directoryId',
                dirName: 'directoryName',
            };

            const wrappedProvider = await mountAndReturn();
            mstrObjectRestService.getFolderContent.mockClear();
            expect(mstrObjectRestService.getFolderContent)
                .not.toBeCalled();

            // when
            reduxStore.dispatch({
                type: historyProperties.actions.goInside,
                ...expectedDir,
            });

            // then
            expect(mstrObjectRestService.getFolderContent).toBeCalled();
            expect(mstrObjectRestService.getFolderContent)
                .toBeCalledWith(givenEnvUrl, givenToken, givenProject.projectId,
                    expectedDir.dirId);

            wrappedProvider.update();
            const wrappedConnect = wrappedProvider.childAt(0);
            const wrappedWithNavigation = wrappedConnect.childAt(0);
            const wrappedInsideConnect = wrappedWithNavigation.childAt(0);
            const wrappedComponent = wrappedInsideConnect.childAt(0);

            expect(wrappedComponent.props().directoryArray)
                .toEqual([expectedDir]);
        }
    );

    // User sees reports may be clicked
    it.skip('should', () => {
        expect(false).toBeTruthy();
    }
    );

    // User can click a report

    // User can open report

    // User sees it reacts to global redux state changes
    // [authToken, projectId]
    it('should be wrapped w/ withNavigation HOC', () => {
        // given
        const history = {
            push: jest.fn(),
        };
        // when
        const wrappedProvider = mount(
            <Provider store={reduxStore}>
                <MstrObjects history={history} />
            </Provider>);
        // then
        const wrappedConnect = wrappedProvider.childAt(0);
        const wrappedWithNavigation = wrappedConnect.childAt(0);
        const wrappedInsideConnect = wrappedWithNavigation.childAt(0);
        const wrappedComponent = wrappedInsideConnect.childAt(0);
        expect(wrappedComponent.props()).toBeDefined();
        expect(
            wrappedComponent.type().prototype instanceof React.Component
        ).toBe(true);
        expect(
            _MstrObjects.prototype.isPrototypeOf(wrappedComponent.instance())
        ).toBe(true);
    });
});

async function mountAndReturn() {
    const history = {
        push: jest.fn(),
    };
    const wrappedProvider = mount(
        <Provider store={reduxStore}>
            <MstrObjects history={history} />
        </Provider>
    );
    const wrappedConnect = wrappedProvider.childAt(0);
    const wrappedWithNavigation = wrappedConnect.childAt(0);
    const wrappedInsideConnect = wrappedWithNavigation.childAt(0);
    const wrappedComponent = wrappedInsideConnect.childAt(0);
    await wrappedComponent.instance().componentDidMount();
    wrappedProvider.update();
    return wrappedProvider;
}
