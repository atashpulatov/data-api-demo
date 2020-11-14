#@windows_desktop / step for selecting attribute forms is not working
@windows_chrome
@mac_chrome
#@mac_desktop
@release_validation
Feature: F25932 - Import attribute forms in separate columns

  Scenario: [TC59867] [Attribute forms] Import report using all types of "Display attribute form names"
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "68018D8E11EA89FF2CB10080EF558A97" and selected "report with attribute forms"
      And I clicked Prepare Data button
      And I verified that Columns & Filters Selection is visible

      And I selected all metrics
      And I selected all attributes
      And I clicked attribute "Country"
      And I ensured attribute is selected and I clicked forms { "Country": ["ID"] }

     When I set Display attribute form names to "Off"
      And I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cells ["A1", "B1", "C1", "D1", "E1", "F1" ] should have values ["Region", "Region2", "Country", "Country2", "Category", "Category2"]

     When I clicked Edit object 1
      And I set Display attribute form names to "On"
      And I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cells ["A1", "B1", "C1", "D1", "E1", "F1" ] should have values ["Region DESC", "Region ID", "Country DESC", "Country ID", "Category DESC", "Category ID"]

     When I clicked Edit object 1
      And I set Display attribute form names to "Form name only"
      And I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cells ["A1", "B1", "C1", "D1", "E1", "F1" ] should have values ["DESC", "ID", "DESC2", "ID2", "DESC3", "ID3"]

     When I clicked Edit object 1
      And I set Display attribute form names to "Show attribute name once"
      And I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cells ["A1", "B1", "C1", "D1", "E1", "F1" ] should have values ["Region DESC", "ID", "Country DESC", "ID2", "Category DESC", "ID3"]

     When I clicked Edit object 1
      And I set Display attribute form names to "Automatic"
      And I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cells ["A1", "B1", "C1", "D1", "E1", "F1" ] should have values ["Region DESC", "Region ID", "Country DESC", "Country ID", "Category DESC", "Category ID"]

      And I logged out
