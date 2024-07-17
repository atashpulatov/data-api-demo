Feature: F12909 - Import report

  Scenario: [TC36826] Importing report with all data filtered out
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found object "Report with All data filtered out"
      And I opened All objects list
      And I selected first found object from the objects list
      And I selected import type "Import Data" and clicked import
     Then I saw global error message "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty." and I clicked OK

      And I logged out
