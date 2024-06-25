#@ci_pipeline_postmerge_windows_chrome
Feature: TF9328 - Release Validation

  Scenario: [TC75890] - Import different types of visualizations - Sankey
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Best Snakey"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Best Snakey"
      And I selected import type "Import Data" and clicked import
      And I closed last notification
     Then I verified that cells ["A2", "B2"] have values ["Furniture", "FUR-BO-10000112"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I clicked Cancel button
     Then I verified that cells ["A2", "B2"] have values ["Furniture", "FUR-BO-10000112"]
      
     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["A2", "B2"] have values ["Furniture", "FUR-BO-10000112"]

      And I logged out
