import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { officeApiHelper } from '../office/api/office-api-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';
import stepExportExcelToCurrentWorkbook from './step-export-excel-to-current-workbook';

describe('StepExportExcelToCurrentWorkbook', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('exportExcelToCurrentWorkBook should work as expected', async () => {
        // given
        const objectData = {
            objectWorkingId: 1234567,
            objectId: 'objectId',
            visualizationInfo: {
                visualizationKey: 'W36'
            },
            projectId: 'projectId'
        } as ObjectData;

        const response = { blob: jest.fn().mockReturnValue } as any;

        const operationData = {
            objectWorkingId: 'objectWorkingIdTest',
            excelContext: 'excelContextTest',
            instanceDefinition: 'instanceDefinitionTest',
            startCell: 'startCellTest',
        } as unknown as OperationData;

        jest.spyOn(mstrObjectRestService, 'exportDossierToExcel').mockReturnValue(response);

        jest
            .spyOn(officeApiHelper, 'getExcelContext')
            .mockImplementationOnce((): any => Promise.resolve({ sync: jest.fn() }));

        jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

        jest.spyOn(operationStepDispatcher, 'completeGetOfficeTableImport').mockImplementation();

        // when
        await stepExportExcelToCurrentWorkbook.exportExcelToCurrentWorkBook(objectData, operationData);

        expect(mstrObjectRestService.exportDossierToExcel).toHaveBeenCalled();
    });
});
