Feature: F39208 - Import as Pivot Table

  Scenario: [TC94155] -  E2E - Import Visualization as Pivot Table
    Given I initialized Excel
    When I logged in as default user

    #Settings preparation. Default Import type should be Data / Toggles for Pivot Table should be ON
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Data"
    And I clicked "Pivot Table" section on Settings menu
    And I verified that "Attributes" setting in Pivot section is ON
    And I verified that "Metrics" setting in Pivot section is ON

    #Import Visualization 1
    And I clicked Import Data button
    And I found and selected object "(AUTO) Multiple Visualization Dossier"
    And I clicked Import button to open Import Dossier
    And I waited for dossier to load successfully
    And I selected dossier page or chapter 1
    And I selected visualization "KPI"
    Then I verified import button is set to "Import Pivot Table"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    Then I verify object is imported as Pivot Table
    And I verified that cell "A5" has value "2021"
    And I verified that cell "B5" has value "$592"

    #Import Visualization 2
    When I added a new worksheet
    And I clicked Add Data button
    And I found and selected object "(AUTO) Multiple Visualization Dossier"
    And I clicked Import button to open Import Dossier
    And I waited for dossier to load successfully
    And I selected dossier page or chapter 1
    And I selected visualization "HeatMap"
    Then I verified import button is set to "Import Pivot Table"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    Then I verify object is imported as Pivot Table
    And I verified that cell "A5" has value "Boston"
    And I verified that cell "B5" has value "$1,055"

    #Import Visualization 3
    When I added a new worksheet
    And I clicked Add Data button
    And I found and selected object "(AUTO) Multiple Visualization Dossier"
    And I clicked Import button to open Import Dossier
    And I waited for dossier to load successfully
    And I selected dossier page or chapter 1
    And I selected visualization "Compound Grid"
    Then I verified import button is set to "Import Pivot Table"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    Then I verify object is imported as Pivot Table
    And I verified that cell "A5" has value "2021"
    And I verified that cell "B5" has value "$592"

    