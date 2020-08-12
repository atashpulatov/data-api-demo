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
      #     TODO And I ensure that Columns & Filters Selection have proper UI
     And I clicked attribute "Month"
     And I clicked metric "Profit"
      #     TODO And I selected filter {} with elements {}
     And I clicked Import button in Columns and Filters Selection

    Then I closed last notification

    When I clicked Edit object 1
     And I clicked Run button
     And I ensure that Columns & Filters Selection is visible
      #     TODO And I ensure that Columns & Filters Selection have proper UI
      #     TODO And I ensure that attributes {} metrics {} and filters {} are selected
     And I clicked Import button in Columns and Filters Selection

    Then I closed last notification

    Given I selected cell "H1"
      And I clicked Add Data button
     When I found object by ID "ABC9ACA2496777EE3FB81BA08A3CF9AD" and selected "Report with nested prompt"
      And I clicked Prepare Data button
      #      TODO And answer prompt
#      And I waited for Run button to be enabled
      And I clicked Run button
      #      TODO And I ensure Run button is disabled after click
#      And I waited for Run button to be enabled
      And I clicked Run button
      #      TODO And I ensure Run button is disabled after click
      And I selected all attributes
      And I selected all metrics
      #      TODO And I selected filter "Region" with all elements
      #     TODO And I selected filter {} with elements {}
      Then I clicked Import button in Columns and Filters Selection

      When I clicked Edit object 1
       And I clicked Run button
       And I ensure that Columns & Filters Selection is visible
       #       TODO When I closed the plugin
       #       TODO And I open the plugin
       And I clicked Edit object 1
      Then I clicked Run button
       #     TODO And I ensure that Columns & Filters Selection have proper UI
       #     TODO And I ensure that attributes {} metrics {} and filters {} are selected
