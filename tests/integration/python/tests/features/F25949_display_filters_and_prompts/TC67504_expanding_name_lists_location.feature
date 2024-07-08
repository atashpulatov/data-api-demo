Feature: F25949 - Display filters and prompts

  Scenario: [TC67504] - expanding name lists, location
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      

      And I found and selected object "titanic_wiblgjlprj"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed last notification

      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Region" with all elements
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed last notification

      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I imported visualization "Visualization 1"
      And I closed last notification

      And I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Show Details"

     When I clicked toggle details button on object 1
     Then I verified that object 1 has details panel displayed
      And I verified that object 1 has collapsed "Prompt" list displayed
      And I verified that object 1 has collapsed "Attribute" list displayed
      And I verified that object 1 has collapsed "Metric" list displayed
      And I verified that object 1 has id "5902C03A11E9FEF1DC670080EF856919"

     When I hovered over toggle details button on object 2
     Then tooltip text for object 2 toggle details button is "Show Details"

     When I clicked toggle details button on object 2
     Then I verified that object 2 has details panel displayed
      And I verified that object 2 has collapsed "Prompt" list displayed
      And I verified that object 2 has collapsed "Filter" list displayed
      And I verified that object 2 has collapsed "Attribute" list displayed
      And I verified that object 2 has collapsed "Metric" list displayed
      And I verified that object 2 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I hovered over toggle details button on object 3
     Then tooltip text for object 3 toggle details button is "Show Details"

     When I clicked toggle details button on object 3
     Then I verified that object 3 has details panel displayed
      And I verified that object 3 has collapsed "Attribute" list displayed
      And I verified that object 3 has collapsed "Metric" list displayed
      And I verified that object 3 is certified
      And I verified that object 3 has id "3633950911EAA96889F00080EF25F8A4"

     When I clicked "Filter" list expand button on object 2
      And I clicked "Attribute" list expand button on object 2

     Then I verified that object 2 has "Filter" list with value "Region (Central, Mid-Atlantic, Northeast, Northwest, South, Southeast, Southwest, Web)"
      And I verified that object 2 has "Attribute" list with value "Call Center, Country, Distribution Center, Employee, Region"

     When I clicked "Attribute" list expand button on object 3
      And I clicked "Metric" list expand button on object 3

     Then I verified that object 3 has "Attribute" list with value "adult male, age, alive, alone, class, deck, embark town, embarked, sex, who"
      And I verified that object 3 has "Metric" list with value "fare, parch, pclass, Row Count - titanic_df, sibsp, survived"

     When I clicked object location expand button on object 1
     Then I verified that object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted dossier" displayed

     When I clicked object location expand button on object 2
     Then I verified that object 2 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted report with subtotals" displayed

     When I clicked object location expand button on object 3
     Then I verified that object 3 has full location "MicroStrategy Tutorial > Public Objects > Reports > DS Objects > Cubes for Create Testing > testing_folder_wiblgjlprj > titanic_wiblgjlprj" displayed

     When I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Hide Details"

     When I clicked toggle details button on object 1
     Then I verified that object 1 has details panel hidden

     When I hovered over toggle details button on object 2
     Then tooltip text for object 2 toggle details button is "Hide Details"

     When I clicked toggle details button on object 2
     Then I verified that object 2 has details panel hidden

     When I hovered over toggle details button on object 3
     Then tooltip text for object 3 toggle details button is "Hide Details"

     When I clicked toggle details button on object 3
     Then I verified that object 3 has details panel hidden

     When I clicked toggle details button on object 1
     Then I verified that object 1 has details panel displayed
      And I verified that object 1 has collapsed "Prompt" list displayed
      And I verified that object 1 has collapsed "Attribute" list displayed
      And I verified that object 1 has collapsed "Metric" list displayed
      And I verified that object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And I verified that object 1 has collapsed location displayed

     When I clicked toggle details button on object 2
     Then I verified that object 2 has details panel displayed
      And I verified that object 2 has collapsed "Prompt" list displayed
      And I verified that object 2 has collapsed "Filter" list displayed
      And I verified that object 2 has collapsed "Attribute" list displayed
      And I verified that object 2 has collapsed "Metric" list displayed
      And I verified that object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And I verified that object 1 has collapsed location displayed

     When I clicked toggle details button on object 3
     Then I verified that object 3 has details panel displayed
      And I verified that object 3 has collapsed "Attribute" list displayed
      And I verified that object 3 has collapsed "Metric" list displayed
      And I verified that object 3 is certified
      And I verified that object 3 has id "3633950911EAA96889F00080EF25F8A4"
      And I verified that object 3 has collapsed location displayed

      And I logged out
