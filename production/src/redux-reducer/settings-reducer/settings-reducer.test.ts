import { settingsActions } from './settings-actions';
import { settingsReducer } from './settings-reducer';

describe('settingsReducer', () => {
  const initialState = {
    mergeCrosstabColumns: true,
    importAttributesAsText: false,
  };

  it('should return correct initial state', () => {
    // when
    const newState = settingsReducer(undefined, {} as any);
    // then
    expect(newState).toEqual(initialState);
  });

  it('should return proper state in case of TOGGLE_MERGE_CROSSTAB_COLUMNS_FLAG action', () => {
    // given
    const action = settingsActions.toggleMergeCrosstabColumnsFlag(false);
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState).toEqual({ ...initialState, mergeCrosstabColumns: false });
  });

  it('should return proper state in case of TOGGLE_IMPORT_ATTRIBUTES_AS_TEXT_FLAG action', () => {
    // given
    const action = settingsActions.toggleImportAttributesAsTextFlag(true);
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState).toEqual({ ...initialState, importAttributesAsText: true });
  });
});
