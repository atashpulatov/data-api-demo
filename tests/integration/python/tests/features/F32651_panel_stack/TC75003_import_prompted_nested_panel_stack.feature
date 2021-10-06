#@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@release_validation @ga_validation
@windows_desktop
@mac_chrome
@windows_chrome
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75003] - [Panel Stack] E2E - Importing, Editing, Duplicating, Refreshing, Clear Data for Prompted Dossier with Nested Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "127C5E44B74AB6D61287D189E755694C" and selected "Always Prompted Nested Panel Stack"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected dossier page or chapter 1
      And I selected panel stack "Panel 2" nested in panel stack "Panel 3"
      And I selected Visualization "Nested Panel Visualization 1"

      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification

     Then I verified that cells ["E2", "E18", "E69"] have values ["8330.126", "16321.734", "21180"]

     When I clicked Edit object 1
      And I clicked re-prompt button
      And I selected checkbox for "Electronics" as an answer for "1. Choose from all elements of 'Category'." prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected panel stack "Panel 11"
      And I selected Visualization "Panel 11 Visualization 1"

      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["E2", "E29", "E69"] have values ["5749", "328306.264", "536862.7858"]

     When I selected cell "H1"
      And I clicked Duplicate on object 1
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I clicked re-prompt button
      And I selected checkbox for "Movies" as an answer for "1. Choose from all elements of 'Category'." prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected Visualization "Visualization 1"
      And I clicked import dossier to duplicate
      And I waited for object to be duplicated successfully
      And I closed last notification
     Then I verified that cells ["I2", "I16"] have values ["$933,067", "$3,469,529"]
      And I verified that object number 1 is called "Visualization 1"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["I2", "I16"] have values ["$933,067", "$3,469,529"]

     When I clicked clear data
     Then I verified that cells ["A1", "A2", "H1", "I2"] have values ["Distribution Center", "", "Call Center", ""]
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["E2", "E29", "E69", "I2", "I16"] have values ["5749", "328306.264", "536862.7858", "$933,067", "$3,469,529"]
      And I logged out
