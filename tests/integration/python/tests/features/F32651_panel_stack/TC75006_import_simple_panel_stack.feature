#@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@release_validation @ga_validation
@windows_desktop @mac_chrome @windows_chrome
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75006] - [ACC] Importing visualisation from simple Panel Stack
   Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "D392B6DF4A4A9A6BD245698AE53FA23C" and selected "Dossier with Panel stacks and different navigation styles"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 2
      And I selected panel stack "Panel 1"
      And I selected Visualization "Grid visualization on a panel stack"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B2", "C2492", "E2492"] have values ["NNE", "17268959.00", "33755965.00"]
      And I logged out
