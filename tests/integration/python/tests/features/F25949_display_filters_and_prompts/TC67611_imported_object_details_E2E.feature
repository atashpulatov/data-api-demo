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

    Given I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button

      And I selected all attributes
      And I selected all metrics
      And I clicked filter number 1
      And I selected all filter elements
      And I clicked filter number 4
      And I selected all filter elements
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

    Given I clicked toggle details button on object 1
      And I clicked filters list expand button on object 1
      And I clicked attributes list expand button on object 1
      And I clicked object location expand button on object 1
      
    Given I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier
      And I imported visualization "Visualization 1"
      And I closed last notification

    Given I clicked toggle details button on object 1
      And I clicked object location expand button on object 1

    Given I selected excel table for object 1

    Given I hovered over toggle details button on object 1
     Then Tooltip text for object 1 toggle details button is Hide Details

    Given I clicked toggle details button on object 1

    Given I clicked Edit object 3
      And I unselected all metrics
      And I clicked metric "survived"
      And I clicked filter number 10
      And I selected all filter elements
      And I clicked Import button in Columns and Filters Selection
      And I closed notification on object 3

    Given I clicked toggle details button on object 3
      And I clicked attributes list expand button on object 3
      And I clicked filters list expand button on object 3
      And I clicked object location expand button on object 3 

    Given I clicked Duplicate on object 2
      And I clicked Import button in Duplicate popup
      And I closed last notification

    Given I clicked toggle details button on object 1
      And I clicked filters list expand button on object 1
      And I clicked attributes list expand button on object 1
      And I clicked object location expand button on object 1

      And I log out
