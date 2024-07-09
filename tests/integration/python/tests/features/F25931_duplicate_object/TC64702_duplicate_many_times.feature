Feature: F25931 - Duplicate object

  Scenario: [TC64702] - Duplicate object
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
      And I verified that number of worksheets is 1

     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed all notifications

     Then I verified that object number 1 is called "100_report Copy"
      And I verified that number of worksheets is 2

     When I clicked Duplicate on object 2
      And I clicked Import button in Duplicate popup
      And I closed all notifications

     Then I verified that object number 1 is called "100_report Copy 2"
      And I verified that number of worksheets is 3

     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed all notifications

     Then I verified that object number 1 is called "100_report Copy 3"
      And I verified that number of worksheets is 4

      And I logged out
