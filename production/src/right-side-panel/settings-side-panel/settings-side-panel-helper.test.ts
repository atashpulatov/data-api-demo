import { userRestService } from '../../home/user-rest-service';
import { settingsSidePanelHelper } from './settings-side-panel-helper';

import { reduxStore } from '../../store';

import { PageByDisplayType } from '../../page-by/page-by-types';
import { SettingsActionTypes } from '../../redux-reducer/settings-reducer/settings-reducer-types';
import { ObjectAndWorksheetNamingOption, UserPreferenceKey } from './settings-side-panel-types';

import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { settingsActions } from '../../redux-reducer/settings-reducer/settings-actions';
import {
  initialSidePanelObjectInfoSettings,
  initialWorksheetObjectInfoSettings,
} from '../../redux-reducer/settings-reducer/settings-constants';

describe('SettingsSidePanelHelper', () => {
  beforeEach(() => {
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockImplementation(
      () =>
        ({
          settingsReducer: {
            sidePanelObjectInfoSettings: initialSidePanelObjectInfoSettings,
            worksheetObjectInfoSettings: initialWorksheetObjectInfoSettings,
          },
          officeReducer: {
            settingsPanelLoaded: false,
          },
        }) as any
    );
    jest.spyOn(userRestService, 'getUserPreference').mockImplementationOnce(() => ({ value: '' }));
    jest.spyOn(userRestService, 'setUserPreference').mockImplementationOnce(() => ({ value: '' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch toggleSettingsPanelLoadedFlag to update the settings panel loaded flag', () => {
    // given
    jest.spyOn(officeActions, 'toggleSettingsPanelLoadedFlag').mockImplementation();
    // when
    settingsSidePanelHelper.toggleSettingsPanel(true);
    // then
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      officeActions.toggleSettingsPanelLoadedFlag(true)
    );
  });

  it('should dispatch toggleReusePromptAnswersFlag to initialize the reuse prompt answers flag', async () => {
    // given
    jest.spyOn(officeActions, 'toggleReusePromptAnswersFlag').mockImplementation();
    // when
    await settingsSidePanelHelper.initReusePromptAnswers();
    // then
    expect(userRestService.getUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      officeActions.toggleReusePromptAnswersFlag(true)
    );
  });

  it('should dispatch toggleReusePromptAnswersFlag to update the reuse prompt answers flag', async () => {
    // given
    jest.spyOn(officeActions, 'toggleReusePromptAnswersFlag').mockImplementation();
    // when
    await settingsSidePanelHelper.toggleReusePromptAnswers(false);
    // then
    expect(userRestService.setUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      officeActions.toggleReusePromptAnswersFlag(true)
    );
  });

  it('should dispatch loadSidePanelObjectInfoSettings and loadWorksheetObjectInfoSettings to initialize the side panel object info setting', async () => {
    // given
    jest.spyOn(settingsActions, 'loadSidePanelObjectInfoSettings').mockImplementation();
    jest.spyOn(settingsActions, 'loadWorksheetObjectInfoSettings').mockImplementation();
    // when
    await settingsSidePanelHelper.initObjectInfoSettings();
    // then
    expect(userRestService.getUserPreference).toHaveBeenCalledTimes(2);
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.loadSidePanelObjectInfoSettings([])
    );
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.loadWorksheetObjectInfoSettings([])
    );
  });

  it('should dispatch toggleSidePanelObjectInfoSetting to update the side panel object info setting', async () => {
    // given
    jest.spyOn(settingsActions, 'toggleSidePanelObjectInfoSetting').mockImplementation();
    // when
    await settingsSidePanelHelper.toggleSidePanelObjectInfoSetting(false, 'importedBy');
    // then
    expect(userRestService.setUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.toggleSidePanelObjectInfoSetting({
        key: 'importedBy',
        value: false,
      })
    );
  });

  it('should dispatch toggleWorksheetObjectInfoSetting to update the worksheet object info setting', async () => {
    // given
    jest.spyOn(settingsActions, 'toggleWorksheetObjectInfoSetting').mockImplementation();
    // when
    await settingsSidePanelHelper.toggleWorksheetObjectInfoSetting(false, 'importedBy');
    // then
    expect(userRestService.setUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.toggleWorksheetObjectInfoSetting({
        key: 'importedBy',
        value: false,
      })
    );
  });

  it('should dispatch toggleMainSidePanelObjectInfoSetting to update the main toggle side panel object info setting', async () => {
    // given
    jest.spyOn(settingsActions, 'toggleMainSidePanelObjectInfoSetting').mockImplementation();
    // when
    await settingsSidePanelHelper.toggleMainSidePanelObjectInfoSetting(true);
    // then
    expect(userRestService.setUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.toggleMainSidePanelObjectInfoSetting(true)
    );
  });

  it('should dispatch toggleMainWorksheetObjectInfoSetting to update the main toggle worksheet object info setting', async () => {
    // given
    jest.spyOn(settingsActions, 'toggleMainWorksheetObjectInfoSetting').mockImplementation();
    // when
    await settingsSidePanelHelper.toggleMainWorksheetObjectInfoSetting(true);
    // then
    expect(userRestService.setUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.toggleMainWorksheetObjectInfoSetting(true)
    );
  });

  it('should dispatch loadWorksheetObjectInfoSettings to order the worksheet object info settings', async () => {
    // given
    jest.spyOn(settingsActions, 'loadWorksheetObjectInfoSettings').mockImplementation();
    // when
    await settingsSidePanelHelper.orderWorksheetObjectInfoSettings([
      'description',
      'name',
      'owner',
    ]);
    // then
    expect(userRestService.setUserPreference).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalledWith(
      settingsActions.loadWorksheetObjectInfoSettings([])
    );
  });

  it('should initialize pageby answers', async () => {
    // given
    jest.resetAllMocks();
    const getUserPreferenceMock = jest
      .spyOn(userRestService, 'getUserPreference')
      .mockResolvedValue({ value: PageByDisplayType.ALL_PAGES });

    await settingsSidePanelHelper.initPageByDisplayAnswers();

    // then
    expect(getUserPreferenceMock).toHaveBeenCalledWith(UserPreferenceKey.EXCEL_PAGE_BY_SELECTION);
    expect(reduxStore.dispatch).toHaveBeenCalledWith({
      pageByDisplaySetting: PageByDisplayType.ALL_PAGES,
      type: SettingsActionTypes.SET_PAGE_BY_DISPLAY_SETTING,
    });
  });

  it('should initialize worksheet naming answers', async () => {
    // given
    jest.resetAllMocks();
    const getUserPreferenceMock = jest
      .spyOn(userRestService, 'getUserPreference')
      .mockResolvedValue({ value: ObjectAndWorksheetNamingOption.PAGE_NAME });

    await settingsSidePanelHelper.initWorksheetNamingAnswers();

    // then
    expect(getUserPreferenceMock).toHaveBeenCalledWith(
      UserPreferenceKey.EXCEL_PAGE_BY_AND_WORKSHEET_NAMING
    );
    expect(reduxStore.dispatch).toHaveBeenCalledWith({
      objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption.PAGE_NAME,
      type: SettingsActionTypes.SET_OBJECT_AND_WORKSHEET_NAMING_SETTING,
    });
  });

  it('should initialize data auto refresh', async () => {
    // given
    jest.resetAllMocks();
    const getUserPreferenceMock = jest
      .spyOn(userRestService, 'getUserPreference')
      .mockResolvedValue({ value: true });

    await settingsSidePanelHelper.initWorksheetNamingAnswers();

    // then
    expect(getUserPreferenceMock).toHaveBeenCalledWith(
      UserPreferenceKey.EXCEL_PAGE_BY_AND_WORKSHEET_NAMING
    );
    expect(reduxStore.dispatch).toHaveBeenCalledWith({
      objectAndWorksheetNamingSetting: ObjectAndWorksheetNamingOption.PAGE_NAME,
      type: SettingsActionTypes.SET_OBJECT_AND_WORKSHEET_NAMING_SETTING,
    });
  });
});
