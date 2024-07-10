Feature: F25933 - Range taken

  Scenario: [TC59983] - Refresh all objects
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "100_report"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "Category Performance Dataset"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I selected cell "AF1"
      And I clicked Add Data button
      And I found and selected object "100_report"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I removed 4 columns starting from column "AP"
      And I selected cell "AQ1"
      And I clicked Add Data button
      And I found and selected object "100_report"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I refreshed all objects
      And I selected Active Cell option in Range Taken popup
      And I selected cell "BF1"
      And I clicked OK button in Range Taken popup
      And I closed all notifications

     Then I verified that number of worksheets is 1

      And I logged out
