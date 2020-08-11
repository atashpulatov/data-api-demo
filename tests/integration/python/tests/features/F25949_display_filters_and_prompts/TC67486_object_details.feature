@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67486] - Imported objects details showing,  hiding and updating
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "Prompted report with subtotals"
      And I clicked Prepare Data button

      And I clicked Run button

      And I ensure that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

    #   And I clicked Filters button
    #   And I opened All for Owner category
    #   And I clicked Select All within All Panel
    #   And I clicked "Certified" from "Certified Status" category
    #  Then the first element with 0 objects in All Panel should be selected

    #  When I clicked first element with 0 objects in All Panel
    #  Then the first element with 0 objects in All Panel should NOT be selected

    #  When I clicked first element with 0 objects in All Panel
    #  Then the first element with 0 objects in All Panel should NOT be selected

    #   And I close Import Data popup
    #   And I log out
