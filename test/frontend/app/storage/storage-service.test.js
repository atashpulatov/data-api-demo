
/* eslint-disable */
import storageService from '../../../../src/frontend/app/storage/storage-service';
import UnknownPropertyError from '../../../../src/frontend/app/storage/unknown-property-error';
/* eslint-enable */

describe('StorageService', () => {
    it('should set value x-mstr-authtoken to sessionStorage', () => {
        // given
        let firstToken = 'firstTokenTest1';
        let property = 'x-mstr-authtoken';
        sessionStorage.removeItem(property);
        // when
        storageService.setProperty(property, firstToken);
        // then
        expect(sessionStorage.getItem(property)).toBeDefined();
    });
    it('should update value of x-mstr-authtoken in sessionStorage', () => {
        // given
        let firstToken = 'firstTokenTest2';
        let secondToken = 'secondToken';
        let property = 'x-mstr-authtoken';
        sessionStorage.removeItem(property);
        // when
        storageService.setProperty(property, firstToken);
        storageService.setProperty(property, secondToken);
        // then
        expect(sessionStorage.getItem(property)).toBeDefined();
        expect(sessionStorage.getItem(property)).toEqual(secondToken);
    });
    it('should set value x-mstr-projectid to sessionStorage', () => {
        // given
        let firstProject = 'firstProjectTest3';
        let property = 'x-mstr-projectid';
        sessionStorage.removeItem(property);
        // when
        storageService.setProperty(property, firstProject);
        // then
        expect(sessionStorage.getItem(property)).toBeDefined();
    });
    it('should throw an error due to misspell', () => {
        // given
        let firstToken = 'firstTokenTest4';
        let property = 'x-mstr-authtkn';
        // when
        expect(() => {
            storageService.setProperty(property, firstToken);
        }).toThrow(UnknownPropertyError);
    });
    it('should return a value of provided property', () => {
        // given
        let firstToken = 'firstTokenTest';
        let property = 'x-mstr-authtoken';
        sessionStorage.removeItem(property);
        storageService.setProperty(property, firstToken);
        // when
        let propertyValue = storageService.getProperty(property);
        // then
        expect(propertyValue).toBeDefined();
        expect(propertyValue).toEqual(firstToken);
    });
    it('should display complete list of available properties', () => {
        // given

        // when

        // then

    });
});
