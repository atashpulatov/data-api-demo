@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67504] - expanding name lists, location
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      
    Given I found object by ID "3633950911EAA96889F00080EF25F8A4" and selected "titanic_wiblgjlprj"
      And I clicked Import button
      And I closed last notification     

    Given I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "4BF6385A11EA638B25610080EFC58CB1" and selected "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Call Center" with all elements
      And I selected filter "Employee" with all elements
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
      
    Given I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "5902C03A11E9FEF1DC670080EF856919" and selected "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier
      And I imported visualization "Visualization 1"
      And I closed last notification

     When I hovered over toggle details button on object 1
     Then Tooltip text for object 1 toggle details button is "Show Details"

     When I clicked toggle details button on object 1
     Then Object 1 has details panel displayed
      And Object 1 has "PROMPT" list displayed
      And Object 1 has "ATTRIBUTE" list displayed
      And Object 1 has "METRIC" list displayed
      And Object 1 has id "5902C03A11E9FEF1DC670080EF856919"

     When I hovered over toggle details button on object 2
     Then Tooltip text for object 2 toggle details button is "Show Details"

     When I clicked toggle details button on object 2
     Then Object 2 has "PROMPT" list displayed
      And Object 2 has "FILTER" list displayed
      And Object 2 has "ATTRIBUTE" list displayed
      And Object 2 has "METRIC" list displayed
      And Object 2 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I hovered over toggle details button on object 3
     Then Tooltip text for object 3 toggle details button is "Show Details"

     When I clicked toggle details button on object 3
     Then Object 3 has "ATTRIBUTE" list displayed
      And Object 3 has "METRIC" list displayed
      And Object 3 is certified
      And Object 3 has id "3633950911EAA96889F00080EF25F8A4"

    Given I clicked "FILTER" list expand button on object 2
      And I clicked "ATTRIBUTE" list expand button on object 2

    Given I clicked "ATTRIBUTE" list expand button on object 3
      And I clicked "METRIC" list expand button on object 3

    Given I clicked object location expand button on object 1
      And I clicked object location expand button on object 2
      And I clicked object location expand button on object 3

     When I hovered over toggle details button on object 1
     Then Tooltip text for object 1 toggle details button is "Hide Details"

     When I clicked toggle details button on object 1

     When I hovered over toggle details button on object 2
     Then Tooltip text for object 2 toggle details button is "Hide Details"

     When I clicked toggle details button on object 2

     When I hovered over toggle details button on object 3
     Then Tooltip text for object 3 toggle details button is "Hide Details"

     When I clicked toggle details button on object 3
    

      And I log out
