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

    #   And I found object "CategorySubCategoryQuarter"

    #  When I displayed details for object number 1
    #  Then I verify copying the details to clipboard works correctly

    #   And I close Import Data popup
    #   And I log out
