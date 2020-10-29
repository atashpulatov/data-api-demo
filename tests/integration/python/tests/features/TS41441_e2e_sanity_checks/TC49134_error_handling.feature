@windows_desktop
@mac_chrome
@release_validation
@ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC49134] - Error Handling
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     #TODO Expire user session

      And I found object by ID "E6B64AE611E95F872F800080EFD500F4" and selected "1,5M Sales Records.csv"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1048576"
      And I clicked Import Data button
      And I found object by ID "EFCDDD0840F3619E9E82E8B828757EB4" and selected "Report accessing XML file"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "XFD1"
      And I clicked Import Data button
      And I found object by ID "EFCDDD0840F3619E9E82E8B828757EB4" and selected "Report accessing XML file"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found object by ID "EBCFFAEB11EAB071DD120080EF75E940" and selected "110k Sales Records.csv"
     Then I clicked Import button and saw error "This object exceeds the MicroStrategy project row limit. Please contact your administrator."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found object by ID "B570032611E94B25B9810080EF95B252" and selected "Report with All data filtered out"
     Then I clicked Import button and saw error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found object by ID "2F7CF95011E95F8834230080EF25A2F9" and selected "Not Published Dataset.xlsx"
      And I hover over Import button
     Then I verified that tooltip for Import button shows message "You cannot import an unpublished cube."

# TODO Waiting for fix for defect xxxxxxxx
     When I cleared search box
#      And I found object by ID "D796E92211EA434C28680080EF753F73" and selected "Report unpublished cube"
#     Then I clicked Import button and saw errors "You cannot import an unpublished cube."

#     When I selected cell "A1"
#      And I clicked Import Data button
      And I found object by ID "6A626B0C11E94AF4A45E0080EF95FFD5" and selected "Report with Page by, Advanced Sorting, Thresholds, Outline, Banding, Merge cells & Multiform attributes"
      And I clicked Import button
     Then I closed all notifications

     When I clicked Add Data button
      And I found object by ID "EFCDDD0840F3619E9E82E8B828757EB4" and selected "Report accessing XML file"
      And I clicked Import button without checking results
     Then I clicked Cancel button in Range Taken popup

     When I selected cell "H1"
      And I clicked Add Data button
      And I found object by ID "BA32708211E94AF4A45E0080EF557FD5" and selected "Report with Totals and Subtotals"
      And I clicked Import button
     Then I closed all notifications

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "A6E8885611E99CC31A6E0080EFF50C15" and selected "Report with crosstab 123"
      And I clicked Import button
     Then I closed all notifications

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "8C5FA36E11E960ED26F00080EF256F5C" and selected "Number Formatting"
      And I clicked Import button
      And I closed all notifications
     Then cell "B2" should have value "$4,560.00"

     When I clicked table design tab
     Then I clicked green table style

     When I clicked home tab
      And I selected cell "B4"
      And I clicked percentage button
     Then cell "B4" should have value "890700%"

     When I selected cell "C4"
      And I clicked comma style button
     Then cell "C4" should have value "2.46"

     When I selected cell "B2"
      And I clicked align middle button

      And I selected cell "C2"
      And I clicked align left button

      And I selected cell "D2"
      And I clicked bold button

   # TODO select a specific color and later verify it if it's ok, check for desktop platforms
      And I selected cell "E2"
      And I clicked font color button

   # TODO select a specific color and later verify it if it's ok, check for desktop platforms
      And I selected cell "G2"
      And I clicked fill color button

      And I changed cell "G2" font name to "Arial Black"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then cell "L4" should have value "245,677 PLN"
      And for cell "B2" align middle button should be selected
      And for cell "C2" align left button should be selected
      And for cell "D2" bold button should be selected
      And for cell "G2" font name should be "Arial Black"
      And cell "B4" should have value "$8,907.00"
      And cell "B2" should have value "$4,560.00"
      And cell "C4" should have value "245.90%"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "778ECA4C11E990F800000080EFA56C55" and selected "Revenue by Region and Category - secure data"
      And I clicked Import button
      And I closed all notifications
     Then cell "C3" should have value "$3,506,062"

     When I clicked clear data
      And I logged out
      And I logged in with username "Martyna" and empty password
      And I clicked view data
   #TODO Create step for accepting error for specific object
      And I closed all warning notifications
      And I closed all warning notifications
      And I closed all warning notifications
      And I closed all warning notifications
     Then cells ["A2", "C3"] should have values ["", ""]

      And I logged out
