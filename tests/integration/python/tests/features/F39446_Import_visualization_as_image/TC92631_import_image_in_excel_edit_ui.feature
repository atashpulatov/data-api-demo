@image_excel
Feature: F39446 - Ability to import visualization as image in Excel
    
    Scenario: [TC92631] - Import image for visualization dossier in Excel plugin
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

    # Issue check for tooltip for image button
        Then I hover over Import image button
        Then I verified that tooltip for Import button shows message "This button is currently disabled because you didn’t select any data"

        And I selected visualization "Grid"

        And I verified that Import button is enabled
        And I verified that Import image button is enabled
        And I clicked Import image button without checking results

    # check the image has been inserted
        Then I waited for object operation to complete successfully with message "Import successful"
        Then I verified excel sheet has a image inserted


    # check the image edit function
        When I edit object 1 using context menu without prompt
        And I verified that Import image button is enabled
        And I selected visualization "HeatMap"
        And I clicked Import image button without checking results
        Then I verified excel sheet has total 1 images

    # check basic Ui existence
        And I verified that path name in inner html for object number 1 displays "(AUTO) Multiple Visualization Dossier > Chapter 1 > Page 1"
        And I verified that sub title for object number for object number 1 displays "HeatMap"
        Then I verified that right click context menu has 6 items
        Then I verified that context menu has "Refresh" button
        Then I verified that context menu has "Edit" button
        Then I verified that context menu has "Duplicate" button
        Then I verified that context menu has "Rename" button
        Then I verified that context menu has "Delete" button
        Then I verified that context menu has "Copy Name" button

