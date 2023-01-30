/* eslint-disable object-curly-newline, indent */
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepGetDuplicateName from '../../office/step-get-duplicate-name';
import { reduxStore } from '../../store';

describe('StepGetDuplicateName', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    originalName            | expectedResult
    ${''}                   | ${' (2)'}
    ${'name'}               | ${'name (2)'}
    ${'name 7'}             | ${'name 7 (2)'}
    ${'name 7 (2)'}         | ${'name 7 (3)'}
    ${'some name'}          | ${'some name (2)'}
    ${'name (2)'}           | ${'name (3)'}
    ${'name 1'}             | ${'name 1 (2)'}
    ${'name 2'}             | ${'name 2 (2)'}
    ${'name (2) 3'}         | ${'name (2) 3 (2)'} 
    ${1234}                 | ${'1234 (2)'}
    ${'name (2) test'}      | ${'name (2) test (2)'}
    
  `('prepareNewNameForDuplicatedObject should return proper prepared name', ({ originalName, expectedResult }) => {
    // given
    // when
    const nameCandidate = stepGetDuplicateName.prepareNewNameForDuplicatedObject(originalName);
    // then
    expect(nameCandidate).toEqual(expectedResult);
  });

  it.each`
    nameCandidate               | expectedResult
    ${'name (2)'}               | ${'name (2)'}
    ${'some random name'}       | ${'some random name'}
    ${'some name'}              | ${'some name (5)'}
    ${'some name (3)'}          | ${'some name (5)'}
    ${'name 7 (2)'}             | ${'name 7 (3)'}
    
  `('checkAndSolveNameConflicts should return adjusted name', ({ nameCandidate, expectedResult }) => {
    // given
    jest.spyOn(reduxStore, 'getState').mockImplementation(() => ({
      objectReducer: {
        objects: [
          { name: 'some name' },
          { name: 'some name (2)' },
          { name: 'some name (3)' },
          { name: 'some name (4)' },
          { name: 'name 7' },
          { name: 'name 7 (2)' },
        ]
      },
    }));
    // when
    const adjustedName = stepGetDuplicateName.checkAndSolveNameConflicts(nameCandidate);
    // then
    expect(adjustedName).toEqual(expectedResult);
  });

  it('getDuplicateName should call updateObject with object with new name', () => {
    // given
    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest',
    };
    const operationData = {};

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    const completeGetDuplicateNameMock = jest.spyOn(
      operationStepDispatcher, 'completeGetDuplicateName'
    ).mockImplementation();

    // when
    stepGetDuplicateName.getDuplicateName(objectData, operationData);
    // then
    expect(completeGetDuplicateNameMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest (2)',
    });
  });

  it('getDuplicateName should skip updateObject when provided nameAndFormatShouldUpdate === true', () => {
    // given
    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest',
    };
    const operationData = {
      objectEditedData: {
        visualizationInfo: {
          nameAndFormatShouldUpdate: true
        }
      }
    };

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    const completeGetDuplicateNameMock = jest.spyOn(
      operationStepDispatcher, 'completeGetDuplicateName'
    ).mockImplementation();
    // when
    stepGetDuplicateName.getDuplicateName(objectData, operationData);
    // then
    expect(completeGetDuplicateNameMock).toBeCalledTimes(1);
    expect(updateObjectMock).not.toBeCalled();
  });
});
