@mac_chrome
Feature: F25968 - Filters numbers

  Scenario: [TC58932] - Deselecting/selecting filters with no objects
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I clicked Filters button
      And I opened All for Owner category
      And I clicked Select All within All Panel
      And I clicked "Certified" from "Certified Status" category
     Then the first element with 0 objects in All Panel should be selected

     When I clicked first element with 0 objects in All Panel
     Then the first element with 0 objects in All Panel should NOT be selected

     When I clicked first element with 0 objects in All Panel
     Then the first element with 0 objects in All Panel should NOT be selected

      And I close Import Data popup
      And I log out
