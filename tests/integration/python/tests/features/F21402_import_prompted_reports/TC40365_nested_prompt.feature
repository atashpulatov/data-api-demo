@windows_desktop
@windows_chrome
@mac_chrome
Feature: F21402 - Support for prompted reports while importing data for Excel add-in

  Scenario: [TC40365] - Importing prompted reports functionality, for nested prompts without Prepare Data
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
     When I found object by ID "ABC9ACA2496777EE3FB81BA08A3CF9AD" and selected "Report with nested prompt"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
      And I clicked Run button

     Then I closed last notification

      And I logged out
