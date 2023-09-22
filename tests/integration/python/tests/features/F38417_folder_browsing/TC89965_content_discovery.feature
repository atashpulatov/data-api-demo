@folder_browsing
Feature: F38417 - Ability to navigate the folder structure when importing content in the MicroStrategy add-in for Excel 

  Scenario: [TC89965] - Content discovery in Excel plugin
    Given I initialized Excel

     When I logged in as default user

    #Check Content Discovery
     When I clicked Import Data button
      And I click on Library icon
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I found and clicked "Report" object "(AUTO) Simple Report" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I found and clicked "Dossier" object "(AUTO) Multiple Visualization Dossier" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I found and clicked "Cube" object "(AUTO) Region OLAP Cube" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I found and clicked "Dataset" object "(AUTO) Airline MTDI Cube" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
     Then I closed Import Data popup

    #Import Report from Content Discovery
      And I clicked Import Data button
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I found and clicked "Report" object "(AUTO) Simple Report" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
     Then I verified that number of worksheets is 1

    #Import Dossier from Content Discovery
      And I clicked Add Data button
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I found and clicked "Dossier" object "(AUTO) Multiple Visualization Dossier" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Grid"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
      And I closed all notifications
     Then I verified that number of worksheets is 2

    #Import Cube from Content Discovery
      And I clicked Add Data button
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I found and clicked "Cube" object "(AUTO) Region OLAP Cube" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      And I clicked OK button in Range Taken popup
      And I closed all notifications
     Then I verified that number of worksheets is 3

    #Import Dataset from Content Discovery
      And I clicked Add Data button
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I found and clicked "Cube" object "(AUTO) Airline MTDI Cube" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      And I clicked OK button in Range Taken popup
      And I closed all notifications
     Then I verified that number of worksheets is 4

      And I logged out
