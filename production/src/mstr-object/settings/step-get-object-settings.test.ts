import { reduxStore } from '../../store';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, ObjectSettings } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationTypes } from '../../operation/operation-type-names';
import stepGetObjectSettings from './step-get-object-settings';

describe('StepGetObjectSettings', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const getObjectSettings = (
    mergeCrosstabColumns: boolean,
    importAttributesAsText: boolean
  ): ObjectSettings => ({ mergeCrosstabColumns, importAttributesAsText });

  it.each`
    mergeCrosstabColumnsUser | importAttributesAsTextUser | objectSettings                             | expectedSettings
    ${true}                  | ${false}                   | ${getObjectSettings(false, false)}         | ${getObjectSettings(true, false)}
    ${true}                  | ${false}                   | ${getObjectSettings(undefined, undefined)} | ${getObjectSettings(true, false)}
    ${true}                  | ${true}                    | ${getObjectSettings(false, false)}         | ${getObjectSettings(true, true)}
    ${false}                 | ${false}                   | ${getObjectSettings(true, true)}           | ${getObjectSettings(false, false)}
  `(
    `should update object settings with user settings when operation type is IMPORT_OPERATION`,
    async ({
      mergeCrosstabColumnsUser,
      importAttributesAsTextUser,
      objectSettings,
      expectedSettings,
    }) => {
      // Given
      const objectData = {
        objectWorkingId: 1,
        objectSettings,
        mstrObjectType: { name: 'report' },
      } as ObjectData;
      const updateObjectMock = jest
        .spyOn(operationStepDispatcher, 'updateObject')
        .mockImplementation();
      const completeStepMock = jest
        .spyOn(operationStepDispatcher, 'completeGetObjectSettings')
        .mockImplementation();
      jest.spyOn(reduxStore, 'getState').mockReturnValue({
        // @ts-ignore
        settingsReducer: {
          mergeCrosstabColumns: mergeCrosstabColumnsUser,
          importAttributesAsText: importAttributesAsTextUser,
          worksheetObjectInfoSettings: [],
        },
      });

      // When
      await stepGetObjectSettings.getObjectSettings(objectData, {
        operationType: OperationTypes.IMPORT_OPERATION,
      } as unknown as OperationData);

      // Then
      expect(updateObjectMock).toHaveBeenCalledWith({
        ...objectData,
        objectSettings: expectedSettings,
      });

      expect(completeStepMock).toHaveBeenCalledWith(objectData.objectWorkingId);
    }
  );

  it.each`
    mergeCrosstabColumnsUser | importAttributesAsTextUser | objectSettings                             | expectedSettings
    ${true}                  | ${false}                   | ${getObjectSettings(false, false)}         | ${getObjectSettings(true, false)}
    ${true}                  | ${false}                   | ${getObjectSettings(undefined, undefined)} | ${getObjectSettings(true, false)}
    ${true}                  | ${true}                    | ${getObjectSettings(false, false)}         | ${getObjectSettings(true, true)}
    ${false}                 | ${false}                   | ${getObjectSettings(true, true)}           | ${getObjectSettings(false, false)}
  `(
    `should update object settings with user settings when operation type is EDIT_OPERATION`,
    async ({
      mergeCrosstabColumnsUser,
      importAttributesAsTextUser,
      objectSettings,
      expectedSettings,
    }) => {
      // Given
      const objectData = {
        objectWorkingId: 1,
        objectSettings,
        mstrObjectType: { name: 'report' },
      } as ObjectData;
      const updateObjectMock = jest
        .spyOn(operationStepDispatcher, 'updateObject')
        .mockImplementation();
      const completeStepMock = jest
        .spyOn(operationStepDispatcher, 'completeGetObjectSettings')
        .mockImplementation();
      jest.spyOn(reduxStore, 'getState').mockReturnValue({
        // @ts-ignore
        settingsReducer: {
          mergeCrosstabColumns: mergeCrosstabColumnsUser,
          importAttributesAsText: importAttributesAsTextUser,
          worksheetObjectInfoSettings: [],
        },
      });

      // When
      await stepGetObjectSettings.getObjectSettings(objectData, {
        operationType: OperationTypes.EDIT_OPERATION,
      } as unknown as OperationData);

      // Then
      expect(updateObjectMock).toHaveBeenCalledWith({
        ...objectData,
        objectSettings: expectedSettings,
      });

      expect(completeStepMock).toHaveBeenCalledWith(objectData.objectWorkingId);
    }
  );

  it.each`
    mergeCrosstabColumnsUser | importAttributesAsTextUser | objectSettings                             | expectedSettings
    ${true}                  | ${false}                   | ${getObjectSettings(false, false)}         | ${getObjectSettings(false, false)}
    ${true}                  | ${false}                   | ${getObjectSettings(undefined, undefined)} | ${getObjectSettings(true, false)}
    ${true}                  | ${true}                    | ${getObjectSettings(false, false)}         | ${getObjectSettings(false, false)}
    ${false}                 | ${false}                   | ${getObjectSettings(true, true)}           | ${getObjectSettings(true, true)}
  `(
    `should update object settings with user settings when operation type is DUPLICATE_OPERATION`,
    async ({
      mergeCrosstabColumnsUser,
      importAttributesAsTextUser,
      objectSettings,
      expectedSettings,
    }) => {
      // Given
      const objectData = {
        objectWorkingId: 1,
        objectSettings,
        mstrObjectType: { name: 'report' },
      } as ObjectData;
      const updateObjectMock = jest
        .spyOn(operationStepDispatcher, 'updateObject')
        .mockImplementation();
      const completeStepMock = jest
        .spyOn(operationStepDispatcher, 'completeGetObjectSettings')
        .mockImplementation();
      jest.spyOn(reduxStore, 'getState').mockReturnValue({
        // @ts-ignore
        settingsReducer: {
          mergeCrosstabColumns: mergeCrosstabColumnsUser,
          importAttributesAsText: importAttributesAsTextUser,
          worksheetObjectInfoSettings: [],
        },
      });

      // When
      await stepGetObjectSettings.getObjectSettings(objectData, {
        operationType: OperationTypes.DUPLICATE_OPERATION,
      } as unknown as OperationData);

      // Then
      expect(updateObjectMock).toHaveBeenCalledWith({
        ...objectData,
        objectSettings: expectedSettings,
      });

      expect(completeStepMock).toHaveBeenCalledWith(objectData.objectWorkingId);
    }
  );

  it.each`
    mergeCrosstabColumnsUser | importAttributesAsTextUser | objectSettings                             | expectedSettings
    ${true}                  | ${false}                   | ${getObjectSettings(false, false)}         | ${getObjectSettings(false, false)}
    ${true}                  | ${false}                   | ${getObjectSettings(undefined, undefined)} | ${getObjectSettings(true, false)}
    ${true}                  | ${true}                    | ${getObjectSettings(false, false)}         | ${getObjectSettings(false, false)}
    ${false}                 | ${false}                   | ${getObjectSettings(true, true)}           | ${getObjectSettings(true, true)}
  `(
    `should update object settings with user settings when operation type is REFRESH_OPERATION`,
    async ({
      mergeCrosstabColumnsUser,
      importAttributesAsTextUser,
      objectSettings,
      expectedSettings,
    }) => {
      // Given
      const objectData = {
        objectWorkingId: 1,
        objectSettings,
        mstrObjectType: { name: 'report' },
      } as ObjectData;
      const updateObjectMock = jest
        .spyOn(operationStepDispatcher, 'updateObject')
        .mockImplementation();
      const completeStepMock = jest
        .spyOn(operationStepDispatcher, 'completeGetObjectSettings')
        .mockImplementation();
      jest.spyOn(reduxStore, 'getState').mockReturnValue({
        // @ts-ignore
        settingsReducer: {
          mergeCrosstabColumns: mergeCrosstabColumnsUser,
          importAttributesAsText: importAttributesAsTextUser,
          worksheetObjectInfoSettings: [],
        },
      });

      // When
      await stepGetObjectSettings.getObjectSettings(objectData, {
        operationType: OperationTypes.REFRESH_OPERATION,
      } as unknown as OperationData);

      // Then
      expect(updateObjectMock).toHaveBeenCalledWith({
        ...objectData,
        objectSettings: expectedSettings,
      });

      expect(completeStepMock).toHaveBeenCalledWith(objectData.objectWorkingId);
    }
  );
});
