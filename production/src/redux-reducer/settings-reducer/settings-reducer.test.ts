import { settingsActions } from './settings-actions';
import { settingsReducer } from './settings-reducer';
import {
  initialSidePanelObjectInfoSettings,
  initialWorksheetObjectInfoSettings,
} from './settings-constants';

describe('settingsReducer', () => {
  const initialState = {
    mergeCrosstabColumns: true,
    importAttributesAsText: false,
    sidePanelObjectInfoSettings: initialSidePanelObjectInfoSettings,
    worksheetObjectInfoSettings: initialWorksheetObjectInfoSettings,
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

  it('should return proper state in case of TOGGLE_SIDE_PANEL_OBJECT_INFO_SETTING action', () => {
    // given
    const action = settingsActions.toggleSidePanelObjectInfoSetting({
      key: 'importedBy',
      value: false,
    });
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.sidePanelObjectInfoSettings[0].toggleChecked).toBe(false);
  });

  it('should return proper state in case of TOGGLE_MAIN_SIDE_PANEL_OBJECT_INFO_SETTING action', () => {
    // given
    const action = settingsActions.toggleMainSidePanelObjectInfoSetting(true);
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.sidePanelObjectInfoSettings.every(setting => setting.toggleChecked)).toBe(true);
  });

  it('should return proper state in case of TOGGLE_WORKSHEET_OBJECT_INFO_SETTING action', () => {
    // given
    const action = settingsActions.toggleWorksheetObjectInfoSetting({ key: 'name', value: true });
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.worksheetObjectInfoSettings[0].toggleChecked).toBe(true);
  });

  it('should return proper state in case of TOGGLE_MAIN_WORKSHEET_OBJECT_INFO_SETTING action', () => {
    // given
    const action = settingsActions.toggleMainWorksheetObjectInfoSetting(true);
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.worksheetObjectInfoSettings.every(setting => setting.toggleChecked)).toBe(true);
  });

  it('should return proper state in case of ORDER_WORKSHEET_OBJECT_INFO_SETTINGS action', () => {
    // given
    const action = settingsActions.orderWorksheetObjectInfoSettings([
      'description',
      'name',
      'owner',
    ]);
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.worksheetObjectInfoSettings.map(setting => setting.key)).toEqual([
      'description',
      'name',
      'owner',
    ]);
  });
});
