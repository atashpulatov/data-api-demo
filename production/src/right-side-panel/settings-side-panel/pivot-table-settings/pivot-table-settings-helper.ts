import { SettingPanelSection, SettingsSection } from '@mstr/connector-components';

import { userRestService } from '../../../home/user-rest-service';
import { getBooleanUserPreference } from '../settings-side-panel-helper';

import { reduxStore } from '../../../store';

import { PivotTableOption, UserPreferenceKey } from '../settings-side-panel-types';

import i18n from '../../../i18n';
import { settingsActions } from '../../../redux-reducer/settings-reducer/settings-actions';
import initializationErrorDecorator from '../initialization-error-decorator';

class PivotTableSettingsHelper {
  /**
   * Initializes the import formatting section
   * Retrieves the user preference for the importing as a text and merge crosstab columns from the userRestService,
   * updates the redux store with the retrieved value.
   */
  @initializationErrorDecorator.initializationWrapper
  async initPivotTableSettings(): Promise<void> {
    const pivotTableAddAttributesToColumns = await getBooleanUserPreference(
      UserPreferenceKey.EXCEL_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS
    );

    const pivotTableAddMetricsToValues = await getBooleanUserPreference(
      UserPreferenceKey.EXCEL_PIVOT_TABLE_ADD_METRICS_TO_VALUES
    );

    reduxStore.dispatch(
      settingsActions.setPivotTableAddAttributesToColumns(pivotTableAddAttributesToColumns) as any
    );
    reduxStore.dispatch(
      settingsActions.setPivotTableAddMetricsToValues(pivotTableAddMetricsToValues) as any
    );
  }

  /**
   * Handles the pivot table add attributes to columns setting change
   * @param value - The new value for the setting.
   */
  handlePivotTableAddAttributesToColumnsChange = async (value: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_PIVOT_TABLE_ADD_ATTRIBUTES_TO_COLUMNS,
      value
    );
    reduxStore.dispatch(settingsActions.setPivotTableAddAttributesToColumns(value));
  };

  /**
   * Handles the pivot table add metrics to values setting change
   * @param value - The new value for the setting.
   */
  handlePivotTableAddMetricsToValuesChange = async (value: boolean): Promise<void> => {
    await userRestService.setUserPreference(
      UserPreferenceKey.EXCEL_PIVOT_TABLE_ADD_METRICS_TO_VALUES,
      value
    );
    reduxStore.dispatch(settingsActions.setPivotTableAddMetricsToValues(value));
  };

  /**
   * Returns the settings section for the pivot table settings.
   * @param pivotTableAddAttributesToColumnsValue - The value of the pivotTableAddAttributesToColumns setting.
   * @param pivotTableAddMetricsToValuesValue - The value of the pivotTableAddMetricsToValues setting.
   * @returns The settings section for pivot table settings.
   */
  getPivotTableSection = (
    pivotTableAddAttributesToColumnsValue: boolean,
    pivotTableAddMetricsToValuesValue: boolean
  ): SettingsSection => ({
    key: 'pivot-table-settings',
    label: i18n.t('Pivot Table'),
    initialExpand: false,
    settingsGroups: [
      {
        key: 'pivot-table-add-attributes-to-columns',
        type: SettingPanelSection.SWITCH,
        onSwitch: this.handlePivotTableAddAttributesToColumnsChange,
        settings: [
          {
            key: PivotTableOption.ADD_ATTRIBUTES_TO_COLUMNS,
            label: i18n.t('Attributes'),
            value: pivotTableAddAttributesToColumnsValue,
            description: i18n.t(
              'If enabled, attributes will be automatically added to the ‘Column’ section of the pivot table.'
            ),
          },
        ],
      },
      {
        key: 'pivot-table-add-metrics-to-values',
        type: SettingPanelSection.SWITCH,
        onSwitch: this.handlePivotTableAddMetricsToValuesChange,
        settings: [
          {
            key: PivotTableOption.ADD_METRICS_TO_VALUES,
            label: i18n.t('Metrics'),
            value: pivotTableAddMetricsToValuesValue,
            description: i18n.t(
              'If enabled, metrics will be automatically added to the ‘Values’ section of the pivot table.'
            ),
          },
        ],
      },
    ],
  });
}

export const pivotTableSettingsHelper = new PivotTableSettingsHelper();
