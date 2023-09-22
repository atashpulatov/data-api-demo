@folder_browsing
Feature: F38417 - Ability to navigate the folder structure when importing content in the MicroStrategy add-in for Excel 

  Scenario: [TC89969] - Library search in Excel Plugin
    Given I initialized Excel

     When I logged in as default user

    #Import Cube from search result
     When I clicked Import Data button
      And I found and selected object "(AUTO) Region OLAP Cube"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked import dossier without waiting for results
     Then I verified that number of worksheets is 1

    #Import Dataset from search result
     When I clicked Add Data button
      And I found and selected object "(AUTO) Airline MTDI Cube"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
     Then I verified that number of worksheets is 2


    #Import Report from search result
     When I clicked Add Data button
      And I found and selected object "(AUTO) Simple Report"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
     Then I verified that number of worksheets is 3

    #Import Dossier from search result
     When I clicked Add Data button
      And I found and selected object "(AUTO) Multiple Visualization Dossier"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Grid"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
     Then I verified that number of worksheets is 4

      And I logged out
