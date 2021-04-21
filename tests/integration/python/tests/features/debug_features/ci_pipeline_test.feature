@ci_pipeline_rv_mac_chrome @ci_pipeline_premerge_mac_chrome @ci_pipeline_postmerge_mac_chrome @ci_pipeline_daily_mac_chrome @ci_pipeline_all_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_premerge_windows_chrome @ci_pipeline_postmerge_windows_chrome @ci_pipeline_daily_windows_chrome @ci_pipeline_all_windows_chrome
@ci_pipeline_rv_windows_desktop @ci_pipeline_premerge_windows_desktop @ci_pipeline_postmerge_windows_desktop @ci_pipeline_daily_windows_desktop @ci_pipeline_all_windows_desktop
@mac_chrome
@windows_chrome
@release_validation
@ga_validation

Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Part 2. - Import multiple objects | Refresh All
    Given I initialized Excel

     When I logged in as default user

      And I logged out
