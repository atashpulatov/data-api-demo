@reprompt
Feature: F38417 - Ability to navigate the folder structure when importing content in the MicroStrategy add-in for Excel 

  Scenario: [TC90465] - Reprompt Sinlge Object
    Given I initialized Excel

    When I logged in as default user

    #Test with remember answer setting is ON
     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is OFF
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is ON
     When I click back button in Settings
     
    #Import Object 1, Category = Movies
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
     And I waited for Run button to be enabled
     And I clicked Run button
     #Add temporary logic due to DE280291
     And I clicked on back button in data import button
     And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
     And I verified that Import button is enabled
     And I verified that Prepare Data button is enabled
     And I clicked Import button without checking results
    #Change remembered answer to Movies
     And I unselected "Music" as an answer for "1. Category" prompt - object prompt
     And I verified "Music" is a available answer for "1. Category" prompt - object prompt
     And I waited for Run button to be enabled
     And I clicked Run button
     And I closed all notifications

    #Import object 2, Category = Movies, Music, Books
      Then I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      Then I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      #Change remembered answer to Movies, Music Books
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications

    #Import object 3, Category = Movies, Music, Books, Electronics
      Then I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt - Prompt on Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a selected answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I closed all notifications

     #Reprompt on single object
      When I clicked Reprompt on object 3
      And I waited for Prompt Dialog to be loaded
      And I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Music" is a available answer for "1. Category" prompt - object prompt
      And I verified "Books" is a available answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

    #Reprompt on single object
      When I clicked Reprompt on object 2
      And I waited for Prompt Dialog to be loaded
      And I verified "Music" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Books" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a available answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

    #Reprompt on single object
      When I clicked Reprompt on object 1
      And I waited for Prompt Dialog to be loaded
      And I verified "Music" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Movies" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Books" is a selected answer for "1. Category" prompt - object prompt
      And I verified "Electronics" is a selected answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is ON
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is OFF
     When I click back button in Settings

      And I logged out
