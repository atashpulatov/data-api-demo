/* eslint-disable */
import React from 'react';
import { MstrObjects, _MstrObjects } from '../../src/mstr-object/mstr-object-list';
import { mount } from 'enzyme';
import { mstrTutorial } from '../mockData';
import { historyProperties } from '../../src/history/history-properties';
import { mstrObjectRestService } from '../../src/mstr-object/mstr-object-rest-service';
import { reduxStore } from '../../src/store';
import { historyHelper } from '../../src/history/history-helper';
import { sessionProperties } from '../../src/storage/session-properties';
import { Provider } from 'react-redux';
import { mstrObjectListHelper } from '../../src/mstr-object/mstr-object-list-helper';
import { selectorProperties } from '../../src/attribute-selector/selector-properties';
import { InternalServerError } from '../../src/error/internal-server-error';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
/* eslint-enable */

jest.mock('../../src/mstr-object/mstr-object-rest-service');

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

    it('should not fetch directories after navigating to all project view', async () => {
        // given
        const mstrObjectListHelperSpy = jest.spyOn(mstrObjectListHelper, 'fetchContent')
            .mockImplementation(() => {
                throw new InternalServerError();
            });
        const wrappedComponent = mount(<_MstrObjects />);
        const prevStateMock = { body: {} };
        const prevPropsMock = { body: {} };
        const notThrowingUpdate = async () => {
            await wrappedComponent.instance().componentDidUpdate(prevPropsMock, prevStateMock);
        };
        // when
        reduxStore.dispatch({
            type: historyProperties.actions.goToProjects,
        });
        // then
        await expect(notThrowingUpdate())
            .resolves.toEqual(undefined);
        mstrObjectListHelperSpy.mockRestore();
    });

    it('should not fetch directories after logging out', async () => {
        // given
        const mstrObjectListHelperSpy = jest.spyOn(mstrObjectListHelper, 'fetchContent')
            .mockImplementation(() => {
                throw new UnauthorizedError();
            });
        const wrappedComponent = mount(<_MstrObjects />);
        const prevStateMock = { body: {} };
        const prevPropsMock = { body: {} };
        const notThrowingUpdate = async () => {
            await wrappedComponent.instance().componentDidUpdate(prevPropsMock, prevStateMock);
        };
        // when
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
        // then
        await expect(notThrowingUpdate())
            .resolves.toEqual(undefined);
        mstrObjectListHelperSpy.mockRestore();
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
        expect(wrappedComponent.find('Row'))
            .toHaveLength(mockProjectObjects.length - 1);
    });

    // User notices directories' info
    it('should directory rows be rendered', async () => {
        // when
        const wrappedComponent = mount(<_MstrObjects />);
        await wrappedComponent.instance().componentDidMount();
        wrappedComponent.update();
        // then
        expect(wrappedComponent.find('Row'))
            .toHaveLength(mockProjectObjects.length - 1);

        const items = wrappedComponent.find('ul');
        const directories = items.at(0); // directories first

        directories.children().forEach((row) => {
            const directory = row.props().directory;
            // should have row defined
            expect(directory).toBeDefined();
            const rowIcon = row.find('MSTRIcon').at(0);

            // should have name and image
            expect(row.find('Col').at(1).text()).toBeTruthy();
            expect(rowIcon.props().type).toEqual('folder-collapsed');
        });
    });

    // User notices reports' info
    it('should report rows be rendered', async () => {
        // when
        const componentWrapper = mount(<_MstrObjects />);
        await componentWrapper.instance().componentDidMount();
        componentWrapper.update();
        // then
        expect(componentWrapper.find('Row'))
            .toHaveLength(mockProjectObjects.length - 1);

        const items = componentWrapper.find('ul');
        const reports = items.at(1); // reports second

        reports.children().forEach((row) => {
            const report = row.props().report;
            // should have row defined
            expect(report).toBeDefined();
            const rowIcon = row.find('MSTRIcon').at(0);

            // should have name and image
            expect(row.find('Col').at(1).text()).toBeTruthy();
            expect(rowIcon.props().type).toEqual('report');
        });
    });

    // User sees directories may be clicked
    it('should directory rows be clickable', async () => {
        // when
        const componentWrapper = mount(<_MstrObjects />);
        await componentWrapper.instance().componentDidMount();
        componentWrapper.update();
        // then
        expect(componentWrapper.find('Row'))
            .toHaveLength(mockProjectObjects.length - 1);

        const items = componentWrapper.find('ul');
        const directories = items.at(0).find('Row'); // directories first
        // TODO: we should test it in mstr-object-row tests
        directories.forEach((row) => {
            expect(row.hasClass('cursor-is-pointer')).toBeTruthy();
        });
    });

    // User can click a directory
    it('should directory row be reponsive', async () => {
        // given
        const originalMethod = mstrObjectListHelper.navigateToDir;
        const mockClick = jest.fn();
        try {
            mstrObjectListHelper.navigateToDir = mockClick;
            // when
            const componentWrapper = mount(<_MstrObjects />);
            await componentWrapper.instance().componentDidMount();
            componentWrapper.update();

            // then
            const items = componentWrapper.find('ul');
            const directories = items.at(0).find('Row'); // directories first

            directories.children().forEach((row) => {
                const directoryRowLi = row.find('Col').at(1);
                directoryRowLi.simulate('click');
                expect(mockClick).toBeCalled();
            });
            expect(originalMethod).toBeDefined();
        } finally {
            mstrObjectListHelper.navigateToDir = originalMethod;
        }
    });

    // User can open a directory
    it('should dispatch directory when clicked', async () => {
        // given
        const componentWrapper = mount(<_MstrObjects />);
        await componentWrapper.instance().componentDidMount();
        componentWrapper.update();

        const items = componentWrapper.find('ul');
        const directories = items.at(0).find('Row'); // directories first

        // when
        let iterateId = 0;
        directories.children().forEach((row) => {
            const dirId = mockProjectObjects[iterateId].id;
            const dirName = mockProjectObjects[iterateId].name;
            const directoryRowLi = row.find('Col').at(1);
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

    // User sees popup works correctly
    it('should handle command ok', () => {
        // given
        const message = `{"command": "${selectorProperties.commandOk}"}`;
        const wrappedComponent = mount(<_MstrObjects />);
        const originalMethod = wrappedComponent.instance().handleOk;
        const mockOk = jest.fn();
        try {
            wrappedComponent.instance().handleOk = mockOk;
            // when
            wrappedComponent.instance().onMessageFromPopup({ message });
            expect(mockOk).toBeCalled();
        } finally {
            wrappedComponent.instance().handleOk = originalMethod;
        }
    });

    it('should handle command cancel', () => {
        // given
        const message = `{"command": "${selectorProperties.commandCancel}"}`;
        const wrappedComponent = mount(<_MstrObjects />);
        const originalMethod = wrappedComponent.instance().handleCancel;
        const mockCancel = jest.fn();
        try {
            wrappedComponent.instance().handleCancel = mockCancel;
            // when
            wrappedComponent.instance().onMessageFromPopup({ message });
            expect(mockCancel).toBeCalled();
        } finally {
            wrappedComponent.instance().handleOk = originalMethod;
        }
    });

    it('should handle command onUpdate', () => {
        // given
        const givenBody = 'testBodytest';
        const message = `{"command": "${selectorProperties.commandOnUpdate}", "body": "${givenBody}"}`;
        const wrappedComponent = mount(<_MstrObjects />);
        const originalMethod = wrappedComponent.instance().onTriggerUpdate;
        const mockUpdate = jest.fn();
        try {
            wrappedComponent.instance().onTriggerUpdate = mockUpdate;
            // when
            wrappedComponent.instance().onMessageFromPopup({ message });
            expect(mockUpdate).toBeCalled();
            expect(mockUpdate).toBeCalledWith(givenBody);
        } finally {
            wrappedComponent.instance().onTriggerUpdate = originalMethod;
        }
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
