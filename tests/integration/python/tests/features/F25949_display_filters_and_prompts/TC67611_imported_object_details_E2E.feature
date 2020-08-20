@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67611] - Imported object details E2E
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      
      And I found and selected object "titanic_wiblgjlprj"
      And I clicked Prepare Data button
      And I ensure that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

    Given I hovered over toggle details button on object 1
     Then Tooltip text for object 1 toggle details button is Show Details

    Given I clicked toggle details button on object 1
      And I clicked attributes list expand button on object 1
      And I clicked metrics list expand button on object 1
      And I clicked object location expand button on object 1

      And I log out
