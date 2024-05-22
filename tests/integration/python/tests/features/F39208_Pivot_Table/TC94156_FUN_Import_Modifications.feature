Feature: F39208 - Import as Pivot Table

  Scenario: [TC94156] -  FUN - Import Modifications
    Given I initialized Excel
    When I logged in as default user

    #Settings preparation. Default Import type should be Data / Toggles for Pivot Table should be ON
    # And I open Settings in Dots Menu
    # And I clicked "Import" section on Settings menu
    # And I changed default import type to "Data"
    # And I clicked "Pivot Table" section on Settings menu
    # And I verified that "Attributes" setting in Pivot section is ON
    # And I verified that "Metrics" setting in Pivot section is ON

    #Import report
    And I clicked Import Data button
    And I found and selected object "01 Basic Report"
    And I selected import type "Import Pivot Table" and clicked import
    And I waited for object to be imported successfully
    And I hover over import successfull message
    # And I selected cell "B5"
    # And I verify object is imported as Pivot Table

    # Refresh
    And I refreshed all objects
    # Edit
    # Duplicate
    When I clicked Duplicate on object 1
    And I selected Active Cell option in Duplicate popup
    And I clicked Edit button in Duplicate popup
    # Remove
    # Clear Data
