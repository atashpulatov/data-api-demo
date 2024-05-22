#@ci_pipeline_postmerge_windows_chrome
Feature: F39208 - Import as Pivot Table

  Scenario: [TC94153] -  E2E - Import Report/Cube/Dataset. No data preparations
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
    And I clicked Import Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    And I verify object is imported as Pivot Table

    #Import Cube
    When I added a new worksheet
    And I clicked Add Data button
    And I found and selected object "Revenue Cube"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    And I verify object is imported as Pivot Table

    #Change default Import type.
    When I added a new worksheet
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Pivot Table"
    And I clicked "Import" section on Settings menu
    And I clicked "Pivot Table" section on Settings menu
    And I toggle the "Attributes" setting in Pivot section
    Then I checked the "Attributes" setting in Pivot section is ON
    And I toggle the "Metrics" setting in Pivot section
    Then I checked the "Metrics" setting in Pivot section is ON
    And I click back button in Settings

    #Import report
    When I added a new worksheet
    And I clicked Add Data button
    And I found and selected object "01 Basic Report"
    And I waited for object to be imported successfully
    Then I verified that cell "B5" has value "$847,227"
    And I verify object is imported as Pivot Table

    #Import Cube
    When I added a new worksheet
    And I clicked Add Data button
    And I found and selected object "Revenue Cube"
    And I waited for object to be imported successfully
    Then I verified that cell "B5" has value "2,394"
    And I verify object is imported as Pivot Table
