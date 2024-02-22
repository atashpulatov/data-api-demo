@image_excel
Feature: F39446 - Ability to import visualization as image in Excel
    
    Scenario: [TC92631] - Library view in Excel plugin
        Given I initialized Excel

        When I logged in as default user

        And I clicked Import Data button
        And I verified that the Import Data popup show "Grid View"
        And I verified that Import button is disabled
        And I verified that Prepare Data button is disabled
        And I found and clicked "Dashboard" object "(AUTO) Multiple Visualization Dossier" in "Grid View"
        And I verified that Import button is enabled
        And I verified that Prepare Data button is disabled

        And I clicked Import button without checking results
        And I waited for dossier to load successfully

        And I verified that Import button is disabled
        And I verified that Import image button is disabled

        And I selected visualization "Grid"

        And I verified that Import button is enabled
        And I verified that Import image button is enabled
        And I clicked Import image button without checking results

        Then I verified excel sheet has a image inserted




