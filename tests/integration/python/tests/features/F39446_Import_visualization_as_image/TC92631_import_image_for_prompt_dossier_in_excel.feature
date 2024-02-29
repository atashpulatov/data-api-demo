@image_excel
Feature: F39446 - Ability to import visualization as image in Excel
    
    Scenario: [TC92631] - Import image for prompt visualization dossier in Excel plugin
        Given I initialized Excel
        When I logged in as default user

        When I clicked Import Data button
        And I click on Library icon
        And I switched to Content Discovery
        And I verified that Import button is disabled
        And I verified that Prepare Data button is disabled
        And I switched to project "MicroStrategy Tutorial"
        And I clicked on folder "Shared Reports"
        And I clicked on folder "_Automation"
        And I clicked on folder "Reprompt"
        And I found and clicked "Dossier" object "Prompted dossier" in "Content Discovery"
        And I verified that Import button is enabled
        And I verified that Prepare Data button is disabled
        And I clicked import dossier without waiting for results

        And I clicked Run button for prompted dossier if prompts not already answered
        And I selected Visualization "Visualization 1"
        And I verified that Import button is enabled
        And I verified that Import image button is enabled
        And I clicked Import image button without checking results
        Then I verified excel sheet has a image inserted
        When I clicked Reprompt on object 1
        And I waited for Prompt Dialog is ready

        And I clicked Run button for prompted dossier if prompts not already answered
        Then I verified excel sheet has a image inserted
        Then I verified excel sheet has total 1 images
        And I clicked Add Data button
        And I switched to Content Discovery
        And I found and clicked "Dossier" object "Prompted dossier" in "Content Discovery"
        And I verified that Import button is enabled
        And I verified that Prepare Data button is disabled
        And I clicked import dossier without waiting for results

        And I clicked Run button for prompted dossier if prompts not already answered
        And I selected Visualization "Visualization 1"
        And I verified that Import button is enabled
        And I verified that Import image button is enabled
        And I clicked Import image button without checking results
        Then I verified excel sheet has a image inserted
        Then I verified excel sheet has total 2 images

        # Refresh all

        And I clicked select all checkbox
        And I clicked Refresh button for select all
        Then I verified excel sheet has total 2 images

        # Reprompt all
        And I clicked select all checkbox
        Then I clicked Reprompt button for select all
        And I waited for Prompt Dialog is ready
        And I clicked Run button for prompted dossier if prompts not already answered
        And I waited for Prompt Dialog is ready
        And I clicked Run button for prompted dossier if prompts not already answered

        Then I verified excel sheet has total 2 images