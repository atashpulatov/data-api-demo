Feature: F39208 - Import as Pivot Table

  Scenario: [TC94157] -  FUN - Import Modifications
  Given I initialized Excel
   When I logged in as default user

  # Settings preparation. Default Import type should be Data / Toggles for Pivot Table should be OFF
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Data"
    And I clicked "Pivot Table" section on Settings menu
    And I toggle the "Attributes" setting in Pivot section to OFF
    And I toggle the "Metrics" setting in Pivot section to OFF
    And I click back button in Settings

  # Import report
   When I clicked Import Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
   Then I verify object is imported as Pivot Table
    And I closed PivotTable window

  # Enabled Attributes to Columns
   When I added a new worksheet
    And I open Settings in Dots Menu
    And I toggle the "Attributes" setting in Pivot section to ON
    And I click back button in Settings

   # Import report
   When I clicked Add Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
   Then I verified that cell "A6" has value "Nancy"
    And I verified that cell "B5" is empty
    And I verify object is imported as Pivot Table
    And I closed PivotTable window

  # Enabled Metrics to Values
   When I added a new worksheet
    And I open Settings in Dots Menu
    And I toggle the "Metrics" setting in Pivot section to ON
    And I click back button in Settings

  # Import report
   When I clicked Add Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
   Then I verified that cell "B5" has value "$847,227"
    And I verify object is imported as Pivot Table
    And I closed PivotTable window

  # Change default Import type.
   When I added a new worksheet
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Pivot Table"
    And I clicked "Import" section on Settings menu
    And I clicked "Pivot Table" section on Settings menu
    And I click back button in Settings

    And I logged out
