#@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: F29365 - Import compound grid from dossier to Excel

  Scenario: [TC67227] - part 8 - Import compound grid visualization with prompt
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "46B5BD7111EABC6957200080EFB55537" and selected "Kind of compound grids - with prompt"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed all notifications

     Then I verified that cells ["C2", "A7", "E4"] have values ["Profit", "2014 Q4", "$63,938"]

      And I logged out
