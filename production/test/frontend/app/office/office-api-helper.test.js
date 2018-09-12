/* eslint-disable */
import { officeApiHelper } from '../../../../src/frontend/app/office/office-api-helper';
import { IncorrectInputTypeError } from '../../../../src/frontend/app/office/incorrect-input-type';
import { OfficeExtension } from './__mock__object__/OfficeExtension';
import { OfficeError } from '../../../../src/frontend/app/office/office-error';
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
            { id: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215' },
            { id: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215' },
            { id: 'Simple_B542_BD1E844211E85FF53EFB5F215' },
            { id: 'Report_B22222_BD11E85FF536AB0080EFB5F215' },
            { id: 'port_BASDFFF2_4211E85FF536AB0080EFB5F215' },
        ];
        const resultExpectedArray = [
            {
                id: 'BD1E844211E85FF536AB0080EFB5F215',
                name: 'SimpleReport',
                bindId: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215',
            },
            {
                id: 'BD1E84FF536AB0080EFB5F215',
                name: 'ComplexReport',
                bindId: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215',
            },
            {
                id: 'BD1E844211E85FF53EFB5F215',
                name: 'Simple',
                bindId: 'Simple_B542_BD1E844211E85FF53EFB5F215',
            },
            {
                id: 'BD11E85FF536AB0080EFB5F215',
                name: 'Report',
                bindId: 'Report_B22222_BD11E85FF536AB0080EFB5F215',
            },
            {
                id: '4211E85FF536AB0080EFB5F215',
                name: 'port',
                bindId: 'port_BASDFFF2_4211E85FF536AB0080EFB5F215',
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
});
