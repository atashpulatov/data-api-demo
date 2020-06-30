@windows_desktop
@windows_chrome
@mac_chrome
Feature: F25931 - Duplicate object

  Scenario: [TC64624] - Duplicate with edit
    Given I logged in as default user
    And I clicked Import Data button
    And MyLibrary Switch is OFF
    And I found and selected object "100_report"
    And I clicked Import button
    And I closed all notifications
    And number of worksheets should be 1

    When I clicked Duplicate on object 1
    And I clicked Edit button in Duplicate popup

    And I unselected all attributes
    And I unselected all metrics

    And I clicked attribute "Country"
    And I clicked metric "Total Cost"

    When I clicked Import button in Columns and Filters Selection

    Then object number 1 should be called "100_report Copy"
    And number of worksheets should be 2

    And cell "B77" should have value "398042.4"
    And cells ["C77", "A78", "B78", "C78"] should have values ["", "", "", ""]

    And I log out
