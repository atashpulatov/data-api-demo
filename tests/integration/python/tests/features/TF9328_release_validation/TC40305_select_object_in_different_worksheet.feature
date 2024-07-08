Feature: TF9328 - Release Validation

  Scenario: [TC40305] - Selecting objects imported to the different worksheets and to adjacent columns/rows
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      

     When I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed all notifications
     Then I verified that number of worksheets is 1
      And I verified that cells ["A2", "D2"] have values ["Albania", "385383069"]
      And I verified that object number 1 is called "100_report"

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed all notifications
     Then I verified that number of worksheets is 2
      And I verified that cells ["A2", "D2"] have values ["Central", "$847,227"]
      And I verified that object number 1 is called "01 Basic Report"

     When I clicked on object 2
#   #TODO can't verify for columns out of the screen
     Then I verified that columns ["A", "E"] are selected

     When I clicked on object 1
     Then I verified that columns ["A", "F"] are selected

     When I double clicked on the name of object 1
#   #TODO pick_color method doesn't seem to be working on browser; needs investigation
#     Then after double clicking I verified name of object 1 is highlighted with color "#1890ff"
      And I selected cell "A1"

     When I hovered over the name of object 1
#   #TODO pick_color method doesn't seem to be working on browser; needs investigation
#     Then I verified name of object 1 is highlighted with color "#ebebeb"

     When I selected worksheet number 1
      And I hid columns ["C", "D"]
      And I hid rows ["4", "5", "6"]
      And I resized column "B" to width "30" default units
      And I clicked Refresh on object 2
     Then I verified columns ["C", "D"] are hidden
      And I verified rows ["4", "5", "6"] are hidden
      And I verified column "B" has width "30.00" default units

      And I logged out
