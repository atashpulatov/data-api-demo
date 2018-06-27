/* eslint-disable */
import NavigationService from '../../../../src/frontend/app/navigator/navigation-service';
import projectRestService from '../../../../src/frontend/app/project/project-rest-service';
import { projects } from '../project/mock-data';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import { mstrTutorial } from '../mockData';
import propertiesEnum from '../../../../src/frontend/app/storage/properties-enum';
/* eslint-enable */

describe('NavigatorService', () => {
    // given
    const envUrl = 'someEnvUrl';
    const authToken = 'someAuthToken';
    const projectId = 'someProjectId';

    let _originalGetProjectList;
    let _originalGetProjectContent;
    let _originalGetFolderContent;

    beforeAll(() => {
        _originalGetProjectList = projectRestService.getProjectList;
        projectRestService.getProjectList = jest.fn();
        projectRestService.getProjectList
            .mockResolvedValue(projects.projectsArray);

        _originalGetProjectContent = mstrObjectRestService.getProjectContent;
        mstrObjectRestService.getProjectContent = jest.fn();
        mstrObjectRestService.getProjectContent
            .mockResolvedValue(mstrTutorial);

        _originalGetFolderContent = mstrObjectRestService.getFolderContent;
        mstrObjectRestService.getFolderContent = jest.fn();
        mstrObjectRestService.getFolderContent.mockReturnValue('ProperContent');
    });

    afterAll(() => {
        projectRestService.getProjectList = _originalGetProjectList;
        mstrObjectRestService.getProjectContent = _originalGetProjectContent;
        mstrObjectRestService.getFolderContent = _originalGetFolderContent;
    });

    it('should give a path object to authentication page',
        async () => {
            // when
            const pathObject = NavigationService.getLoginRoute();
            // then
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/auth');
            expect(pathObject.state).toBeDefined();
        });

    it('should give a path object to project page',
        async () => {
            // when
            const pathObject = await NavigationService
                .getProjectsRoute(envUrl, authToken);
            // then
            expect(projectRestService.getProjectList)
                .toBeCalledWith(envUrl, authToken);
            expect(authToken).toBeDefined();
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/projects');
            expect(pathObject.state.projects).toBeDefined();
            expect(pathObject.state.projects.length).toBeGreaterThan(1);
            expect(pathObject.state.projects[0]).toHaveProperty('id');
            expect(pathObject.state.projects[0]).toHaveProperty('name');
            expect(pathObject.state.projects[0]).toHaveProperty('alias');
            expect(pathObject.state.projects[0]).toHaveProperty('description');
            expect(pathObject.state.projects[0]).toHaveProperty('status');
        });

    it('should give a path object to project contents',
        async () => {
            // given
            const folderType = 7;
            // when
            const pathObject = await NavigationService
                .getRootObjectsRoute(envUrl, authToken, projectId);
            // then
            expect(mstrObjectRestService.getProjectContent)
                .toBeCalledWith(folderType, envUrl, authToken, projectId);
            expect(authToken).toBeDefined();
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/objects');
            const pathObjectSet = pathObject.state.mstrObjects;
            expect(pathObjectSet).toBeDefined();
            expect(pathObjectSet.length).toBeGreaterThan(1);
            expect(pathObjectSet[0]).toHaveProperty('id');
            expect(pathObjectSet[0]).toHaveProperty('name');
            expect(pathObjectSet[0]).toHaveProperty('type');
            expect(pathObjectSet[0]).toHaveProperty('description');
            expect(pathObjectSet[0]).toHaveProperty('subtype');
            expect(pathObjectSet[0]).toHaveProperty('dateCreated');
            expect(pathObjectSet[0]).toHaveProperty('dateModified');
            expect(pathObjectSet[0]).toHaveProperty('version');
        });

    it('should give a path object to folder contents',
        async () => {
            // given
            const folderId = 'someFolderId';
            // when
            const pathObject = await NavigationService.getObjectsRoute(envUrl, authToken, projectId, folderId);
            // then
            expect(mstrObjectRestService.getFolderContent)
                .toBeCalledWith(envUrl, authToken, projectId, folderId);
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/objects');
            const pathObjectSet = pathObject.state.mstrObjects;
            expect(pathObjectSet).toBeDefined();
            expect(pathObjectSet.length).toBeGreaterThan(1);
            expect(pathObjectSet).toContain('ProperContent');
        });
});
