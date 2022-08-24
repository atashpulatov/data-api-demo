#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome
#@ci_pipeline_rv_mac_chrome
@todo_windows_desktop @windows_chrome @mac_chrome
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC75890] - Import different types of visualizations - Microchart
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "D28B299011EB13BF96C80080EF9584DE" and selected "Dossier with microchart"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "Airline Performance"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B4", "C4"] have values ["BWI", "Sunday"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["B4", "C4"] have values ["Sunday", "2.05E+04"]
      
     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B4", "C4"] have values ["Sunday", "2.05E+04"]

      And I logged out
