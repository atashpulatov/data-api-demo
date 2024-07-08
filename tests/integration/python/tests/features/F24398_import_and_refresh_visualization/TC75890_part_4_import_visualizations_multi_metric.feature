#@ci_pipeline_postmerge_windows_chrome
Feature: TF9328 - Release Validation

  Scenario: [TC75890] - Import different types of visualizations - Multi-metric
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button

      And I found and selected object "MultiMetricKPI and ComparisonKPI for Excel"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Multi Metric KPI"
      And I selected import type "Import Data" and clicked import
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
