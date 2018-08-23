import { officeApiHelper } from '../../../../src/frontend/app/office/office-api-helper';
import { IncorrectInputTypeError } from '../../../../src/frontend/app/office/incorrect-input-type';

describe('OfficeApiHelper', () => {
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

    it('should error due to incorrect header count', () => {
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
});
