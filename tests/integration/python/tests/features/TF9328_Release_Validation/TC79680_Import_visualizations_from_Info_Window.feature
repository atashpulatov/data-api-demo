@ci_pipeline_postmerge_windows_chrome
Feature: TF9328 - Release Validation

  Scenario: [TC79680] - Import visualizations from an Info Window
    Given I initialized Excel
     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Info Window by kechu"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 3
      And I clicked "BMG" element on current visualization
      And I selected "Visualization 1" on Info Window Panel
      And I selected import type "Import Data" and clicked import
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["Alternative Movies", "Country Music"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I clicked "WEA" element on current visualization
      And I opened Show Data panel for "Visualization 2" on Info Window
      And I closed Show Data panel
      # TODO remove the repeated step after DE215033 is fixed
      And I clicked "WEA" element on current visualization
      And I clicked "WEA" element on current visualization
      And I selected "Visualization 2" on Info Window Panel
      # TODO These maximize/minimize steps are implemented for Chrome only
      And I maximized "Visualization 2" on Info Window
      And I minimized "Visualization 2" on Info Window
      And I clicked "Import Data" button after Edit
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["Jan", "Feb"]

      And I logged out
