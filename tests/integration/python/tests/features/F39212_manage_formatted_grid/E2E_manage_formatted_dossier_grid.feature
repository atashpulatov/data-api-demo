@formatted_grid
Feature: F39212 - Ability to import formatted grids into Excel worksheet
    
    Scenario: E2E - Manage formatted dossier grid
      Given I initialized Excel
       
       When I logged in as default user
        
        And I clicked Import Data button
        And I switched the Import Data popup view to "Grid View" 
        And I verified that the Import Data popup show "Grid View"
        And I verified that Import button is disabled
        And I verified that Prepare Data button is disabled
        And I found and selected object "(AUTO) Formatted Multiple Visualization Dossier"
        And I verified that Import button is enabled
        And I verified that Prepare Data button is disabled
        And I clicked Import button without checking results
        And I waited for dossier to load successfully
        And I verified that Import button is disabled

        # Verify the tooltip for import button
        And I hover over Import button
       Then I verified that tooltip for Import button shows message "This button is currently disabled because you didn’t select any data" 

        # Verify whether the import formatted data button is disabled
        And I selected visualization "Bar Chart"
        And I verified that Import with options button is enabled
        And I clicked options button
        And I verified that "Import Formatted Data" option is disabled in options dropdown

        # Import formatted grid into worksheet
        And I selected visualization "Grid"
        And I verified that Import with options button is enabled
        And I clicked options button
        And I verified that "Import Formatted Data" option is enabled in options dropdown
        And I selected "Import Formatted Data" option in options dropdown
        And I clicked Import with options button without checking results
        And I closed last notification
       Then I verified that cell "C3" has value "$529"

       # Refresh formatted grid
       When I clicked Refresh on object 1
        And I closed notification on object 1
       Then I verified that cell "C3" has value "$529"

       # Edit formatted grid
       When I clicked Edit object 1
        And I waited for dossier to load successfully
        And I selected dossier page or chapter 1
        # Verify the tooltip for import button on non-grid visualization selection
        And I selected visualization "Pie Chart"
        And I verified that Import Formatted Data button is disabled
        And I hover over Import Formatted Data button
       Then I verified that tooltip for Import button shows message "Selected non-grid visualization cannot be imported as formatted data"     
        # Then import formatted compound grid    
        And I selected visualization "Compound Grid"
        And I clicked import formatted data without waiting for results
        And I closed last notification
       Then I verified that cell "C3" has value "$4,779"

       # Clear entire data
       When I clicked clear data
        And I waited for Clear Data overlay to have title "Data Cleared!"
        And I verified that the Clear Data overlay displayed message "MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again."
       Then I verified that cells ["A1", "C1", "B3"] have values ["Year", "Revenue", ""]

        # View cleared data    
        And I clicked view data
        And I closed last notification
       Then I verified that cells ["A1", "C1", "B3"] have values ["Year", "Revenue", "$592"]    

       # Duplicate formatted grid into active cell
       When I selected cell "X52"
        And I duplicate object 1 using context menu without prompt
       Then I selected Active Cell option in Duplicate popup
        And I clicked Import button in Duplicate popup without checking results
        And I closed last notification
       Then I verified that object number 1 is called "Compound Grid (2)"
        And I verified that cell "X54" has value "2021"

       # Remove duplicated formatted grid
       When I removed object 1 using context menu
        And I closed last notification
       Then I verified that cells ["X52", "Y53", "Z54"] have values ["", "", ""]

        # Duplicate formatted grid into new worksheet
        And I duplicate object 1 using context menu without prompt
        And I clicked Import button in Duplicate popup without checking results
        And I closed last notification
        And I selected worksheet number 2
       Then I verified that cell "C4" has value "$10,535"

        And I logged out




