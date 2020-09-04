@windows_chrome
@mac_chrome
@ci
Feature: F31959 - Hardening the workflows of importing data with prompts to Excel

  Scenario: [TC67027] - E2E Editing Prompted reports | Nested
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"

     When I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button

      And I ensure that Columns & Filters Selection is visible
      And I clicked attribute "Month"
      And I clicked metric "Profit"
      And I selected filters { "Subcategory" : ["Audio Equipment", "TV's"] }
      And I clicked Import button in Columns and Filters Selection

     Then I closed last notification

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I ensure popup title is "Report with a subtotal & prompt"
      And I ensure that "1" of "4" metrics are selected
      And I ensure that "1" of "2" attributes are selected
      And I ensure that "1" of "2" filters are selected
      And I clicked Import button in Columns and Filters Selection

     Then I closed last notification

    Given I selected cell "H1"
      And I clicked Add Data button
     When I found object by ID "ABC9ACA2496777EE3FB81BA08A3CF9AD" and selected "Report with nested prompt"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Year" with all elements
      And I selected filters { "Region" : ["Central", "South"] }
      And I clicked Import button in Columns and Filters Selection

     Then I closed last notification

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I closed popup window
      And I clicked close Add-in button
      And I clicked Add-in icon
      And I closed last notification
      And I clicked Edit object 1
      And I waited for Run button to be enabled
     Then I clicked Run button
      And I clicked Run button
      And I ensure popup title is "Report with nested prompt"
      And I ensure that "3" of "3" metrics are selected
      And I ensure that "3" of "3" attributes are selected
      And I ensure that "2" of "3" filters are selected
     Then I clicked Cancel button

      And I log out


