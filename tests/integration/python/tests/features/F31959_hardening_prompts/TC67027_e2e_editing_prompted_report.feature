@mac_chrome
Feature: F31959 - Hardening the workflows of importing data with prompts to Excel

  Scenario: [TC67027] - E2E Editing Prompted reports | Nested
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"

    When I clicked Prepare Data button
#    TODO And I ensure Run button is disabled before loading prompted window
     And I selected "Electronics" as an answer for "1" prompt
     And I clicked Run button
     And I ensure that Columns & Filters Selection is visible
     And I clicked attribute "Month"
     And I clicked metric "Profit"
#     And I selected filter "
     And I clicked Import button in Columns and Filters Selection

    Then I closed last notification
