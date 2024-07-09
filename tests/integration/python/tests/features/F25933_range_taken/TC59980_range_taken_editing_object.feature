Feature: F25933 - Range taken

  Scenario: [TC59980] - Editing object
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button      

     When I found and selected object "100_report"
      And I clicked Prepare Data button
      And I verified that Columns & Filters Selection is visible
      And I clicked attribute "Country"
      And I clicked metric "Total Cost"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import Data button in Columns and Filters Selection

     Then I closed all notifications

     When I selected cell "C4"
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

     Then I closed all notifications

     When I clicked Edit object 2
      And I clicked attribute "Region"
      And I clicked Import Data button in Columns and Filters Selection without success check
      And I selected cell "J1"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup

     Then I closed all notifications

      And I logged out
