@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC59978] - Refresh object
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button
      And I closed all notifications
     Then number of worksheets should be 1

     When I removed 3 columns in a row starting with "L" next to "M1"
      And I selected cell "L1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button
      And I closed all notifications
     Then number of worksheets should be 1

    When I clicked Refresh on object 2
     And I clicked OK button in Range Taken popup
     And I waited for object to be refreshed successfully 
     And I closed all notifications

    Then number of worksheets should be 2

    And I log out



