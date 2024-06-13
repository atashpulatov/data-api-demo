Feature: F39208 - Import as Pivot Table

  Scenario: [TC94156] -  FUN - Import Modifications
  Given I initialized Excel
   When I logged in as default user

  # Settings preparation. Default Import type should be Data / Toggles for Pivot Table should be ON
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Data"
    And I clicked "Pivot Table" section on Settings menu
    And I toggle the "Attributes" setting in Pivot section to ON
    And I toggle the "Metrics" setting in Pivot section to ON
    And I click back button in Settings

  # Import report
   When I clicked Import Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I hover over import successfull message
    And I selected cell "B5"
   Then I verify object is imported as Pivot Table
    And I closed PivotTable window

    And I clicked Overview settings menu option
   Then I verified Overview window is opened

# Refresh
   When I clicked select all checkbox in Overview window
   Then I verified "Refresh" button in Overview window is enabled
    And I clicked "Refresh" button in Overview window
    And I waited for all objects to be refreshed successfully

# Duplicate
  When I selected object "1" using object checkbox in Overview window
  Then I verified "Duplicate" button in Overview window is enabled
   And I clicked "Duplicate" button in Overview window
   And I verified that New Sheet is selected in Duplicate popup
   And I clicked Import button in Duplicate popup on overview

# Delete
  When I clicked select all checkbox in Overview window
   And I verified "Delete" button in Overview window is enabled
   And I clicked "Delete" button in Overview window
  Then I verified that Delete confirmation popup is visible
   And I clicked Delete button in confirmation popup
   And I waited for all objects to be removed successfully
   And I clicked "Close" button in Overview window

   And I logged out
