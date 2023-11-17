@reprompt
Feature: F38412 - Re-use prompt answers across multiple prompts when importing content via the MicroStrategy add-in for Excel

  Scenario: [TC90469] - Reprompt Multiple Objects with Remember Answer Setting ON
    Given I initialized Excel

    When I logged in as default user

    # Turn remember answer setting ON
     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is OFF
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is ON
     When I click back button in Settings
     
    # Import Object Reprompt Report 1 - Prompt on Country, default answer is Country = USA, Web
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
     And I waited for Run button to be enabled
     And I clicked Run button
     And I clicked on back button in data import button
     And I found and clicked "Report" object "Reprompt Report 1 - Prompt on Country" in "Content Discovery"
     And I verified that Import button is enabled
     And I verified that Prepare Data button is enabled
     And I clicked Import button without checking results
    # Change remembered answer to Country = USA, Web, Canada
     And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
     And I selected "Canada" as an answer for "1. Country" prompt - object prompt
     And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
     And I waited for Run button to be enabled
     And I clicked Run button
     And I waited for object to be imported successfully
     And I closed all notifications

    # Import object Reprompt Report 2 - Prompt on Country, Region, default answers are Country = USA; Region = NE, NW
      Then I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt Report 2 - Prompt on Country, Region" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      Then I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      #Change remembered answer to Country = USA, Canada; Region = NE, NW, South
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I unselected "Web" as an answer for "1. Country" prompt - object prompt
      And I verified "Web" is a available answer for "1. Country" prompt - object prompt
      And I verified "South" is a available answer for "2. Select Region" prompt - object prompt
      And I selected "South" as an answer for "2. Select Region" prompt - object prompt
      And I verified "South" is a selected answer for "2. Select Region" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed all notifications

    # Import object 3, Reprompt Report 3 - Prompt on Country, Region, Category
      Then I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Report" object "Reprompt Report 3 - Prompt on Country, Region, Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is enabled
      And I clicked Import button without checking results
      Then I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "South" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "Books" is a selected answer for "3. Category" prompt - object prompt
      And I verified "Movies" is a available answer for "3. Category" prompt - object prompt
      And I selected "Movies" as an answer for "3. Category" prompt - object prompt
      And I verified "Movies" is a selected answer for "3. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed all notifications

    # Import object 4, Reprompt Dossier 3 - Prompt on Country, Region, Category
      And I clicked Add Data button
      And I switched to Content Discovery
      And I found and clicked "Dossier" object "Reprompt Dossier 3 - Prompt on Country, Region, Category" in "Content Discovery"
      And I verified that Import button is enabled
      And I verified that Prepare Data button is disabled
      And I clicked import dossier without waiting for results
      Then I verified in dossier prompt "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt  "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt  "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt  "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt  "South" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt  "Books" is a selected answer for "3. Category" prompt - object prompt
      And I verified in dossier prompt  "Movies" is a selected answer for "3. Category" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Visualization 1"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed all notifications

     # Reprompt all objects 1/4
      And I waited for dossier to load successfully
      Then I verified Prompt Dialog has title "Reprompt 1 of 4 > Reprompt Dossier 3 - Prompt on Country, Region, Category"
      Then I verified in dossier prompt "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified in dossier prompt "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "South" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified in dossier prompt "Books" is a selected answer for "3. Category" prompt - object prompt
      And I verified in dossier prompt "Movies" is a selected answer for "3. Category" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Visualization 1"
      And I clicked import dossier without waiting for results
      And I closed all notifications

      # Reprompt all objects 2/4
      And I waited for Prompt Dialog to be loaded
      Then I verified Prompt Dialog has title "Reprompt 2 of 4 > Reprompt Report 3 - Prompt on Country, Region, Category"
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Northeast" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "South" is a selected answer for "2. Select Region" prompt - object prompt 
      And I verified "Movies" is a selected answer for "3. Category" prompt - object prompt
      And I verified "Music" is a available answer for "3. Category" prompt - object prompt
      And I unselected "Canada" as an answer for "1. Country" prompt - object prompt
      And I unselected "Northeast" as an answer for "2. Select Region" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

    # Reprompt all objects 3/4
      And I waited for Prompt Dialog to be loaded
      And I verified Prompt Dialog has title "Reprompt 3 of 4 > Reprompt Report 2 - Prompt on Country, Region"
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I verified "Northeast" is a available answer for "2. Select Region" prompt - object prompt
      And I verified "Northwest" is a selected answer for "2. Select Region" prompt - object prompt
      And I verified "South" is a selected answer for "2. Select Region" prompt - object prompt
      And I selected "England" as an answer for "1. Country" prompt - object prompt
      And I selected "Web" as an answer for "2. Select Region" prompt - object prompt
      And I verified "England" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "2. Select Region" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

    # Reprompt all objects 4/4
      And I waited for Prompt Dialog to be loaded
      And I verified Prompt Dialog has title "Reprompt 4 of 4 > Reprompt Report 1 - Prompt on Country"
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "England" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I verified "Web" is a available answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

     When I open Settings in Dots Menu
     Then I check the Reuse Prompt Answers setting is ON
     When I toggle the Reuse Prompt Answers setting
     Then I check the Reuse Prompt Answers setting is OFF
     When I click back button in Settings

      And I logged out
