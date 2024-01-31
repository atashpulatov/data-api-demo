Feature: F25968 - Filters numbers

  Scenario: [TC58932] - Deselecting/selecting filters with no objects
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I clicked Filters button
      And I opened All for Owner category
      And I clicked Select All within All Panel
      And I clicked "Certified" from "Certified Status" category
     Then I verified that the first element with 0 objects in All Panel is selected

     When I clicked first element with 0 objects in All Panel
     Then I verified that the first element with 0 objects in All Panel is NOT selected

     When I clicked first element with 0 objects in All Panel
     Then I verified that the first element with 0 objects in All Panel is NOT selected

      And I closed Import Data popup
      And I logged out
