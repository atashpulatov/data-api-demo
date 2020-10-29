@windows_desktop
@windows_chrome
@mac_chrome
@release_validation
Feature: F22954 - Ability to edit data already imported to the workbook

  Scenario: [TC62676] Editing prompted reports functionality while report contains nested \
            prompts imported without Prepare Data
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
     When I found object by ID "ABC9ACA2496777EE3FB81BA08A3CF9AD" and selected "Report with nested prompt"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I clicked Run button

     Then I closed last notification

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I clicked attribute "Region"
      And I clicked metric "Revenue"
      And I selected filters { "Region": ["Central", "South"] }
      And I clicked Import button in Columns and Filters Selection
      And cells ["C5", "A7", "B7", "C25"] should have values ["$14,215", "2015", "Electronics", ""]

     Then I closed all notifications

      And I logged out
