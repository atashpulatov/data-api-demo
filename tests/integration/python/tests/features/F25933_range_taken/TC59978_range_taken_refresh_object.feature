Feature: F25933 - Range taken

  Scenario: [TC59978] - Refresh object
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      

      And I found and selected object "100_report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I removed 4 columns starting from column "K"
      And I selected cell "L1"
      And I clicked Add Data button
      And I found and selected object "Category Performance Dataset"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I clicked Refresh on object 2
      And I clicked OK button in Range Taken popup
      And I waited for object to be refreshed successfully
      And I closed all notifications

     Then I verified that number of worksheets is 2

      And I logged out
