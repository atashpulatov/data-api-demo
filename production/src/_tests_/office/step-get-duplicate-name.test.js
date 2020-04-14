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
    ${''}                   | ${' Copy'}
    ${'name'}               | ${'name Copy'}
    ${'name 7'}             | ${'name 7 Copy'}
    ${'name 7 Copy'}        | ${'name 7 Copy 2'}
    ${'some name'}          | ${'some name Copy'}
    ${'name Copy'}          | ${'name Copy 2'}
    ${'name Copy 1'}        | ${'name Copy 2'}
    ${'name Copy 2'}        | ${'name Copy 3'}
    ${'name Copy 3 Copy'}   | ${'name Copy 3 Copy 2'} 
    ${1234}                 | ${'1234 Copy'}
    ${'name Copy test'}     | ${'name Copy test Copy'}
    
  `('prepareNewNameForDuplicatedObject should return proper prepared name', ({ originalName, expectedResult }) => {
    // given
    const translatedCopy = 'Copy';
    // when
    const nameCandidate = stepGetDuplicateName.prepareNewNameForDuplicatedObject(originalName, translatedCopy);
    // then
    expect(nameCandidate).toEqual(expectedResult);
  });


  it.each`
    nameCandidate               | expectedResult
    ${'name Copy'}              | ${'name Copy'}
    ${'some random name Copy'}  | ${'some random name Copy'}
    ${'some name Copy'}         | ${'some name Copy 5'}
    ${'some name Copy 3'}       | ${'some name Copy 5'}
    ${'name 7 Copy'}            | ${'name 7 Copy 3'}
    
  `('checkAndSolveNameConflicts should return adjusted name', ({ nameCandidate, expectedResult }) => {
    // given
    const translatedCopy = 'Copy';
    jest.spyOn(reduxStore, 'getState').mockImplementation(() => ({
      objectReducer: {
        objects: [
          { name: 'some name Copy' },
          { name: 'some name Copy 2' },
          { name: 'some name Copy 3' },
          { name: 'some name Copy 4' },
          { name: 'name 7 Copy' },
          { name: 'name 7 Copy 2' },
        ]
      },
    }));
    // when
    const adjustedName = stepGetDuplicateName.checkAndSolveNameConflicts(nameCandidate, translatedCopy);
    // then
    expect(adjustedName).toEqual(expectedResult);
  });

  it('getDuplicateName should call updateObject with object with new name', () => {
    // given
    const exampleObject = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest',
      vizKeyChanged: false,
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
      name: 'nameTest Copy',
    });
  });

  it('getDuplicateName should skip updateObject when provided objectData.vizKeyChanged === true', () => {
    // given
    const exampleObject = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'nameTest',
      vizKeyChanged: true,
    };
    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    const completeGetDuplicateNameMock = jest.spyOn(
      operationStepDispatcher, 'completeGetDuplicateName'
    ).mockImplementation();
    // when
    stepGetDuplicateName.getDuplicateName(exampleObject);
    // then
    expect(completeGetDuplicateNameMock).toBeCalledTimes(1);
    expect(updateObjectMock).not.toBeCalled();
  });
});
