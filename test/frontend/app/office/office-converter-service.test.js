import React from 'react'; // eslint-disable-line
import _officeConverterService from '../../../../src/frontend/app/office/office-converter-service';
import {testReport, simpleReport, complexReport} from '../../../../src/frontend/app/mockData';

describe('getConvertedTable', () => {
    it('should convert simple report', () => {
        // when
        const result = _officeConverterService(simpleReport);
        // then
        expect(result).toBeDefined();
    });

    it('should convert test report', () => {
        // when
        const result = _officeConverterService(testReport);
        // then
        expect(result).toBeDefined();
    });

    it('should convert complex report', () => {
        // when
        const result = _officeConverterService(complexReport);
        // then
        expect(result).toBeDefined();
    });
});
