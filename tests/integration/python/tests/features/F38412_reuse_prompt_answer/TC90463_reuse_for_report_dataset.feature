@reprompt
Feature: F38412 - Re-use prompt answers across multiple prompts when importing content via the MicroStrategy add-in for Excel

  Scenario: [TC90463] - Reuse Prompt Answers for Reports/Datasets
    Given I initialized Excel

     When I logged in as default user

    # Check 'Reuse Prompt Answers' settings and toggle to ON
     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is OFF
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is ON
     When I click back button in Settings

    # Import first report with modified answer to Country prompt to update saved answers
     When I clicked Import Data button
      And I click on Library icon
      And I switched to Content Discovery
      And I verified that Import button is disabled
      And I verified that Prepare Data button is disabled
      And I switched to project "MicroStrategy Tutorial"
      And I clicked on folder "Shared Reports"
      And I clicked on folder "_Automation"
      And I clicked on folder "Reprompt"
      And I found and clicked "Report" object "Reprompt Report 1 - Prompt on Country" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I selected "Canada" as an answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications
     Then I verified that number of worksheets is 1

    # Import different report with shared Country prompt, and see if saved answers are displayed
      And I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt Report 2 - Prompt on Country, Region" in "Content Discovery"
      And I verified that Import button is enabled
      And I clicked Import button without checking results
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications
      And I verified that number of worksheets is 2

    # Go to settings and toggle Reuse Prompt Answers OFF to test flag off workflow
      And I open Settings in Dots Menu
      And I check the Reuse Prompt Answers setting is ON
      And I toggle the Reuse Prompt Answers setting
      And I check the Reuse Prompt Answers setting is OFF
      And I click back button in Settings

    # Import second report with shared Country prompt, and confirm default answers are displayed
      And I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt Report 2 - Prompt on Country, Region" in "Content Discovery"
      And I verified that Import button is enabled
      And I clicked Import button without checking results
      And I verified "Web" is a available answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications
      And I verified that number of worksheets is 3

      And I logged out
