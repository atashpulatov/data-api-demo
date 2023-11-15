@reprompt
Feature: F38417 - Ability to navigate the folder structure when importing content in the MicroStrategy add-in for Excel 

  Scenario: [TC90462] - Reuse Prompt Answer Setting
    Given I initialized Excel

    When I logged in as default user

    #Check default setting
    When I open Settings in Dots Menu
    Then I check the Reuse Prompt Answers setting is OFF
    When I toggle the Reuse Prompt Answers setting
    Then I check the Reuse Prompt Answers setting is ON
    When I click back button in Settings
     
    #Import object with default prompt answer
    When I clicked Import Data button
    And I click on Library icon
    And I switched to Content Discovery
    And I verified that Import button is disabled
    And I verified that Prepare Data button is disabled
    And I switched to project "MicroStrategy Tutorial"
    And I clicked on folder "Shared Reports"
    And I clicked on folder "_Automation"
    And I clicked on folder "Reprompt"
    And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
    And I verified that Import button is enabled
    And I verified that Prepare Data button is enabled
    And I clicked Import button without checking results
    Then I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
    And I verified "Music" is a selected answer for "1. Category" prompt - object prompt
    And I verified "Books" is a available answer for "1. Category" prompt - object prompt
    And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
    #Change remembered answer to Movies
    And I unselected "Music" as an answer for "1. Category" prompt - object prompt
    And I verified "Music" is a available answer for "1. Category" prompt - object prompt
    And I waited for Run button to be enabled
    And I clicked Run button
    And I closed all notifications
    Then I verified that number of worksheets is 1

    #Import object, should apply remembered answer
      Then I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      Then I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Music" is a available answer for "1. Category" prompt - object prompt
      And I verified "Books" is a available answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
    #Change remembered answer to Movies, Music Books
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I verified "Music" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Books" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications
      Then I verified that number of worksheets is 2

      Then I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      Then I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Music" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Books" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications
      Then I verified that number of worksheets is 3

    #Modify setting and modify remembered answer
     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is ON
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is OFF
     When I click back button in Settings
     Then I clicked Add Data button
      And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      #Check default answer should be Music, Movies
      Then I verified "Music" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Books" is a available answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
      #Change remembered answer to Movies, Electronics
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I unselected "Music" as an answer for "1. Category" prompt - object prompt
      And I verified "Music" is a available answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a selected answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications
      Then I verified that number of worksheets is 4

    #Modify setting to ON to check if rememberer answer applies
     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is OFF
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is ON
     When I click back button in Settings
     Then I clicked Add Data button
      And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      #Check remembered answer Electronics is applied
      Then I verified "Electronics" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Music" is a available answer for "1. Category" prompt - object prompt
      And I verified "Books" is a available answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications
      Then I verified that number of worksheets is 5

     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is ON
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is OFF
     When I click back button in Settings

      And I logged out
