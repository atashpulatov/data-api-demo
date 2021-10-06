#@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@release_validation @ga_validation
@windows_desktop
@mac_chrome
@windows_chrome
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75006] - [ACC] Importing visualisation from simple Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "6E803B546A48D2CC225C02A2FE0E9782" and selected "Multiple Pages with Panel Stack"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 1
      And I selected panel stack "Panel 3"
      And I selected Visualization "Panel 3 Visualization 1"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B2", "C16"] have values ["17.622", "$3,902,762"]
      And I logged out
