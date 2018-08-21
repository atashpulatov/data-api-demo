import React from 'react'; // eslint-disable-line no-unused-vars
import path from 'path';
import testHelper from '../test-helper';
import officeConverterService from '../../../../src/frontend/app/office/office-converter-service';
import { mockReports } from '../mockData';

describe('OfficeConverterService', () => {
    it('should convert simple report', () => {
        // given
        let expectedReportPath = path.join(
            __dirname,
            '__expected__/expected-simple-report.js'
        );
        // when
        const result = officeConverterService.getConvertedTable(mockReports[1]);
        // then
        expect(result).toBeDefined();
        testHelper.expectPropertiesDefined(result);
        testHelper.expectEqualsGivenReport(result, expectedReportPath);
    });

    it('should convert test report', () => {
        // given
        let expectedReportPath = path.join(
            __dirname,
            '__expected__/expected-test-report.js'
        );
        // when
        const result = officeConverterService.getConvertedTable(mockReports[0]);
        // then
        expect(result).toBeDefined();
        testHelper.expectPropertiesDefined(result);
        testHelper.expectEqualsGivenReport(result, expectedReportPath);
    });

    it('should convert complex report', () => {
        // given
        let expectedReportPath = path.join(
            __dirname,
            '__expected__/expected-complex-report.js'
        );
        // when
        const result = officeConverterService.getConvertedTable(mockReports[2]);
        // then
        expect(result).toBeDefined();
        testHelper.expectPropertiesDefined(result);
        testHelper.expectEqualsGivenReport(result, expectedReportPath);
    });

    it('should convert same report thrice', () => {
        // given
        let expectedReportPath = path.join(
            __dirname,
            '__expected__/expected-simple-report.js'
        );
        // when
        officeConverterService.getConvertedTable(mockReports[1]);
        officeConverterService.getConvertedTable(mockReports[1]);
        const result = officeConverterService.getConvertedTable(mockReports[1]);
        // then
        expect(result).toBeDefined();
        testHelper.expectPropertiesDefined(result);
        testHelper.expectEqualsGivenReport(result, expectedReportPath);
    });
});
