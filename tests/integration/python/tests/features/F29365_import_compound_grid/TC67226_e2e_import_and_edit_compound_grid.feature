@windows_chrome
@mac_chrome
@release_validation
@ga_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I logged in as default user
     When I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "169D6C564AEFA0FAB707F59B2A74A8B8" and selected "Dossier with Compound Grid - Exclude/Keep Only"

      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification

     Then cells ["A2", "A9", "C11"] should have values ["", "May", "$31,681"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected "Subcategory" in Replace With for "Month of Year" attribute
      And I selected Exclude for "Art & Architecture" element in "Subcategory" attribute
      And I selected "Total" in Show Totals for "Subcategory" attribute
      And I clicked import dossier
      And I closed last notification

     Then cells ["A2", "A9", "C11"] should have values ["", "Science & Technology", ""]

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then cells ["A2", "A9", "C11"] should have values ["", "Science & Technology", ""]

     When I removed object 1 using icon
     Then I closed last notification

      And I logged out
