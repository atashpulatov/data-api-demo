@windows_desktop
Feature: TBD

  Scenario: [TC40305] - Selecting objects imported to the different worksheets and to adjacent columns/rows
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications
    Then number of worksheets should be 1

      And I added a new worksheet
      And I clicked Add Data button
      And I ensured that MyLibrary Switch is OFF

      And I found and selected object "01 Basic Report"
      And I clicked Import button
      And I closed all notifications
    Then number of worksheets should be 2

    When I clicked on object 2
      And I hovered over object 1
      And I hovered over the name of object 1
      And I clicked twice on the name of object 1
      And I clicked Refresh on object 1

      And I logged out