@mac_chrome
Feature: F25968 - Filters numbers

  Scenario: [TC58932] - Deselecting/selecting filters with no objects
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I clicked Filters button
      And I opened owners all panel
      And I selected all within all panel
      And I clicked "Certified" from "Certified Status"
     Then the first empty element in all panel should be selected

     When I clicked first empty element in all panel
     Then the first empty element in all panel should NOT be selected

     When I clicked first empty element in all panel
     Then the first empty element in all panel should NOT be selected
