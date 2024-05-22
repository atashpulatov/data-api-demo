Feature: F39208 - Import as Pivot Table

  Scenario: [TC94157] -  FUN - Import Modifications
    Given I initialized Excel
    When I logged in as default user

    #Settings preparation. Default Import type should be Data / Toggles for Pivot Table should be OFF
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Data"
    And I clicked "Pivot Table" section on Settings menu
    And I verified that "Attributes" setting in Pivot section is OFF
    And I verified that "Metrics" setting in Pivot section is OFF

    #Import report
    When I clicked Import Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    Then I verify object is imported as Pivot Table

    #Enabled Attributes to Columns
    When I added a new worksheet
    And I open Settings in Dots Menu
    And I toggle the "Attributes" setting in Pivot section
    Then I checked the "Attributes" setting in Pivot section is ON
    And I click back button in Settings

    #Import report
    When I clicked Add Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    Then I verified that cell "A6" has value "Nancy"
    And I verified that cell "B5" is empty
    And I verify object is imported as Pivot Table

    #Enabled Metrics to Values
    When I added a new worksheet
    And I open Settings in Dots Menu
    And I toggle the "Metrics" setting in Pivot section
    Then I checked the "Metrics" setting in Pivot section is ON
    And I click back button in Settings

    #Import report
    When I clicked Add Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    Then I verified that cell "B5" has value "$847,227"
    And I verify object is imported as Pivot Table

    #Change default Import type.
    When I added a new worksheet
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Pivot Table"
    And I clicked "Import" section on Settings menu
    And I clicked "Pivot Table" section on Settings menu

    #Verify Default Import type.
    When I clicked Add Data button
    And I found and selected object "01 Basic Report"
    Then I verified import button is set to "Import Pivot Table"

