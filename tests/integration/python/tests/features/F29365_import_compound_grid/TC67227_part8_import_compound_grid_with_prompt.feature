@ci_pipeline_postmerge_windows_chrome 
Feature: F29365 - Import compound grid from dossier to Excel

  Scenario: [TC67227] - part 8 - Import compound grid visualization with prompt
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Kind of compound grids - with prompt"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed all notifications

     Then I verified that cells ["C2", "A7", "E4"] have values ["Profit", "2014 Q4", "$63,938"]

      And I logged out
