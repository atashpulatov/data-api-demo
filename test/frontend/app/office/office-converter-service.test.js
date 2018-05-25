import React from 'react'; // eslint-disable-line
import _officeConverterService from '../../../../src/frontend/app/office/office-converter-service';
import { testReport, simpleReport, complexReport } from '../../../../src/frontend/app/mockData';

describe('getConvertedTable', () => {
    it('should convert simple report', () => {
        // when
        const result = _officeConverterService(simpleReport);
        // then
        expect(result).toBeDefined();
        expectPropertiesDefined(result);
    });

    it('should convert test report', () => {
        // when
        const result = _officeConverterService(testReport);
        // then
        expect(result).toBeDefined();
        expectPropertiesDefined(result);
    });

    it('should convert complex report', () => {
        // when
        const result = _officeConverterService(complexReport);
        // then
        expect(result).toBeDefined();
        expectPropertiesDefined(result);
    });

    it('should convert same report thrice', () => {
        // when
        _officeConverterService(simpleReport);
        _officeConverterService(simpleReport);
        const result = _officeConverterService(simpleReport);
        // then
        expect(result).toBeDefined();
        expectPropertiesDefined(result);
    });
});

function expectPropertiesDefined(result) {
    result.rows.forEach((row) => {
        for (const property in row) {
            if (row.hasOwnProperty(property)) {
                expect(row[property]).toBeDefined();
            }
        }
    });
}

