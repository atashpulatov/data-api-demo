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
        Then I verified excel sheet has a image inserted


    # check the image refresh button function
        When I clicked Refresh on object 1
        Then I verified excel sheet has a image inserted
        Then I verified excel sheet has total 1 images

    # check the Clear data 
        When I clicked clear data
        Then I verified excel sheet has total 0 images
        And I clicked view data
        Then I verified excel sheet has total 1 images

    # check the image remove function
        And I removed object 1 using context menu
        Then I verified excel sheet has no image inserted

    # check the image duplicate function
        And I duplicate object 1 using context menu without prompt
        Then I selected Active Cell option in Duplicate popup
        And I clicked Import button in Duplicate popup for image
    # Issue existed for the error message
        And I verified that the object 1 action in warning box is "Could not complete the operation. The image was deleted manually."
        Then I verified excel sheet has total 2 images

    # check the image duplication function to new sheet
        And I duplicate object 1 using context menu without prompt
        And I clicked Import button in Duplicate popup for image
        Then I verified excel sheet has total 1 images
        Then I verified that number of worksheets is 2



