@windows_desktop
@windows_chrome
@mac_chrome
@mac_desktop
Feature: F25932 - Import attribute forms in separate columns

  Scenario: [TC59987] [Attribute forms] Edit an imported report
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "5881BE8D41D8E8BED284FBB403DD51BD" and selected "06 Sort by Revenue Rank - Month Report Filter"
      And I clicked Prepare Data button
      And I verified that Columns & Filters Selection is visible

      And I selected all metrics
      And I ensured attribute is selected and I clicked forms { "Region": ["ID"] }
      And I set Display attribute form names to "On"

     When I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cells ["A4", "B3"] should have values ["Northeast", "2"]

    Given I clicked Edit object 1
      And I clicked attribute "Region"
      And I ensured attribute is selected and I clicked forms { "Employee": ["Last Name", "ID"] }
      And I set Display attribute form names to "Show attribute name once"
     When I clicked Import button in Columns and Filters Selection
      And I closed all notifications
     Then cell "A4" should have value "Laura"

      And I logged out
