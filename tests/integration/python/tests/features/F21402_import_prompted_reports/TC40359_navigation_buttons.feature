Feature: F21402 - Support for prompted reports while importing data for Excel add-in

  Scenario: [TC40359] - Navigation while importing prompted reports (Run, Back and Cancel buttons)
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found object "Report with prompt - Object prompt | Required | Default answer"
      And I opened All objects list
      And I selected first found object from the objects list
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
     Then I clicked Back button

    Given I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I unselected "Subcategory" as an answer for "1. Objects" prompt - object prompt
     When I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I selected filters { "Category": ["Electronics", "Books"] }
     Then I clicked Back button

    Given I clicked Import button without checking results
     Then I clicked Cancel button

      And I logged out
