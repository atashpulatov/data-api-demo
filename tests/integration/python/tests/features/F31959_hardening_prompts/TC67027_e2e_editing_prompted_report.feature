@mac_chrome
Feature: F31959 - Hardening the workflows of importing data with prompts to Excel

  Scenario: [TC67027] - E2E Editing Prompted reports | Nested
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"

     When I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1" prompt - object prompt
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I clicked attribute "Month"
      And I clicked metric "Profit"
      And I selected filter "Subcategory" and elements "Audio Equipment,TV's"
      And I clicked Import button in Columns and Filters Selection

     Then I closed last notification

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I ensure title "Report with a subtotal & prompt" is correct
      And I ensure there are "1" of "2" metrics selected
      #     TODO And I ensure that attributes {} metrics {} and filters {} are selected
      And I clicked Import button in Columns and Filters Selection

     Then I closed last notification

    Given I selected cell "H1"
      And I clicked Add Data button
     When I found object by ID "BA5C566011EAD58999B90080EF850206" and selected "simple report with nested prompt"
      And I clicked Prepare Data button
      And I selected "Central" as an answer for "1" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      #      TODO And I ensure Run button is disabled after click
      And I waited for Run button to be enabled
      And I selected "Milwaukee" as an answer for "1" prompt - object prompt
      And I clicked Run button
      #      TODO And I ensure Run button is disabled after click
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Country" with all elements
      And I selected filter "Category" and elements "Books,Electronics"
      And I clicked Import button in Columns and Filters Selection

     Then I closed last notification

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
#      And I closed popup window
#      And I clicked close Add-in button
#      And I clicked Add-in icon
#      And I clicked Edit object 1
#     Then I clicked Run button
       And I ensure title "simple report with nested prompt" is correct
       #     TODO And I ensure that attributes {} metrics {} and filters {} are selected


