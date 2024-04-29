import { userRestService } from '../../../home/user-rest-service';
import { formattingSettingsHelper } from './formatting-settings-helper';

import { reduxStore } from '../../../store';

import { UserPreferenceKey } from '../settings-side-panel-types';

import { settingsActions } from '../../../redux-reducer/settings-reducer/settings-actions';

describe('FormattingSettingsHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    userPreferenceResponse | expectedFlagValue
    ${'0'}                 | ${false}
    ${'1'}                 | ${true}
    ${'true'}              | ${true}
    ${'false'}             | ${false}
  `(
    'getBooleanUserPreference should return correct value based on user preference response',
    async ({ userPreferenceResponse, expectedFlagValue }) => {
      // Given
      jest
        .spyOn(userRestService, 'getUserPreference')
        .mockResolvedValue({ value: userPreferenceResponse });

      // When
      const result = await formattingSettingsHelper.getBooleanUserPreference(
        UserPreferenceKey.EXCEL_IMPORT_ATTRIBUTES_AS_TEXT
      );

      // Then
      expect(result).toBe(expectedFlagValue);
    }
  );

  it('initImportFormattingSettings should dispatch correct actions and get correct preferences', async () => {
    // Given
    jest.spyOn(formattingSettingsHelper, 'getBooleanUserPreference').mockResolvedValue(true);
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');

    // When
    await formattingSettingsHelper.initImportFormattingSettings();

    // Then
    expect(formattingSettingsHelper.getBooleanUserPreference).toHaveBeenCalledTimes(2);
    expect(formattingSettingsHelper.getBooleanUserPreference).toHaveBeenCalledWith(
      UserPreferenceKey.EXCEL_IMPORT_ATTRIBUTES_AS_TEXT
    );
    expect(formattingSettingsHelper.getBooleanUserPreference).toHaveBeenCalledWith(
      UserPreferenceKey.EXCEL_IMPORT_MERGE_CROSSTAB_COLUMNS
    );

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      settingsActions.toggleImportAttributesAsTextFlag(true) as any
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      settingsActions.toggleMergeCrosstabColumnsFlag(true) as any
    );
  });

  it('toggleImportAsText should dispatch correct actions and call userRestService', async () => {
    // Given
    const importAttributesAsText = true;
    const setUserPreferenceMock = jest
      .spyOn(userRestService, 'setUserPreference')
      .mockImplementation();
    const dispatchMock = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // When
    await formattingSettingsHelper.toggleImportAsText(importAttributesAsText);

    // Then
    expect(setUserPreferenceMock).toHaveBeenCalledTimes(1);
    expect(setUserPreferenceMock).toHaveBeenCalledWith(
      UserPreferenceKey.EXCEL_IMPORT_ATTRIBUTES_AS_TEXT,
      importAttributesAsText
    );

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      settingsActions.toggleImportAttributesAsTextFlag(importAttributesAsText) as any
    );
  });

  it('toggleMergeCrosstabColumns should dispatch correct actions and call userRestService', async () => {
    // Given
    const mergeCrosstabColumns = true;
    const setUserPreferenceMock = jest
      .spyOn(userRestService, 'setUserPreference')
      .mockImplementation();
    const dispatchMock = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // When
    await formattingSettingsHelper.toggleMergeCrosstabColumns(mergeCrosstabColumns);

    // Then
    expect(setUserPreferenceMock).toHaveBeenCalledTimes(1);
    expect(setUserPreferenceMock).toHaveBeenCalledWith(
      UserPreferenceKey.EXCEL_IMPORT_MERGE_CROSSTAB_COLUMNS,
      mergeCrosstabColumns
    );

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      settingsActions.toggleMergeCrosstabColumnsFlag(mergeCrosstabColumns) as any
    );
  });
});
