#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@disabled_windows_chrome @disabled_mac_chrome
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75003] - [Panel Stack] E2E - Importing, Editing, Duplicating, Refreshing, Clear Data for Prompted Dossier with Nested Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "7D0FFD68AF40D9E9696255B969916F97" and selected "Dossier with nested Panel stacks and different navigation styles"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected dossier page or chapter 1
      And I selected panel stack "Panel 1" nested in panel stack "Panel 3"
      And I selected panel stack "Panel 2" nested in panel stack "Panel 3"
      And I selected Visualization "Nested panel 2 in Panel 3"

      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification

     Then I verified that cells ["D2", "C3", "A7"] have values ["110012.267", "Business", "Books"]

     When I clicked Edit object 1
      And I clicked re-prompt button
      And I selected in dossier prompt "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected panel stack "Panel 2"
      And I selected Visualization "Bar graph on a panel stack"

      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["A5", "B5", "A58"] have values ["AR", "22198610.23", ""]

     When I selected cell "H1"
      And I clicked Duplicate on object 1
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I clicked re-prompt button
      And I selected in dossier prompt "Movies" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Bar graph on a panel stack"
      And I clicked import dossier to duplicate
      And I waited for object to be duplicated successfully
      And I closed last notification
     Then I verified that cells ["I2", "I16"] have values ["6619360.75", "7464101.64"]
      And I verified that object number 1 is called "Bar graph on a panel stack Copy"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["I2", "I16"] have values ["6619360.75", "7464101.64"]

     When I clicked clear data
     Then I verified that cells ["A1", "A2", "H1", "I2"] have values ["Candidate State", "", "Candidate State", ""]
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["A5", "B5", "A58", "I2", "I16"] have values ["AR", "22198610.23", "", "6619360.75", "7464101.64"]
      And I logged out
