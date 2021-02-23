@windows_desktop
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC40305] - Selecting objects imported to the different worksheets and to adjacent columns/rows
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications
     Then number of worksheets should be 1
      And cells ["A2", "D2"] should have values ["Albania", "385383069"]
      And object number 1 should be called "100_report"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "13CFD83A458A68655A13CBA8D7C62CD5" and selected "01 Basic Report"
      And I clicked Import button
      And I closed all notifications
     Then number of worksheets should be 2
      And cells ["A2", "D2"] should have values ["Central", "$847,227"]
      And object number 1 should be called "01 Basic Report"

     When I clicked on object 2
     Then columns ["A", "N"] are selected

     When I clicked on object 1
     Then columns ["A", "F"] are selected

     When I double clicked on the name of object 1
     Then after double clicking I verified name of object 1 is highlighted with color "#1890ff"
      And I selected cell "A1"

     When I hovered over the name of object 1
     Then I verified name of object 1 is highlighted with color "#ebebeb"

     When I selected worksheet number 1
#     # TODO And I hide columns ["C", "D"]
#     # TODO And I hide rows ["4", "5", "6"]
#     # TODO And I resized column "B" to width "30"
      And I clicked Refresh on object 2
#     # TODO Then I verified columns ["C", "D"] are hidden
#     # TODO And I verified rows ["4", "5", "6"] are hidden
#     # TODO And I verified column "B" has width "30"
#
      And I logged out
