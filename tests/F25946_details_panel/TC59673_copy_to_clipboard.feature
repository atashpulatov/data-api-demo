@mac_chrome
Feature: F25932 - Details panel

  Scenario: [TC59673] Copy to clipboard
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found object "CategorySubCategoryQuarter"

     When I expanded details for object number 1
     Then I verify copying the details to clipboard works correctly

      And I close the Import Data popup
      And I log out
