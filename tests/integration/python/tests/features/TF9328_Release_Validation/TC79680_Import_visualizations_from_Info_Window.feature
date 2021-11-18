#@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
#@windows_chrome
@mac_chrome
#@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC79680] - Import visualizations from an Info Window
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "E6C782172D411D9CAC0B5FAE28E03A54" and selected "Info Window by kechu"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 3
      And I clicked "BMG" element in "Supplier" attribute for visualization "Visualization 1"
      And I selected "Visualization 1" from Info Window "Panel 1"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["Alternative Movies", "Country Music"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "Visualization 1"
      And I clicked "WEA" element in "Supplier" attribute for visualization "Visualization 1"
      And I selected "Visualization 2" on Info Window "Panel 1"
      And I opened Show Data panel for "Visualization 2"
      And I closed Show Data panel
      And I maximized "Visualization 2" on Info Window "Panel 1"
      And I minimized "Visualization 2" on Info Window "Panel 1"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["Jan", "Feb"]

