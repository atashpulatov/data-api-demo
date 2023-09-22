@folder_browsing
Feature: F38417 - Ability to navigate the folder structure when importing content in the MicroStrategy add-in for Excel 

  Scenario: [TC89964] - Library view in Excel plugin
    Given I initialized Excel

     When I logged in as default user

    #Check Grid View
      And I clicked Import Data button
      And I verified that the Import Data popup show "Grid View"
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Report" object "(AUTO) Simple Report" in "Grid View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I found and clicked "Dossier" object "(AUTO) Multiple Visualization Dossier" in "Grid View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
     Then I closed Import Data popup

    #Import Report from Grid View
      And I clicked Import Data button
      And I verified that the Import Data popup show "Grid View"
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Report" object "(AUTO) Simple Report" in "Grid View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked import dossier without waiting for results
      And I closed all notifications
     Then I verified that number of worksheets is 1

    #Import Dossier from Grid View
      And I clicked Add Data button
      And I verified that the Import Data popup show "Grid View"
      And I found and clicked "Dossier" object "(AUTO) Multiple Visualization Dossier" in "Grid View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Grid"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
     Then I verified that number of worksheets is 2
      
    #Check List View
     When I clicked Add Data button
      And I switched the Import Data popup view to "List View" 
      And I verified that the Import Data popup show "List View"
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Dossier" object "(AUTO) Multiple Visualization Dossier" in "List View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Report" object "(AUTO) Simple Report" in "List View"
      And I verified that Import button is enabled
     Then I closed Import Data popup

    #Import Report from List View
      And I clicked Add Data button
      And I switched the Import Data popup view to "List View" 
      And I verified that the Import Data popup show "List View"
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Report" object "(AUTO) Simple Report" in "List View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
     Then I verified that number of worksheets is 3

    #Import Dossier from List View
      And I clicked Add Data button
      And I switched the Import Data popup view to "List View" 
      And I verified that the Import Data popup show "List View"
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Dossier" object "(AUTO) Multiple Visualization Dossier" in "List View"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "HeatMap"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
     Then I verified that number of worksheets is 4
     
      And I logged out
