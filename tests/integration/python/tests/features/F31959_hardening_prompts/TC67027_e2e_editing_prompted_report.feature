@mac_chrome
Feature: F31959 - Hardening the workflows of importing data with prompts to Excel

  Scenario: [TC67027] - E2E Editing Prompted reports | Nested
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"

     When I clicked Prepare Data button
      And I selected {index} prompt from the list


      # TODO And I clicked Run button
