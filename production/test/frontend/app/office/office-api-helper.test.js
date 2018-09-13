/* eslint-disable */
import { officeApiHelper } from '../../../../src/frontend/app/office/office-api-helper';
import { IncorrectInputTypeError } from '../../../../src/frontend/app/office/incorrect-input-type';
import { OfficeError, OfficeBindingError } from '../../../../src/frontend/app/office/office-error';
import { reduxStore } from '../../../../src/frontend/app/store';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
/* eslint-enable */

describe('OfficeApiHelper', () => {
    beforeAll(() => {
        officeApiHelper.excel = {};
    });
    it('should convert simple excel column name to number', () => {
        // given
        const columnName = 'A';
        // when
        const result = officeApiHelper.lettersToNumber(columnName);
        // then
        expect(result).toEqual(1);
    });
    it('should convert complex excel column name to number', () => {
        // given
        const columnName = 'CA';
        // when
        const result = officeApiHelper.lettersToNumber(columnName);
        // then
        expect(result).toEqual(79);
    });
    it('should throw an error due to number instead of column name', () => {
        // given
        const columnName = '23';
        let result;
        // when
        try {
            result = officeApiHelper.lettersToNumber(columnName);
        } catch (error) {
            // then
            expect(error).toBeInstanceOf(IncorrectInputTypeError);
        }
        expect(result).toBeUndefined();
    });
    it('should throw an error due to incorrect column name', () => {
        // given
        const columnName = 'alamaKota';
        let result;
        // when
        try {
            result = officeApiHelper.lettersToNumber(columnName);
        } catch (error) {
            // then
            expect(error).toBeInstanceOf(IncorrectInputTypeError);
        }
        expect(result).toBeUndefined();
    });
    it('should return proper range for normal case range starting at A1', () => {
        // given
        const headerCount = 12;
        const startCell = 'A1';
        // when
        const result = officeApiHelper.getRange(headerCount, startCell);
        // then
        expect(result).toEqual('A1:L1');
    });

    it('should return proper range for normal case range starting at AL1234', () => {
        // given
        const headerCount = 12;
        const startCell = 'AL1234';
        // when
        const result = officeApiHelper.getRange(headerCount, startCell);
        // then
        expect(result).toEqual('AL1234:AW1234');
    });

    it('should return proper range for very small range', () => {
        // given
        const headerCount = 1;
        const startCell = 'A1';
        // when
        const result = officeApiHelper.getRange(headerCount, startCell);
        // then
        expect(result).toEqual('A1:A1');
    });

    it('should return proper range for very huge range', () => {
        // given
        const headerCount = 1001;
        const startCell = 'A1';
        // when
        const result = officeApiHelper.getRange(headerCount, startCell);
        // then
        expect(result).toEqual('A1:ALM1');
    });

    it('should error due to incorrect start cell', () => {
        // given
        const headerCount = 1001;
        const startCell = 'A!1';
        let result;
        // when
        try {
            result = officeApiHelper.getRange(headerCount, startCell);
        } catch (error) {
            // then
            expect(error).toBeInstanceOf(IncorrectInputTypeError);
        }
        expect(result).toBeUndefined();
    });

    it('should throw error due to incorrect header count', () => {
        // given
        const headerCount = 'asd';
        const startCell = 'A1';
        let result;
        // when
        try {
            result = officeApiHelper.getRange(headerCount, startCell);
        } catch (error) {
            // then
            expect(error).toBeInstanceOf(IncorrectInputTypeError);
        }
        expect(result).toBeUndefined();
    });
    it('should forward error different than OfficeExtension.Error', () => {
        // given
        const error = new Error();
        // when
        const callThatThrows = () => {
            officeApiHelper.handleOfficeApiException(error);
        };
        // then
        expect(callThatThrows).toThrowError();
    });
    it('should return proper bindingsArray', () => {
        // given
        const entryArray = [
            { id: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215_projectId_envUrl' },
            { id: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215_projectId_envUrl' },
            { id: 'Simple_B542_BD1E844211E85FF53EFB5F215_projectId_envUrl' },
            { id: 'Report_B22222_BD11E85FF536AB0080EFB5F215_projectId_envUrl' },
            { id: 'port_BASDFFF2_4211E85FF536AB0080EFB5F215_projectId_envUrl' },
        ];
        const resultExpectedArray = [
            {
                id: 'BD1E844211E85FF536AB0080EFB5F215',
                name: 'SimpleReport',
                bindId: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215_projectId_envUrl',
                projectId: 'projectId',
                envUrl: 'envUrl',
            },
            {
                id: 'BD1E84FF536AB0080EFB5F215',
                name: 'ComplexReport',
                bindId: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215_projectId_envUrl',
                projectId: 'projectId',
                envUrl: 'envUrl',
            },
            {
                id: 'BD1E844211E85FF53EFB5F215',
                name: 'Simple',
                bindId: 'Simple_B542_BD1E844211E85FF53EFB5F215_projectId_envUrl',
                projectId: 'projectId',
                envUrl: 'envUrl',
            },
            {
                id: 'BD11E85FF536AB0080EFB5F215',
                name: 'Report',
                bindId: 'Report_B22222_BD11E85FF536AB0080EFB5F215_projectId_envUrl',
                projectId: 'projectId',
                envUrl: 'envUrl',
            },
            {
                id: '4211E85FF536AB0080EFB5F215',
                name: 'port',
                bindId: 'port_BASDFFF2_4211E85FF536AB0080EFB5F215_projectId_envUrl',
                projectId: 'projectId',
                envUrl: 'envUrl',
            },
        ];
        // when
        const resultArray = officeApiHelper._excelBindingsToStore(entryArray);
        // then
        expect(resultArray).toEqual(resultExpectedArray);
    });
    it('should throw error due to undefined forwarded', () => {
        // given
        const entryArray = undefined;
        // when
        const wrongMethodCall = () => {
            officeApiHelper._excelBindingsToStore(entryArray);
        };
        // then
        expect(wrongMethodCall).toThrowError(OfficeError);
        expect(wrongMethodCall).toThrowError('Bindings should not be undefined!');
    });
    it('should throw error due to non array type forwarder', () => {
        // given
        const entryArray = {};
        // when
        const wrongMethodCall = () => {
            officeApiHelper._excelBindingsToStore(entryArray);
        };
        // then
        expect(wrongMethodCall).toThrowError(OfficeError);
        expect(wrongMethodCall).toThrowError('Bindings must be of Array type!');
    });
    it('should return current mstr context data', () => {
        // given
        const project = {
            projectId: 'testProjectId',
            projectName: 'testProjectName',
        };
        const envUrl = 'testEnvUrl';
        const username = 'testusername';
        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username,
            envUrl,
            password: '',
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: project.projectId,
            projectName: project.projectName,
        });
        // when
        const result = officeApiHelper.getCurrentMstrContext();
        // then
        expect(result.envUrl).toBe(envUrl);
        expect(result.projectId).toBe(project.projectId);
        expect(result.username).toBe(username);
    });
    describe('createBindingId', () => {
        it('should return proper bindingId', () => {
            // given
            const reportId = 'someReportId';
            const reportName = 'someReportName';
            const envUrl = 'someTestUrl';
            const projectId = 'someTestProjectId';
            const convertedReportDataMock = {
                id: reportId,
                name: reportName,
            };
            const separator = '_';
            const startCell = 'someCELL';
            const expectedBindId = `${reportName}_${startCell}_${reportId}_${projectId}_${envUrl}`;
            // when
            const receivedBindId = officeApiHelper.createBindingId(convertedReportDataMock, startCell, projectId, envUrl, separator);
            // then
            expect(receivedBindId).toEqual(expectedBindId);
        });
        it('should return proper bindingId with different separator', () => {
            // given
            const reportId = 'someReportId';
            const reportName = 'someReportName';
            const envUrl = 'someTestUrl';
            const projectId = 'someTestProjectId';
            const convertedReportDataMock = {
                id: reportId,
                name: reportName,
            };
            const separator = '-';
            const startCell = 'someCELL';
            const expectedBindId = `${reportName}-${startCell}-${reportId}-${projectId}-${envUrl}`;
            // when
            const receivedBindId = officeApiHelper.createBindingId(convertedReportDataMock, startCell, projectId, envUrl, separator);
            // then
            expect(receivedBindId).toEqual(expectedBindId);
        });
        it('should throw error due to missing convertedReportData', () => {
            // given
            const convertedReportDataMock = undefined;
            const separator = '-';
            const startCell = 'someCELL';
            const envUrl = 'someTestUrl';
            const projectId = 'someTestProjectId';
            // when
            const wrongMethodCall = () => {
                officeApiHelper.createBindingId(convertedReportDataMock, startCell, projectId, envUrl, separator);
            };
            // then
            expect(wrongMethodCall).toThrowError(OfficeBindingError);
            expect(wrongMethodCall).toThrowError('Missing reportConvertedData');
        });
        it('should throw error due to missing startCell', () => {
            // given
            const reportId = 'someReportId';
            const reportName = 'someReportName';
            const envUrl = 'someTestUrl';
            const projectId = 'someTestProjectId';
            const convertedReportDataMock = {
                id: reportId,
                name: reportName,
            };
            const startCell = undefined;
            const separator = '-';
            // when
            const wrongMethodCall = () => {
                officeApiHelper.createBindingId(convertedReportDataMock, startCell, projectId, envUrl, separator);
            };
            // then
            expect(wrongMethodCall).toThrowError(OfficeBindingError);
            expect(wrongMethodCall).toThrowError('Missing startCell');
        });
        it('should return proper bindingId despite not providing separator', () => {
            // given
            const reportId = 'someReportId';
            const reportName = 'someReportName';
            const envUrl = 'someTestUrl';
            const projectId = 'someTestProjectId';
            const convertedReportDataMock = {
                id: reportId,
                name: reportName,
            };
            const startCell = 'someCELL';
            const expectedBindId = `${reportName}_${startCell}_${reportId}_${projectId}_${envUrl}`;
            // when
            const receivedBindId = officeApiHelper.createBindingId(convertedReportDataMock, startCell, projectId, envUrl);
            // then
            expect(receivedBindId).toEqual(expectedBindId);
        });
    });
});
