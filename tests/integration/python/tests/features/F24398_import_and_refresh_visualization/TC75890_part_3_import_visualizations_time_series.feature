#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome
#@ci_pipeline_rv_mac_chrome
@todo_windows_desktop @windows_chrome @mac_chrome
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC75890] - Import different types of visualizations - TimeSeries
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "2764C611754327219C138B9C4F245C2D" and selected "TimeSeries dossier for Excel"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A1", "B4", "E1139"] have values ["Date", "245", "321"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I clicked Cancel button
     Then I verified that cells ["A1", "B4", "E1139"] have values ["Date", "245", "321"]
      
     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["A1", "B4", "E1139"] have values ["Date", "245", "321"]

      And I logged out
