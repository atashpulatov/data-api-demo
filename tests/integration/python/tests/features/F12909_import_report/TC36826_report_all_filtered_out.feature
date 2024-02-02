Feature: F12909 - Import report

  Scenario: [TC36826] Importing report with all data filtered out
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found object "Report with All data filtered out"
      And I opened All objects list
      And I selected first found object from the objects list

     Then I clicked Import button and saw error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

      And I logged out
