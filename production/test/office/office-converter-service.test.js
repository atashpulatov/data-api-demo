import React from 'react'; // eslint-disable-line no-unused-vars
import path from 'path';
import testHelper from '../test-helper';
import {mockReports} from '../mockData';
import {officeConverterService} from '../../src/office/office-converter-service';

describe('OfficeConverterService', () => {
  it('should convert simple report', () => {
    // given
    const expectedReportPath = path.join(
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
    const expectedReportPath = path.join(
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
    const expectedReportPath = path.join(
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
    const expectedReportPath = path.join(
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

  it('should split forms of attribute when there are many', () => {
    // given
    const expectedReportPath = path.join(
        __dirname,
        '__expected__/expected-multiline-header-report.js'
    );
    // when
    const result = officeConverterService.getConvertedTable(mockReports[3]);
    // then
    expect(result).toBeDefined();
    testHelper.expectPropertiesDefined(result);
    expect(result.headers).toContain('Customer Last Name');
    expect(result.headers).toContain('Customer First Name');
    expect(result.headers).toContain('Customer ID');

    result.rows.forEach((row) => {
      expect(row['Customer Last Name']).toBeDefined();
      expect(row['Customer First Name']).toBeDefined();
      expect(row['Customer ID']).toBeDefined();
    });

    testHelper.expectEqualsGivenReport(result, expectedReportPath);
  });

  it('should convert complex attributes report', () => {
    // given
    const expectedReportPath = path.join(
        __dirname,
        '__expected__/expected-complex-attributes-report.js'
    );
    // when
    const result = officeConverterService.getConvertedTable(mockReports[4]);
    // then
    expect(result).toBeDefined();
    testHelper.expectPropertiesDefined(result);
    expect(result.headers).toContain('Category DESC');
    expect(result.headers).toContain('Category ID');
    expect(result.headers).toContain('Subcategory');
    expect(result.headers).toContain('Units Received');

    result.rows.forEach((row) => {
      expect(row['Category DESC']).toBeDefined();
      expect(row['Category ID']).toBeDefined();
      expect(row['Subcategory']).toBeDefined();
      expect(row['Units Received']).toBeDefined();
    });

    testHelper.expectEqualsGivenReport(result, expectedReportPath);
  });
});
