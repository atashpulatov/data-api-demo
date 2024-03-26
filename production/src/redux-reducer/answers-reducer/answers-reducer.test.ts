import { createStore } from 'redux';

import {
  AnswerActionTypes,
  AnswersState,
  ClearAnswersAction,
  EditOperationAction,
  ImportOperationAction,
  PromptsAnswer,
  RestoreAllAnswersAction,
} from './answers-reducer-types';

import { answersReducer } from './answers-reducer';

describe('answersReducer', () => {
  const answersStore = createStore(answersReducer);

  beforeEach(() => {
    // default state should be empty
    expect(answersStore.getState()).toEqual({
      answers: [],
    });
  });

  it('Import operation for Report should update the state with newly-provided answers', () => {
    // given
    const prevState = { answers: [] as PromptsAnswer[] };
    const action: ImportOperationAction = {
      type: AnswerActionTypes.IMPORT_OPERATION,
      payload: {
        object: {
          isPrompted: true,
          promptsAnswers: [
            {
              messageName: 'someMessageName',
              answers: [{ key: '1', values: ['1'] }],
            },
          ],
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: '1', values: ['1'] }]);
  });

  it('Import operation for Dossier should update the state with newly-provided answers', () => {
    // given
    const prevState = { answers: [] as PromptsAnswer[] };
    const action: ImportOperationAction = {
      type: AnswerActionTypes.IMPORT_OPERATION,
      payload: {
        object: {
          mstrObjectType: {
            name: 'visualization',
          },
          promptsAnswers: {
            messageName: 'someMessageName',
            answers: [{ key: '1', values: ['1'] }],
          },
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: '1', values: ['1'] }]);
  });

  it('Restore All Answers operation should populate the state with newly-provided answers', () => {
    // given
    const prevState = { answers: [] as PromptsAnswer[] };
    const action: RestoreAllAnswersAction = {
      type: AnswerActionTypes.RESTORE_ALL_ANSWERS,
      payload: [{ key: '1', values: ['1'] }] as PromptsAnswer[],
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: '1', values: ['1'] }]);
  });

  it('Edit operation for Report should update the state with newly-provided answers', () => {
    // given
    const prevState = { answers: [{ key: '1', values: ['1'] }] } as AnswersState;
    const action: EditOperationAction = {
      type: AnswerActionTypes.EDIT_OPERATION,
      payload: {
        operation: {
          objectEditedData: {
            isPrompted: true,
            promptsAnswers: [
              {
                messageName: 'someMessageName',
                answers: [{ key: '1', values: ['2'] }],
              },
            ],
          },
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: '1', values: ['2'] }]);
  });

  it('Edit operation for Dossier should update the state with newly-provided answers', () => {
    // given
    const prevState = { answers: [{ key: '1', values: ['1'] }] } as AnswersState;
    const action: EditOperationAction = {
      type: AnswerActionTypes.EDIT_OPERATION,
      payload: {
        operation: {
          objectEditedData: {
            visualizationInfo: {
              name: 'visualization',
            },
            promptsAnswers: {
              messageName: 'someMessageName',
              answers: [{ key: '1', values: ['2'] }],
            },
          },
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: '1', values: ['2'] }]);
  });

  it('Clear Answers operation should reset state to initial values', () => {
    // given
    const prevState = { answers: [{ key: '1', values: ['1'] }] } as AnswersState;
    const action: ClearAnswersAction = {
      type: AnswerActionTypes.CLEAR_ANSWERS,
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([]);
  });
});
