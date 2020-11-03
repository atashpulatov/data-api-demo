@release_validation
Feature: F31959 - Hardening the workflows of importing data with prompts to Excel

  Scenario: [TC62674] - E2E Editing all types of prompted reports, except nested
    Given I pass
    # Given I logged in as default user
    #   And I clicked Import Data button
    #   And I ensured that MyLibrary Switch is OFF
    #   And I found object by ID "CDE36AFC11EA6220B17C0080EF054542" and selected "Report with all type of prompts (except nested)"

    # When I clicked Prepare Data button
    #   And I waited for Run button to be enabled
    #   And I selected "Item" as an answer for "1. Objects" prompt - object prompt
    #   And I selected "Books" as an answer for "3. Category" prompt - object prompt
      And I typed "2014" for "4. Year" prompt - value prompt
# behave --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/features/F31959_hardening_prompts/TC62674_all_prompt_types.feature 2>> log.err.txt