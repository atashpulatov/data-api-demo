@formatted_grid
Feature: F39212 - Ability to import formatted grids into Excel worksheet
    
    Scenario: [TC92631] - Manage formatted crosstab dossier grid
        Given I initialized Excel

        When I logged in as default user

        And I clicked Import Data button
        And I switched the Import Data popup view to "List View" 
        And I verified that the Import Data popup show "List View"
        And I verified that Import button is disabled
        And I verified that Prepare Data button is disabled
        And I found and selected object "Compound Grid vs Grid"
        And I verified that Import button is enabled
        And I verified that Prepare Data button is disabled
        And I clicked Import button without checking results
        And I waited for dossier to load successfully
        And I verified that Import button is disabled

    # Verify the tooltip for import button
        And I hover over Import button
        Then I verified that tooltip for Import button shows message "This button is currently disabled because you didn’t select any data" 

    # Import formatted grid into worksheet
        And I selected visualization "Visualization 2"
        And I verified that Import with dropdown button is enabled
        And I clicked Import dropdown button
        And I verified that "Import Formatted Data" item in Import dropdown is enabled
        And I selected "Import Formatted Data" item in Import dropdown
        And I clicked Import with dropdown button without checking results
        And I closed last notification
        And I verified that cell "D2" has value "Central"

    # Refresh formatted grid
        When I clicked Refresh on object 1
        And I closed notification on object 1
        And I verified that cell "D2" has value "Central"

    # Edit formatted grid and import formatted compound grid
        When I clicked Edit object 1
        And I waited for dossier to load successfully
        And I selected dossier page or chapter 1
        And I selected visualization "Visualization 1"
        And I verified that Import Formatted Data button is enabled
        And I clicked import formatted data without waiting for results
        And I closed last notification  
        And I verified that cell "D2" has value "East"

    # Clear entire data
        When I clicked clear data
        And I waited for Clear Data overlay to have title "Data Cleared!"
        And I verified that the Clear Data overlay displayed message "MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again."
        Then I verified that cells ["A1", "C1", "B3"] have values ["Category", "Discount", ""]

    # View cleared data    
        And I clicked view data
        And I closed last notification
        Then I verified that cells ["A1", "C1", "B3"] have values ["Category", "Discount", "1"]

    # Duplicate formatted grid into active cell
        When I selected cell "Y53"
        And I duplicate object 1 using context menu without prompt
        Then I selected Active Cell option in Duplicate popup
        And I clicked Import button in Duplicate popup without checking results
        And I closed last notification
        Then I verified that object number 1 is called "Visualization 1 (2)"
        And I verified that cell "Y55" has value "Furniture"

    # Remove duplicated formatted grid
        When I removed object 1 using context menu
        And I closed last notification
        Then I verified that cells ["Y53", "Z54", "AA56"] have values ["", "", ""]

    # Duplicate formatted grid into new worksheet
        And I duplicate object 1 using context menu without prompt
        And I clicked Import button in Duplicate popup without checking results
        And I closed last notification
        And I selected worksheet number 2
        Then I verified that cell "C1" has value "Discount"

        And I logged out




