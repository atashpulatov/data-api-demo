@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67504] - expanding name lists, location
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "3633950911EAA96889F00080EF25F8A4" and selected "titanic_wiblgjlprj"
      And I clicked Import button
      And I closed last notification

      And I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "4BF6385A11EA638B25610080EFC58CB1" and selected "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Region" with all elements
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

      And I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "5902C03A11E9FEF1DC670080EF856919" and selected "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I imported visualization "Visualization 1"
      And I closed last notification

      And I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Show Details"

     When I clicked toggle details button on object 1
     Then object 1 has details panel displayed
      And object 1 has collapsed "Prompt" list displayed
      And object 1 has collapsed "Attribute" list displayed
      And object 1 has collapsed "Metric" list displayed
      And object 1 has id "5902C03A11E9FEF1DC670080EF856919"

     When I hovered over toggle details button on object 2
     Then tooltip text for object 2 toggle details button is "Show Details"

     When I clicked toggle details button on object 2
     Then object 2 has details panel displayed
      And object 2 has collapsed "Prompt" list displayed
      And object 2 has collapsed "Filter" list displayed
      And object 2 has collapsed "Attribute" list displayed
      And object 2 has collapsed "Metric" list displayed
      And object 2 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I hovered over toggle details button on object 3
     Then tooltip text for object 3 toggle details button is "Show Details"

     When I clicked toggle details button on object 3
     Then object 3 has details panel displayed
      And object 3 has collapsed "Attribute" list displayed
      And object 3 has collapsed "Metric" list displayed
      And object 3 is certified
      And object 3 has id "3633950911EAA96889F00080EF25F8A4"

     When I clicked "Filter" list expand button on object 2
      And I clicked "Attribute" list expand button on object 2

     Then object 2 has "Filter" list with value "Region (Central, Mid-Atlantic, Northeast, Northwest, South, Southeast, Southwest, Web)"
      And object 2 has "Attribute" list with value "Call Center‎, Country‎, Distribution Center‎, Employee‎, Region"

     When I clicked "Attribute" list expand button on object 3
      And I clicked "Metric" list expand button on object 3

     Then object 3 has "Attribute" list with value "adult male‎, age‎, alive‎, alone‎, class‎, deck‎, embark town‎, embarked‎, sex‎, who"
      And object 3 has "Metric" list with value "fare‎, parch‎, pclass‎, Row Count - titanic_df‎, sibsp‎, survived"

     When I clicked object location expand button on object 1
     Then object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted dossier" displayed

     When I clicked object location expand button on object 2
     Then object 2 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted report with subtotals" displayed

     When I clicked object location expand button on object 3
     Then object 3 has full location "MicroStrategy Tutorial > Public Objects > Reports > DS Objects > Cubes for Create Testing > testing_folder_wiblgjlprj > titanic_wiblgjlprj" displayed

     When I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Hide Details"

     When I clicked toggle details button on object 1
     Then object 1 has details panel hidden

     When I hovered over toggle details button on object 2
     Then tooltip text for object 2 toggle details button is "Hide Details"

     When I clicked toggle details button on object 2
     Then object 2 has details panel hidden

     When I hovered over toggle details button on object 3
     Then tooltip text for object 3 toggle details button is "Hide Details"

     When I clicked toggle details button on object 3
     Then object 3 has details panel hidden

     When I clicked toggle details button on object 1
     Then object 1 has details panel displayed
      And object 1 has collapsed "Prompt" list displayed
      And object 1 has collapsed "Attribute" list displayed
      And object 1 has collapsed "Metric" list displayed
      And object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And object 1 has collapsed location displayed

     When I clicked toggle details button on object 2
     Then object 2 has details panel displayed
      And object 2 has collapsed "Prompt" list displayed
      And object 2 has collapsed "Filter" list displayed
      And object 2 has collapsed "Attribute" list displayed
      And object 2 has collapsed "Metric" list displayed
      And object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And object 1 has collapsed location displayed

     When I clicked toggle details button on object 3
     Then object 3 has details panel displayed
      And object 3 has collapsed "Attribute" list displayed
      And object 3 has collapsed "Metric" list displayed
      And object 3 is certified
      And object 3 has id "3633950911EAA96889F00080EF25F8A4"
      And object 3 has collapsed location displayed

      And I logged out
