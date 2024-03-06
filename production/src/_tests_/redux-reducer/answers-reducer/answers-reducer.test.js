import { createStore } from "redux";

import {
  EDIT_OPERATION,
  IMPORT_OPERATION,
} from "../../../operation/operation-type-names";
import {
  CLEAR_ANSWERS,
  RESTORE_ALL_ANSWERS,
} from "../../../redux-reducer/answers-reducer/answers-actions";
import { answersReducer } from "../../../redux-reducer/answers-reducer/answers-reducer";

describe("answersReducer", () => {
  const answersStore = createStore(answersReducer);

  beforeEach(() => {
    // default state should be empty
    expect(answersStore.getState()).toEqual({
      answers: [],
    });
  });

  it("Import operation for Report should update the state with newly-provided answers", () => {
    // given
    const prevState = { answers: [] };
    const action = {
      type: IMPORT_OPERATION,
      payload: {
        object: {
          isPrompted: true,
          promptsAnswers: [
            {
              messageName: "someMessageName",
              answers: [{ key: "1", values: ["1"] }],
            },
          ],
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: "1", values: ["1"] }]);
  });

  it("Import operation for Dossier should update the state with newly-provided answers", () => {
    // given
    const prevState = { answers: [] };
    const action = {
      type: IMPORT_OPERATION,
      payload: {
        object: {
          mstrObjectType: {
            name: "visualization",
          },
          promptsAnswers: {
            messageName: "someMessageName",
            answers: [{ key: "1", values: ["1"] }],
          },
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: "1", values: ["1"] }]);
  });

  it("Restore All Answers operation should populate the state with newly-provided answers", () => {
    // given
    const prevState = { answers: [] };
    const action = {
      type: RESTORE_ALL_ANSWERS,
      payload: [{ key: "1", values: ["1"] }],
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: "1", values: ["1"] }]);
  });

  it("Edit operation for Report should update the state with newly-provided answers", () => {
    // given
    const prevState = { answers: [{ key: "1", values: ["1"] }] };
    const action = {
      type: EDIT_OPERATION,
      payload: {
        operation: {
          objectEditedData: {
            isPrompted: true,
            promptsAnswers: [
              {
                messageName: "someMessageName",
                answers: [{ key: "1", values: ["2"] }],
              },
            ],
          },
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: "1", values: ["2"] }]);
  });

  it("Edit operation for Dossier should update the state with newly-provided answers", () => {
    // given
    const prevState = { answers: [{ key: "1", values: ["1"] }] };
    const action = {
      type: EDIT_OPERATION,
      payload: {
        operation: {
          objectEditedData: {
            visualizationInfo: {
              name: "visualization",
            },
            promptsAnswers: {
              messageName: "someMessageName",
              answers: [{ key: "1", values: ["2"] }],
            },
          },
        },
      },
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([{ key: "1", values: ["2"] }]);
  });

  it("Clear Answers operation should reset state to initial values", () => {
    // given
    const prevState = { answers: [{ key: "1", values: ["1"] }] };
    const action = {
      type: CLEAR_ANSWERS,
    };
    // when
    const newState = answersReducer(prevState, action);
    // then
    expect(newState.answers).toEqual([]);
  });
});
