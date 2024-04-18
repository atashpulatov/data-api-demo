import {
  ObjectAndWorksheetNamingOption,
  PageByDisplayOption,
} from '../../right-side-panel/settings-side-panel/settings-side-panel-types';

import { settingsActions } from './settings-actions';
import { settingsReducer } from './settings-reducer';
import { ObjectImportType } from '../../mstr-object/constants';
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
    importType: ObjectImportType.TABLE,
    objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption.REPORT_NAME,
    pageByDisplaySetting: PageByDisplayOption.SELECT_PAGES,
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

  it('should return proper state in case of SET_OBJECT_AND_WORKSHEET_NAMING_SETTING action', () => {
    // given
    const action = settingsActions.setWorksheetNamingSetting(
      ObjectAndWorksheetNamingOption.REPORT_NAME_AND_PAGE_NAME
    );
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.objectAndWorksheetNamingSetting).toBe(
      ObjectAndWorksheetNamingOption.REPORT_NAME_AND_PAGE_NAME
    );
  });

  it('should return proper state in case of SET_PAGE_BY_DISPLAY_SETTING action', () => {
    // given
    const action = settingsActions.setPageByDisplaySetting(PageByDisplayOption.ALL_PAGES);
    // when
    const newState = settingsReducer(initialState, action);
    // then
    expect(newState.pageByDisplaySetting).toBe(PageByDisplayOption.ALL_PAGES);
  });
});
