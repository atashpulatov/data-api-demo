import { authenticationHelper } from '../authentication/authentication-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectInfoSetting } from '../redux-reducer/settings-reducer/settings-reducer-types';
import { ObjectData } from '../types/object-types';
import { MstrObjectTypes } from './mstr-object-types';

import {
  calculateOffsetForObjectInfoSettings,
  getObjectPrompts,
  getTableOperationAndStartCell,
  populateDefinition,
  populateDetails,
} from './get-object-details-methods';
import { TableOperation } from '../error/constants';
import { ObjectImportType } from './constants';

describe('Get Object Details Methods', () => {
  describe('getObjectPrompts', () => {
    it('should return falsy if there are no promptAnswers', async () => {
      // given
      const mockedObjectDataWithoutPrompts = {
        promptsAnswers: [],
        mstrObjectType: { name: 'report' },
      } as unknown as ObjectData;
      // when
      // @ts-expect-error
      const objectPrompts = await getObjectPrompts(mockedObjectDataWithoutPrompts);
      // then
      expect(objectPrompts).toHaveLength(0);
    });
    it('should call mstrObjectRestService to get object prompts with provided arguments', async () => {
      // given
      const mockedObjectData = {
        promptsAnswers: [{ someProp: 'some value' }],
        mstrObjectType: { name: 'report' },
        manipulationsXML: { promptAnswers: {} },
      } as unknown as ObjectData;
      const mockedObjectId = '1';
      const mockedProjectId = '12';
      const mockedOperationData = {
        instanceDefinition: { instanceId: 2 },
      } as unknown as OperationData;
      jest.spyOn(mstrObjectRestService, 'getObjectPrompts').mockImplementation(() => []);
      // when
      await getObjectPrompts(
        mockedObjectData,
        mockedObjectId,
        mockedProjectId,
        mockedOperationData
      );
      // then
      expect(mstrObjectRestService.getObjectPrompts).toBeCalled();
      expect(mstrObjectRestService.getObjectPrompts).toBeCalledWith(
        mockedObjectId,
        mockedProjectId,
        mockedOperationData.instanceDefinition.instanceId
      );
    });
    describe('promptAnswerFunctionsMap', () => {
      let mockedObjectData: ObjectData;

      beforeEach(() => {
        mockedObjectData = {
          promptsAnswers: [{ someProp: 'some value' }],
          mstrObjectType: { name: 'report' },
          manipulationsXML: { promptAnswers: {} },
        } as unknown as ObjectData;
      });

      it('should map object answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            type: 'OBJECTS',
            id: '1',
            name: 'promptName',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [
          { answers: ['some name1', 'some name2'], id: '1', name: 'promptName' },
        ];
        // when
        const result = await getObjectPrompts(mockedObjectData, '', '', {
          instanceDefinition: { instanceId: 2 },
        } as unknown as OperationData);
        // then
        expect(result).toEqual(expectedResult);
      });

      it('should map level answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            type: 'LEVEL',
            id: '1',
            name: 'promptName',
            answers: {
              units: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
            },
          },
        ];

        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [
          { answers: ['some name1', 'some name2'], id: '1', name: 'promptName' },
        ];
        // when
        const result = await getObjectPrompts(mockedObjectData, '', '', {
          instanceDefinition: { instanceId: 2 },
        } as unknown as OperationData);
        // then
        expect(result).toEqual(expectedResult);
      });

      it('should map expression answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            type: 'EXPRESSION',
            id: '1',
            name: 'promptName',
            answers: {
              content: 'some content',
            },
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [{ answers: 'some content', id: '1', name: 'promptName' }];
        // when
        const result = await getObjectPrompts(mockedObjectData, '', '', {
          instanceDefinition: { instanceId: 2 },
        } as unknown as OperationData);
        // then
        expect(result).toEqual(expectedResult);
      });

      it('should map elements answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            type: 'ELEMENTS',
            id: '1',
            name: 'promptName',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [
          { answers: ['some name1', 'some name2'], id: '1', name: 'promptName' },
        ];
        // when
        const result = await getObjectPrompts(mockedObjectData, '', '', {
          instanceDefinition: { instanceId: 2 },
        } as unknown as OperationData);
        // then
        expect(result).toEqual(expectedResult);
      });

      it('should map value answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            type: 'VALUE',
            id: '1',
            name: 'promptName',
            answers: 'some answer',
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [
          {
            answers: 'some answer',
            id: '1',
            name: 'promptName',
          },
        ];
        // when
        const result = await getObjectPrompts(mockedObjectData, '', '', {
          instanceDefinition: { instanceId: 2 },
        } as unknown as OperationData);
        // then
        expect(result).toEqual(expectedResult);
      });

      it('should map mixed answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            id: '1',
            name: 'promptName1',
            type: 'OBJECTS',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
          {
            id: '2',
            name: 'promptName2',
            type: 'LEVEL',
            answers: {
              units: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
            },
          },
          {
            id: '3',
            name: 'promptName3',
            type: 'ELEMENTS',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
          {
            id: '4',
            name: 'promptName4',
            type: 'EXPRESSION',
            answers: {
              content: 'some content',
            },
          },
          {
            id: '5',
            name: 'promptName5',
            type: 'VALUE',
            answers: 'some answer',
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [
          {
            id: '1',
            name: 'promptName1',
            answers: ['some name1', 'some name2'],
          },
          {
            id: '2',
            name: 'promptName2',
            answers: ['some name1', 'some name2'],
          },
          {
            id: '3',
            name: 'promptName3',
            answers: ['some name1', 'some name2'],
          },
          {
            id: '4',
            name: 'promptName4',
            answers: 'some content',
          },
          {
            id: '5',
            name: 'promptName5',
            answers: 'some answer',
          },
        ];
        // when
        const result = await getObjectPrompts(mockedObjectData, '', '', {
          instanceDefinition: { instanceId: 2 },
        } as unknown as OperationData);
        // then
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('populateDefinition', () => {
    it('should return only definition if prompts not provided', () => {
      // given
      const mockedObjectData = {
        definition: { someProperty: 'some definition' },
      } as unknown as ObjectData;
      // when
      const definition = populateDefinition(mockedObjectData);
      // then
      expect(definition).toEqual(mockedObjectData.definition);
    });

    it('should combine definition with prompt data', () => {
      // given
      const mockedObjectData = {
        definition: { someProperty: 'some definition' },
      } as unknown as ObjectData;
      const mockedPrompts = [{ someProperty: 'some data' }];
      const expectedResult = {
        ...mockedObjectData.definition,
        prompts: mockedPrompts,
      };
      // when
      const definition = populateDefinition(mockedObjectData, mockedPrompts);
      // then
      expect(definition).toEqual(expectedResult);
    });
  });

  describe('populateDetails', () => {
    it('should call authenticationHelper to get username', () => {
      // given
      const mockedUserName = 'Some User';
      jest
        .spyOn(authenticationHelper, 'getCurrentMstrUserFullName')
        .mockImplementation(() => mockedUserName);
      // when
      populateDetails({}, true, '', '', '', {}, null, '');
      // then
      expect(authenticationHelper.getCurrentMstrUserFullName).toBeCalled();
    });

    it('populate details with provided properties', () => {
      // given
      const mockedUserName = 'Some User';
      jest
        .spyOn(authenticationHelper, 'getCurrentMstrUserFullName')
        .mockImplementation(() => mockedUserName);
      const mockedAncestors = 'Some ancestors';
      const mockedCertifiedInfo = true;
      const mockedDateModified = 'Some date';
      const mockedDateCreated = 'Some date';
      const mockedDescription = 'Some description';
      const mockedOwner = { name: 'Some owner', id: 'Some id', expired: false };
      const mockedVersion = 'Some version';
      const mockedFilters = {};
      const expectedDetails = {
        ancestors: mockedAncestors,
        certified: mockedCertifiedInfo,
        createdDate: mockedDateCreated,
        description: mockedDescription,
        filters: mockedFilters,
        importedBy: mockedUserName,
        modifiedDate: mockedDateModified,
        owner: mockedOwner,
        version: mockedVersion,
      };
      // when
      const details = populateDetails(
        mockedAncestors,
        mockedCertifiedInfo,
        mockedDateCreated,
        mockedDateModified,
        mockedDescription,
        mockedFilters,
        mockedOwner,
        mockedVersion
      );
      // then
      expect(details).toEqual(expectedDetails);
    });
  });

  describe('calculateOffsetForObjectInfoSettings', () => {
    it('should calculate the offset correctly based on the objectInfoSettings', () => {
      // given
      const objectType = { name: 'report' } as MstrObjectTypes;

      const objectInfoSettings = [
        { key: 'name', toggleChecked: true },
        { key: 'filters', toggleChecked: true },
        { key: 'property1', toggleChecked: true },
        { key: 'property2', toggleChecked: false },
      ] as ObjectInfoSetting[];
      const expectedOffset = 14;

      // when
      const offset = calculateOffsetForObjectInfoSettings(
        objectInfoSettings,
        objectType,
        ObjectImportType.TABLE,
        false
      );

      // then
      expect(offset).toEqual(expectedOffset);
    });

    it('should return 0 if no toggleChecked items are present in objectInfoSettings', () => {
      // given
      const objectType = { name: 'report' } as MstrObjectTypes;

      const objectInfoSettings = [
        { key: 'property1', toggleChecked: false },
        { key: 'property2', toggleChecked: false },
      ] as ObjectInfoSetting[];
      const expectedOffset = 0;

      // when
      const offset = calculateOffsetForObjectInfoSettings(
        objectInfoSettings,
        objectType,
        ObjectImportType.TABLE,
        false
      );

      // then
      expect(offset).toEqual(expectedOffset);
    });

    it('should return 0 if objectInfoSettings is empty', () => {
      // given
      const objectType = { name: 'report' } as MstrObjectTypes;

      const objectInfoSettings: ObjectInfoSetting[] = [];
      const expectedOffset = 0;

      // when
      const offset = calculateOffsetForObjectInfoSettings(
        objectInfoSettings,
        objectType,
        ObjectImportType.TABLE,
        false
      );

      // then
      expect(offset).toEqual(expectedOffset);
    });

    it.each`
      importType
      ${ObjectImportType.FORMATTED_DATA}
      ${ObjectImportType.IMAGE}
      ${ObjectImportType.PIVOT_TABLE}
    `('Should return 0 if importType is different than TABLE', async ({ importType }) => {
      // given
      const objectType = { name: 'report' } as MstrObjectTypes;

      const objectInfoSettings = [
        { key: 'property1', toggleChecked: false },
        { key: 'property2', toggleChecked: false },
      ] as ObjectInfoSetting[];
      const expectedOffset = 0;

      // when
      const offset = calculateOffsetForObjectInfoSettings(
        objectInfoSettings,
        objectType,
        importType,
        false
      );

      // then
      expect(offset).toEqual(expectedOffset);
    });
  });
});

describe('getTableOperationAndStartCell', () => {
  it.each`
    tableChanged | tableMoved | previousObjectDetailsSize | newObjectDetailsSize | expectedStartCell | expectedOperation
    ${false}     | ${false}   | ${5}                      | ${5}                 | ${'A5'}           | ${TableOperation.UPDATE_EXISTING_TABLE}
    ${false}     | ${false}   | ${5}                      | ${7}                 | ${'A5'}           | ${TableOperation.CREATE_NEW_TABLE}
    ${false}     | ${true}    | ${5}                      | ${5}                 | ${'A5'}           | ${TableOperation.UPDATE_EXISTING_TABLE}
    ${false}     | ${true}    | ${5}                      | ${7}                 | ${'A3'}           | ${TableOperation.UPDATE_EXISTING_TABLE}
    ${true}      | ${false}   | ${5}                      | ${5}                 | ${'A5'}           | ${TableOperation.CREATE_NEW_TABLE}
    ${true}      | ${false}   | ${5}                      | ${7}                 | ${'A5'}           | ${TableOperation.CREATE_NEW_TABLE}
    ${true}      | ${true}    | ${5}                      | ${5}                 | ${'A5'}           | ${TableOperation.CREATE_NEW_TABLE}
    ${true}      | ${true}    | ${5}                      | ${7}                 | ${'A3'}           | ${TableOperation.CREATE_NEW_TABLE}
  `(
    'should handle page by operation error',
    async ({
      tableChanged,
      tableMoved,
      previousObjectDetailsSize,
      newObjectDetailsSize,
      expectedOperation,
      expectedStartCell,
    }) => {
      // given
      const options = {
        tableMoved,
        tableChanged,
        previousObjectDetailsSize,
        newObjectDetailsSize,
        tableStartCell: 'A10',
        isNewStartCellSelected: false,
      };
      const expected = {
        tableOperation: expectedOperation,
        startCell: expectedStartCell,
      };

      // when
      const result = getTableOperationAndStartCell(options);

      // then
      expect(result).toEqual(expected);
    }
  );
});
