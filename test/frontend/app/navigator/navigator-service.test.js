import NavigationService from '../../../../src/frontend/app/navigator/navigation-service';
import projectRestService from '../../../../src/frontend/app/project/project-rest-service';
import projectRestServiceMock from '../project/project-rest-service-mock';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import mstrObjectRestServiceMock from '../mstr-objects/mstr-object-rest-service-mock';
import propertiesEnum from '../../../../src/frontend/app/storage/properties-enum';

describe('NavigatorService', () => {
    it('should give a path object to authentication page',
        async () => {
            // given
            const authToken = sessionStorage.getItem(propertiesEnum.authToken);
            // when
            const pathObject = await NavigationService.getNavigationRoute();
            // then
            expect(authToken).toBeNull();
            expect(pathObject).toBeDefined();
            expect(pathObject.pathname).toBeDefined();
            expect(pathObject.pathname).toContain('/auth');
            expect(pathObject.state).toBeDefined();
        });

    it('should give a path object to project page',
        async () => {
            // given
            const authToken = 'someAuthToken';
            sessionStorage.setItem(propertiesEnum.authToken, authToken);
            projectRestService.getProjectList = projectRestServiceMock.getProjectList;
            // when
            const pathObject = await NavigationService.getNavigationRoute();
            // then
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

    it('should give a path object to folder contents',
        async () => {
            // given
            const authToken = 'someAuthToken';
            sessionStorage.setItem(propertiesEnum.authToken, authToken);
            const projectId = 'someProjectId';
            sessionStorage.setItem(propertiesEnum.projectId, projectId);
            mstrObjectRestService.getProjectContent
                = mstrObjectRestServiceMock.getProjectContent;
            // when
            const pathObject = await NavigationService.getNavigationRoute();
            // then
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
});
