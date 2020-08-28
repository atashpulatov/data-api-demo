@mac_chrome
Feature: F25946 - Display filters and prompts

  Scenario: [TC67486] - Imported objects details showing, hiding and updating
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      
    #   And I found and selected object "Prompted report with subtotals"
    #   And I clicked Prepare Data button
    #   And I waited for Run button to be enabled
    #   And I clicked Run button
    #   And I ensure that Columns & Filters Selection is visible
    #   And I selected all attributes
    #   And I selected all metrics
    #   And I clicked Import button in Columns and Filters Selection
    #   And I closed last notification

    # Given I added a new worksheet
    #   And I clicked Add Data button
    #   And MyLibrary Switch is OFF
      
      And I found and selected object "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
      And I hovered over toggle details button on object 1
      Then Tooltip text for object 1 toggle details button is "Show Details"

    Given I clicked toggle details button on object 1
      And Object 1 has prompts list displayed
      And Object 1 has attributes list displayed
      And Object 1 has "ATTRIBUTES_LIST" with value "Quarter‎, Distribution Center"
      And Object 1 has metrics list displayed
      And Object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And Object 1 has owner Administrator

    Given I selected excel table for object 1
      # TODO: Should check if object is highlighted

    Given I hovered over toggle details button on object 1
     Then Tooltip text for object 1 toggle details button is "Hide Details"

    Given I clicked toggle details button on object 1
     # TODO: Then Object number 1 has actions visible



    # Given I hovered over toggle details button on object 1
    #  Then Tooltip text for object 1 toggle details button is Show Details

    # Given I clicked toggle details button on object 1
    #   And I clicked attributes list expand button on object 1
    #   And I clicked metrics list expand button on object 1
    #   And I clicked object location expand button on object 1

    # Given I added a new worksheet
    #   And I clicked Add Data button
    #   And I found and selected object "Prompted report with subtotals"
    #   And I clicked Prepare Data button
    #   And I waited for Run button to be enabled
    #   And I clicked Run button

    #   And I selected all attributes
    #   And I selected all metrics
    #   And I selected filter "Call Center" with all elements
    #   And I selected filter "Employee" with all elements
    #   And I clicked Import button in Columns and Filters Selection
    #   And I closed last notification

    # Given I clicked toggle details button on object 1
    #   And I clicked filters list expand button on object 1
    #   And I clicked attributes list expand button on object 1
    #   And I clicked object location expand button on object 1
      
    # Given I added a new worksheet
    #   And I clicked Add Data button
    #   And I found and selected object "Prompted dossier"
    #   And I clicked Import button to open Import Dossier
    #   And I clicked Run button for prompted dossier
    #   And I imported visualization "Visualization 1"
    #   And I closed last notification

    # Given I clicked toggle details button on object 1
    #   And I clicked object location expand button on object 1

    # Given I selected excel table for object 1

    # Given I hovered over toggle details button on object 1
    #  Then Tooltip text for object 1 toggle details button is Hide Details

    # Given I clicked toggle details button on object 1

    # Given I clicked Edit object 3
    #   And I unselected all metrics
    #   And I clicked metric "survived"
    #   And I selected filter "age" with all elements
    #   And I clicked Import button in Columns and Filters Selection
    #   And I closed notification on object 3

    # Given I clicked toggle details button on object 3
    #   And I clicked attributes list expand button on object 3
    #   And I clicked filters list expand button on object 3
    #   And I clicked object location expand button on object 3 

    # Given I clicked Duplicate on object 2
    #   And I clicked Import button in Duplicate popup
    #   And I closed last notification

    # Given I clicked toggle details button on object 1
    #   And I clicked filters list expand button on object 1
    #   And I clicked attributes list expand button on object 1
    #   And I clicked object location expand button on object 1

    # Given I refreshed all objects
    #   And I waited for all progress notifications to disappear
    #   And I closed all notifications

      And I log out
