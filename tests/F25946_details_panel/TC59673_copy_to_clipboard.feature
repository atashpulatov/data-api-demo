@windows_desktop
@windows_chrome
@mac_chrome
Feature: F25932 - Details panel

  Scenario: [TC59673] Copy to cliboard
    Given I logged in as default user
    And I clicked Import Data button
    And MyLibrary Switch is OFF

    And I found object "CategorySubCategoryQuarter"

    Given I expanded object details with index "0"
    Then I verify copying the details works correctly

    And I log out
