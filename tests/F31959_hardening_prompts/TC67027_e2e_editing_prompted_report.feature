@mac_chrome
Feature: F31959 - Hardening the workflows of importing data with prompts to Excel

  Scenario: [TC67027] - E2E Editing Prompted reports | Nested
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report with a subtotal & prompt"

     When I clicked Prepare Data button
      And I ensure that Columns & Filters Selection is visible

      And I clicked Run button

