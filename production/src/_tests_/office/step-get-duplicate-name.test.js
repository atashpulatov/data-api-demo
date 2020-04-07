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
    ${''}                   | ${' copy'}
    ${'name'}               | ${'name copy'}
    ${'name 7'}             | ${'name 7 copy'}
    ${'name 7 copy'}        | ${'name 7 copy 2'}
    ${'some name'}          | ${'some name copy'}
    ${'name copy'}          | ${'name copy 2'}
    ${'name copy 1'}        | ${'name copy 2'}
    ${'name copy 2'}        | ${'name copy 3'}
    ${'name copy 3 copy'}   | ${'name copy 3 copy 2'} 
    ${1234}                 | ${'1234 copy'}
    
  `('prepareNewNameForDuplicatedObject should return proper prepared name', ({ originalName, expectedResult }) => {
    // given
    // when
    const nameCandidate = stepGetDuplicateName.prepareNewNameForDuplicatedObject(originalName);
    // then
    expect(nameCandidate).toEqual(expectedResult);
  });


  it.each`
    nameCandidate               | expectedResult
    ${'name copy'}              | ${'name copy'}
    ${'some random name copy'}  | ${'some random name copy'}
    ${'some name copy'}         | ${'some name copy 5'}
    ${'some name copy 3'}       | ${'some name copy 5'}
    ${'name 7 copy'}            | ${'name 7 copy 3'}
    
  `('checkAndSolveNameConflicts should return adjusted name', ({ nameCandidate, expectedResult }) => {
    // given
    jest.spyOn(reduxStore, 'getState').mockImplementation(() => ({
      objectReducer: {
        objects: [
          { name: 'some name copy' },
          { name: 'some name copy 2' },
          { name: 'some name copy 3' },
          { name: 'some name copy 4' },
          { name: 'name 7 copy' },
          { name: 'name 7 copy 2' },
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
    const exampleObject = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest',
    };

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    const completeGetDuplicateNameMock = jest.spyOn(
      operationStepDispatcher, 'completeGetDuplicateName'
    ).mockImplementation();

    // when
    stepGetDuplicateName.getDuplicateName(exampleObject);
    // then
    expect(completeGetDuplicateNameMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest copy',
    });
  });
});
