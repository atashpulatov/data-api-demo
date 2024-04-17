import { authenticationHelper } from '../authentication/authentication-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import {
  generateReportFilterText,
  getObjectPrompts,
  populateDefinition,
  populateDetails,
} from './get-object-details-methods';

describe('Get Object Details Methods', () => {
  describe('getObjectPrompts', () => {
    it('should return falsy if there are no promptAnswers', async () => {
      // given
      const mockedObjectDataWithoutPrompts = {
        promptsAnswers: false,
        mstrObjectType: { name: 'report' },
      } as unknown as ObjectData;
      // when
      // @ts-expect-error
      const objectPrompts = await getObjectPrompts(mockedObjectDataWithoutPrompts);
      // then
      expect(objectPrompts).toBeFalsy();
    });
    it('should call mstrObjectRestService to get object prompts with provided arguments', async () => {
      // given
      const mockedObjectData = {
        promptsAnswers: true,
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
          promptsAnswers: true,
          mstrObjectType: { name: 'report' },
          manipulationsXML: { promptAnswers: {} },
        } as unknown as ObjectData;
      });

      it('should map object answers', async () => {
        // given
        const mockedPromptAnswers = [
          {
            type: 'OBJECTS',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [['some name1', 'some name2']];
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
            answers: {
              units: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
            },
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [['some name1', 'some name2']];
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
            answers: {
              content: 'some content',
            },
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = ['some content'];
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
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [['some name1', 'some name2']];
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
            answers: 'some answer',
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = ['some answer'];
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
            type: 'OBJECTS',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
          {
            type: 'LEVEL',
            answers: {
              units: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
            },
          },
          {
            type: 'ELEMENTS',
            answers: [{ name: 'some name1' }, { name: 'some name2', otherProp: 'some other prop' }],
          },
          {
            type: 'EXPRESSION',
            answers: {
              content: 'some content',
            },
          },
          {
            type: 'VALUE',
            answers: 'some answer',
          },
        ];
        jest
          .spyOn(mstrObjectRestService, 'getObjectPrompts')
          .mockResolvedValue(mockedPromptAnswers);
        const expectedResult = [
          ['some name1', 'some name2'],
          ['some name1', 'some name2'],
          ['some name1', 'some name2'],
          'some content',
          'some answer',
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
      const mockedPrompts = { someProperty: 'some data' };
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
      populateDetails({}, true, '', '');
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
      const mockedOwner = 'Some owner';
      const expectedDetails = {
        ancestors: mockedAncestors,
        certified: mockedCertifiedInfo,
        modifiedDate: mockedDateModified,
        owner: mockedOwner,
        importedBy: mockedUserName,
      };
      // when
      const details = populateDetails(
        mockedAncestors,
        mockedCertifiedInfo,
        mockedDateModified,
        mockedOwner
      );
      // then
      expect(details).toEqual(expectedDetails);
    });
  });
});
describe('reduceFilterDataAndGenerateTextForReportFilters', () => {
  it('should generate the correct text for report filters', () => {
    // given
    const filterData = {
      dataSource: {
        filter: {
          tokens: [
            { type: 'character', value: '%' },
            { type: 'function', value: 'Not' },
            { type: 'character', value: '(' },
            { type: 'other', value: 'filter1' },
            { type: 'function', value: 'And' },
            { type: 'other', value: 'filter2' },
            { type: 'character', value: ')' },
          ],
        },
        dataTemplate: {
          units: [
            {
              type: 'metrics',
              limit: {
                tokens: [
                  { type: 'character', value: '%' },
                  { type: 'function', value: 'Not' },
                  { type: 'character', value: '(' },
                  { type: 'other', value: 'limit1' },
                  { type: 'function', value: 'Or' },
                  { type: 'other', value: 'limit2' },
                  { type: 'character', value: ')' },
                ],
              },
            },
            { type: 'other_type_to_be_ignored' },
          ],
        },
      },
      grid: {
        viewFilter: {
          tokens: [
            { type: 'character', value: '%' },
            { type: 'function', value: 'Not' },
            { type: 'character', value: '(' },
            { type: 'other', value: 'viewFilter1' },
            { type: 'function', value: 'Or' },
            { type: 'other', value: 'viewFilter2' },
            { type: 'character', value: ')' },
          ],
        },
        viewTemplate: {
          columns: {
            units: [
              {
                type: 'metrics',
                elements: [
                  {
                    limit: {
                      text: 'reference1 > 10',
                      tokens: [
                        [
                          {
                            'value': '%',
                            'type': 'character',
                          },
                          {
                            'value': 'Reference1',
                            'type': 'object_reference',
                          },
                          {
                            'value': '>',
                            'type': 'character',
                          },
                          {
                            'value': '10',
                            'type': 'integer',
                          },
                        ],
                      ],
                    },
                  },
                  {
                    limit: {
                      text: 'reference2 > 10',
                      tokens: [
                        [
                          {
                            'value': '%',
                            'type': 'character',
                          },
                          {
                            'value': 'Reference2',
                            'type': 'object_reference',
                          },
                          {
                            'value': '>',
                            'type': 'character',
                          },
                          {
                            'value': '10',
                            'type': 'integer',
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
              {
                type: 'other_type_to_be_ignored',
              },
            ],
          },
        },
      },
    };

    // when
    const result = generateReportFilterText(filterData);
    console.log(result);
    // then
    expect(result.reportFilterText).toBe('Not ( filter1 And filter2 )');
    expect(result.reportLimitsText).toBe('Not ( limit1 Or limit2 )');
    expect(result.viewFilterText).toBe('Not ( viewFilter1 Or viewFilter2 )');
    expect(result.metricLimitsText).toBe('( reference1 > 10 ) And ( reference2 > 10 )');
  });
});
