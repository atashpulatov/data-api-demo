@windows_desktop
@windows_chrome
@mac_desktop
@mac_chrome
@ci
Feature: F25931 - Duplicate object

  Scenario: [TC64624] - Duplicate with edit
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications
      And number of worksheets should be 1

     When I clicked Duplicate on object 1
      And I clicked Edit button in Duplicate popup

      And I unselected all attributes
      And I unselected all metrics

      And I clicked attribute "Country"
      And I clicked metric "Total Cost"

     When I clicked Import button in Columns and Filters Selection to duplicate object
      And I closed last notification

     Then I verified that object number 1 is called "100_report Copy"
      And number of worksheets should be 2

      And I verified that cell "B77" has value "398042.4"
      And I verified that cells ["C77", "A78", "B78", "C78"] have values ["", "", "", ""]

      And I logged out
