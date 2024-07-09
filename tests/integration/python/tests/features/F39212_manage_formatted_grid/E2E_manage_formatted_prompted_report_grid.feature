@formatted_grid
Feature: F39212 - Ability to import formatted grids into Excel worksheet
    
    Scenario: E2E - Manage formatted prompted report grid
        Given I initialized Excel

        When I logged in as default user

        And I clicked Import Data button
        And I switched the Import Data popup view to "Grid View" 
        And I verified that the Import Data popup show "Grid View"
        And I verified that Import button is disabled
        And I verified that Prepare Data button is disabled
        And I found and selected object "Reprompt - Prompt on Category"
        And I verified that Prepare Data button is enabled
        And I verified that Import with options button is enabled
        And I clicked options button
        And I verified that "Import Formatted Data" option is enabled in options dropdown
        And I selected "Import Formatted Data" option in options dropdown
        And I clicked Import with options button without checking results
        And I unselected "Movies" as an answer for "1. Category" prompt - object prompt
        And I unselected "Music" as an answer for "1. Category" prompt - object prompt
        And I selected "Books" as an answer for "1. Category" prompt - object prompt

    # Import formatted grid into worksheet
        And I clicked Run button
        And I closed last notification
        Then I verified that cell "C3" has value "$681,179"

    # Refresh formatted grid
        When I clicked Refresh on object 1
        And I closed notification on object 1
        Then I verified that cell "C3" has value "$681,179"


    # Reprompt formatted grid
        When I clicked Reprompt on object 1
        And I waited for Prompt Dialog is ready
        And I unselected "Books" as an answer for "1. Category" prompt - object prompt
        And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
        And I clicked Run button
        And I closed last notification
        Then I verified that cell "C3" has value "$6,610,260"

    # Edit formatted grid and import formatted compound grid
        When I clicked Edit object 1
        And I waited for Run button to be enabled
        And I selected "Books" as an answer for "1. Category" prompt - object prompt
        And I clicked Run button
        And I verified that Columns & Filters Selection is visible
        And I verified that counter of "metrics" shows "2" of "2" selected
        And I verified that counter of "attributes" shows "2" of "2" selected
        And I verified that counter of "filters" shows "0" of "2" selected
        And I clicked Import Formatted Data button in Columns and Filters Selection without success check
        And I closed last notification  
        Then I verified that cell "C3" has value "$4,970,513"

    # Clear entire data
        When I clicked clear data
        And I waited for Clear Data overlay to have title "Data Cleared!"
        And I verified that the Clear Data overlay displayed message "MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again."
        Then I verified that cells ["A1", "C1", "B3", "C4"] have values ["Year", "Cost", "", ""]

    # View cleared data    
        And I clicked view data
        And I closed last notification
        Then I verified that cells ["A1", "C1", "B3", "C4"] have values ["Year", "Cost", "Electronics", "$681,179"]    

    # Duplicate formatted grid into active cell
        When I selected cell "X52"
        And I duplicate object 1 using context menu without prompt
        Then I selected Active Cell option in Duplicate popup
        And I clicked Import button in Duplicate popup without checking results
        And I closed last notification
        Then I verified that object number 1 is called "Reprompt - Prompt on Category (2)"
        Then I verified that cell "Y53" has value "Books"

    # Remove duplicated formatted grid
        When I removed object 1 using context menu
        And I closed last notification
        Then I verified that cells ["X52", "Y53", "Z54"] have values ["", "", ""]

    # Duplicate formatted grid into new worksheet
        And I duplicate object 1 using context menu without prompt
        And I clicked Import button in Duplicate popup without checking results
        And I closed last notification
        And I selected worksheet number 2
        Then I verified that cell "C4" has value "$681,179"

        And I logged out




