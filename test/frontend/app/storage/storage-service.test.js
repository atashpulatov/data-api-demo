
/* eslint-disable */
import { storageService } from '../../../../src/frontend/app/storage/storage-service';
import UnknownPropertyError from '../../../../src/frontend/app/storage/unknown-property-error';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
/* eslint-enable */

describe('StorageService', () => {
    it('should set value x-mstr-authtoken to storageService', () => {
        // given
        let firstToken = 'firstTokenTest1';
        let property = sessionProperties.authToken;
        // when
        storageService.setProperty(property, firstToken);
        // then
        const tokenToCheck = storageService.getProperty(property);
        expect(tokenToCheck).toBeDefined();
        expect(tokenToCheck).toEqual(firstToken);
    });
    it('should update value of x-mstr-authtoken in storageService', () => {
        // given
        let firstToken = 'firstTokenTest2';
        let secondToken = 'secondTokenTest2';
        let property = sessionProperties.authToken;
        // when
        storageService.setProperty(property, firstToken);
        storageService.setProperty(property, secondToken);
        // then
        expect(storageService.getProperty(property)).toBeDefined();
        expect(storageService.getProperty(property)).toEqual(secondToken);
    });
    it('should set value x-mstr-projectid to storageService', () => {
        // given
        let firstProject = 'firstProjectTest3';
        let property = sessionProperties.projectId;
        // when
        storageService.setProperty(property, firstProject);
        // then
        expect(storageService.getProperty(property)).toBeDefined();
        expect(storageService.getProperty(property)).toEqual(firstProject);
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
        let property = sessionProperties.authToken;
        storageService.setProperty(property, firstToken);
        // when
        let propertyValue = storageService.getProperty(property);
        // then
        expect(propertyValue).toBeDefined();
        expect(propertyValue).toEqual(firstToken);
    });
});
