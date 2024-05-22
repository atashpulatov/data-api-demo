#@ci_pipeline_postmerge_windows_chrome
Feature: F39208 - Import as Pivot Table

  Scenario: [TC94154] -  E2E - Import Report/Cube/Dataset. Data preparations
    Given I initialized Excel
    When I logged in as default user

    #Settings preparation. Default Import type should be Data / Toggles for Pivot Table should be OFF
    And I open Settings in Dots Menu
    And I clicked "Import" section on Settings menu
    And I changed default import type to "Data"
    And I clicked "Pivot Table" section on Settings menu
    And I verified that "Attributes" setting in Pivot section is OFF
    And I verified that "Metrics" setting in Pivot section is OFF

    # #Import report. Data preparation
    And I clicked Import Data button
    And I found and selected object "01 Basic Report"
    And I clicked Prepare Data button

    When I selected all attributes
    And I clicked attribute "Employee"
    Then I verified that counter of "attributes" shows "1" of "2" selected

    When I selected all metrics
    And I clicked metric "Profit"
    And I clicked metric "Cost"

    Then I verified that counter of "metrics" shows "1" of "3" selected
    And I verified that counter of "filters" shows "0" of "2" selected

    When I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    Then I verify object is imported as Pivot Table

    #Adding objects to Rows / Values in Pivot Table section
    When I clicked "Employee" checkbox in Pivot Table section
    Then I verified "Employee" is in "Rows" section
    And I clicked "Profit" checkbox in Pivot Table section
    Then I verified "Profit" is in "Values" section
    And I clicked "Cost" checkbox in Pivot Table section
    Then I verified "Cost" is in "Values" section
    And I verified that cell "A5" has value "Mid-Atlantic"
    And I verified that cell "B5" has value "4452615.05"

    #Import Cube. Data preparation
    When I added a new worksheet
    And I clicked Add Data button
    And I found and selected object "Revenue Cube"

    And I clicked Prepare Data button

    When I selected all attributes
    And I clicked attribute "Month"
    And I clicked attribute "Call Center"
    And I clicked attribute "Quarter"
    Then I verified that counter of "attributes" shows "3" of "6" selected

    When I selected all metrics
    And I clicked metric "Month of Year"
    And I clicked metric "Month Index"

    Then I verified that counter of "metrics" shows "1" of "3" selected
    And I verified that counter of "filters" shows "0" of "6" selected
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I selected cell "B5"
    And I verify object is imported as Pivot Table

    #Adding objects to Rows / Values in Pivot Table section
    When I clicked "Region" checkbox in Pivot Table section
    Then I verified "Employee" is in "Rows" section
    And I clicked "Revenue" checkbox in Pivot Table section
    Then I verified "Revenue" is in "Values" section
    And I verified that cell "A5" has value "Mid-Atlantic"
    And I verified that cell "B5" has value "4452615.05"


