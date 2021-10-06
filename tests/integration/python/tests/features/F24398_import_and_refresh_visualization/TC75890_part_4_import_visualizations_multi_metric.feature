#@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_chrome @mac_chrome
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC75890] - Import different types of visualizations - Multi-metric
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "4571B7217A41907D0CF2F9A2B39DBF08" and selected "MultiMetricKPI and ComparisonKPI for Excel"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Multi Metric KPI"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A2", "D2", "C66"] have values ["Boots", "7547.07", "14135.00"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I clicked Cancel button
     Then I verified that cells ["A2", "D2", "C66"] have values ["Boots", "7547.07", "14135.00"]
      
     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["A2", "D2", "C66"] have values ["Boots", "7547.07", "14135.00"]

      And I logged out
