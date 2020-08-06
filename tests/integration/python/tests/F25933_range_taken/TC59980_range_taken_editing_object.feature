@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC59980] - Editing object
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

     When I found and selected object "100_report"
      And I clicked Prepare Data button
      And I ensure that Columns & Filters Selection is visible
      And I clicked attribute "Country"
      And I clicked metric "Total Cost"
      And I clicked Import button in Columns and Filters Selection
      
     Then I closed all notifications

     When I selected cell "C4"
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I clicked Import button

     Then I closed all notifications

     When I clicked Edit object 2
      And I clicked attribute "Region"
      And I clicked Import button in Columns and Filters Selection
      And I selected cell "J1"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup

     Then I closed all notifications

      And I log out