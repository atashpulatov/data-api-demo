@reuse_prompt_answers
Feature: F38412 - Re-use prompt answers across multiple prompts when importing content via the MicroStrategy add-in for Excel

  Scenario: [TC90463] - Reuse Prompt Answers for Reports/Datasets
    Given I initialized Excel

     When I logged in as default user

    #Check 'Reuse Prompt Answers' settings and toggle if necessary
      And I go to Settings page

      And I logged out
