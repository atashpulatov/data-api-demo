@reprompt
Feature: F38412 - Re-use prompt answers across multiple prompts when importing content via the MicroStrategy add-in for Excel

  Scenario: [TC90464] - Reuse Prompt Answers for Dossiers
    Given I initialized Excel

     When I logged in as default user

    # Check 'Reuse Prompt Answers' settings and toggle to ON
     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is OFF
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is ON
     When I click back button in Settings

    # Import first dossier with modified answer to Country prompt to update saved answers
     When I clicked Import Data button
      And I click on Library icon
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I clicked on folder "Reprompt"
      And I found and clicked "Dossier" object "Reprompt Dossier 2 - Prompt on Country, Region" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked import dossier without waiting for results
      And I verified in dossier prompt "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Canada" is a available answer for "1. Country" prompt - object prompt
      And I selected in dossier prompt "Canada" as an answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Mid-Atlantic" is a available answer for "2. Select Region" prompt - object prompt
      And I selected in dossier prompt "Mid-Atlantic" as an answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Mid-Atlantic" is a selected answer for "2. Select Region" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Visualization 1"
      And I clicked import dossier without waiting for results
      And I waited for object to be imported successfully
      And I closed all notifications
     Then I verified that number of worksheets is 1

    # Import different dossier with shared Country and Region prompt, and see if saved answers are displayed
      And I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Dossier" object "Reprompt Dossier 3 - Prompt on Country, Region, Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked import dossier without waiting for results
      And I verified in dossier prompt "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Mid-Atlantic" is a selected answer for "2. Select Region" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Visualization 1"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed all notifications
     Then I verified that number of worksheets is 2

    # Go to settings and toggle Reuse Prompt Answers OFF to test flag off workflow
      And I open Settings in Dots Menu
      And I check the Reuse Prompt Answers setting is ON
      And I toggle the Reuse Prompt Answers setting
      And I check the Reuse Prompt Answers setting is OFF
      And I click back button in Settings

    # Import second dossier with shared Country and Region prompt, and confirm default answers are displayed
      And I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Dossier" object "Reprompt Dossier 3 - Prompt on Country, Region, Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked import dossier without waiting for results
      And I verified in dossier prompt "Canada" is a available answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Spain" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Northeast" is a available answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Northwest" is a available answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Mid-Atlantic" is a available answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "South" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Web" is a selected answer for "2. Select Region" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Visualization 1"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed all notifications
     Then I verified that number of worksheets is 3

      And I logged out
