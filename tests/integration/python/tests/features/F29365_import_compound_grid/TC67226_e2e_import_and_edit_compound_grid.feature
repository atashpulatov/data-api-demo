@ci_pipeline_rv_windows_chrome
@ci_pipeline_rv_mac_chrome
@todo_windows_desktop
@windows_chrome
@mac_desktop
@mac_chrome
@release_validation
@ga_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "169D6C564AEFA0FAB707F59B2A74A8B8" and selected "Dossier with Compound Grid - Exclude/Keep Only"
     Then I verified Prepare Data button is disabled

      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cells ["A2", "A9", "C11"] have values ["", "May", "$31,681"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected "Subcategory" in Replace With for "Month of Year" attribute for visualization "Visualization 1"
      And I selected Exclude for "Art & Architecture" element in "Subcategory" attribute for visualization "Visualization 1"
      And I selected "Total" in Show Totals for "Subcategory" attribute for visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cells ["A2", "A9", "C11"] have values ["", "Science & Technology", ""]

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then I verified that cells ["A2", "A9", "C11"] have values ["", "Science & Technology", ""]

     When I removed object 1 using icon
      And I closed last notification
     Then I verified that cells ["A2", "A9", "C11"] have values ["", "", ""]

      And I logged out
