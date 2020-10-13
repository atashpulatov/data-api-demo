@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67611] - Imported object details E2E
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "3633950911EAA96889F00080EF25F8A4" and selected "titanic_wiblgjlprj"
      And I clicked Prepare Data button
      And I verified that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

     When I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Show Details"

     When I clicked toggle details button on object 1
     Then object 1 is certified
      And object 1 has "Attribute" list displayed
      And object 1 has "Metric" list displayed
      And object 1 has id "3633950911EAA96889F00080EF25F8A4"

     When I clicked "Attribute" list expand button on object 1
      And I clicked "Metric" list expand button on object 1
      And I clicked object location expand button on object 1

     Then object 1 has "Attribute" list with value "adult male, age, alive, alone, class, deck, embark town, embarked, sex, who"
      And object 1 has "Metric" list with value "fare, parch, pclass, Row Count - titanic_df, sibsp, survived"
      And object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > DS Objects > Cubes for Create Testing > testing_folder_wiblgjlprj > titanic_wiblgjlprj" displayed

     When I added a new worksheet
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

      And I clicked toggle details button on object 1

     Then object 1 has "Prompt" list displayed
      And object 1 has "Filter" list displayed
      And object 1 has "Attribute" list displayed
      And object 1 has "Metric" list displayed
      And object 1 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I clicked "Filter" list expand button on object 1
      And I clicked "Attribute" list expand button on object 1
      And I clicked object location expand button on object 1

     Then object 1 has "Filter" list with value "Call Center (Atlanta, San Diego, San Francisco, Washington, DC, Salt Lake City, Miami, Milwaukee, New Orleans, Seattle, Boston, New York, Fargo, Memphis, Charleston, Web), Employee (Bates, Becker, Bell, Benner, Bernstein, Brown, Conner, Corcoran, De Le Torre, Ellerkamp, Folks, Gale, Gedot, Hall, Hollywood, Hunt, Ingles, Johnson, Kelly, Kieferson, Lynch, McClain, Nelson, Pierce, Sawyer, Schafer, Smith, Sonder, Strome, Torrison, Yager, Young, Zemlicka, Walker)"
      And object 1 has "Attribute" list with value "Call Center, Country, Distribution Center, Employee, Region"
      And object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted report with subtotals" displayed

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "5902C03A11E9FEF1DC670080EF856919" and selected "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I imported visualization "Visualization 1"
      And I closed last notification

      And I clicked toggle details button on object 1

     Then object 1 has "Prompt" list displayed
      And object 1 has "Attribute" list displayed
      And object 1 has "Metric" list displayed
      And object 1 has id "5902C03A11E9FEF1DC670080EF856919"

     When I clicked object location expand button on object 1
     Then object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted dossier" displayed

     When I clicked on object 1
     Then columns ["A", "B", "C", "D"] are selected
      And rows ["1", "2", "3", "4", "5", "6", "7", "8", "9"] are selected

     When I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Hide Details"

     When I clicked toggle details button on object 1
     Then object 1 has details panel hidden

     When I clicked Edit object 3
      And I unselected all metrics
      And I clicked metric "survived"
      And I selected filter "age" with all elements
      And I clicked Import button in Columns and Filters Selection
      And I closed notification on object 3

      And I clicked toggle details button on object 3

     Then object 3 is certified
      And object 3 has collapsed "Filter" list displayed
      And object 3 has collapsed "Attribute" list displayed
      And object 3 has collapsed "Metric" list displayed

     When I clicked "Filter" list expand button on object 3
      And I clicked "Attribute" list expand button on object 3
      And I clicked object location expand button on object 3
     Then object 3 has "Filter" list with value "age (0.42, 0.67, 0.75, 0.83, 0.92, 1, 10, 11, 12, 13, 14, 14.5, 15, 16, 17, 18, 19, 2, 20, 20.5, 21, 22, 23, 23.5, 24, 24.5, 25, 26, 27, 28, 28.5, 29, 3, 30, 30.5, 31, 32, 32.5, 33, 34, 34.5, 35, 36, 36.5, 37, 38, 39, 4, 40, 40.5, 41, 42, 43, 44, 45, 45.5, 46, 47, 48, 49, 5, 50, 51, 52, 53, 54, 55, 55.5, 56, 57, 58, 59, 6, 60, 61, 62, 63, 64, 65, 66, 7, 70, 70.5, 71, 74, 8, 80, 9, NA)"
      And object 3 has "Attribute" list with value "alive, who, alone, deck, class, adult male, embarked, embark town, sex, age"
      And object 3 has full location "MicroStrategy Tutorial > Public Objects > Reports > DS Objects > Cubes for Create Testing > testing_folder_wiblgjlprj > titanic_wiblgjlprj" displayed

     When I clicked Duplicate on object 2
      And I clicked Import button in Duplicate popup
      And I closed last notification

      And I clicked toggle details button on object 1

     Then object 1 has collapsed "Prompt" list displayed
      And object 1 has collapsed "Filter" list displayed
      And object 1 has collapsed "Attribute" list displayed
      And object 1 has collapsed "Metric" list displayed
      And object 1 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I clicked "Filter" list expand button on object 1
      And I clicked "Attribute" list expand button on object 1
      And I clicked object location expand button on object 1
     Then object 1 has "Filter" list with value "Call Center (Atlanta, San Diego, San Francisco, Washington, DC, Salt Lake City, Miami, Milwaukee, New Orleans, Seattle, Boston, New York, Fargo, Memphis, Charleston, Web), Employee (Bates, Becker, Bell, Benner, Bernstein, Brown, Conner, Corcoran, De Le Torre, Ellerkamp, Folks, Gale, Gedot, Hall, Hollywood, Hunt, Ingles, Johnson, Kelly, Kieferson, Lynch, McClain, Nelson, Pierce, Sawyer, Schafer, Smith, Sonder, Strome, Torrison, Yager, Young, Zemlicka, Walker)"
      And object 1 has "Attribute" list with value "Call Center, Country, Distribution Center, Employee, Region"
      And object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Prompted report with subtotals" displayed

     When I refreshed all objects
      And I waited for all progress notifications to disappear
      And I closed all notifications
      And I clicked toggle details button on object 1

     Then object 1 has collapsed "Prompt" list displayed
      And object 1 has collapsed "Filter" list displayed
      And object 1 has collapsed "Attribute" list displayed
      And object 1 has collapsed "Metric" list displayed
      And object 1 has collapsed location displayed
      And object 1 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I clicked toggle details button on object 2
     Then object 2 has collapsed "Prompt" list displayed
      And object 2 has collapsed "Attribute" list displayed
      And object 2 has collapsed "Metric" list displayed
      And object 2 has collapsed location displayed
      And object 2 has id "5902C03A11E9FEF1DC670080EF856919"

     When I clicked toggle details button on object 3
     Then object 3 has collapsed "Prompt" list displayed
      And object 3 has collapsed "Filter" list displayed
      And object 3 has collapsed "Attribute" list displayed
      And object 3 has collapsed "Metric" list displayed
      And object 3 has collapsed location displayed
      And object 3 has id "4BF6385A11EA638B25610080EFC58CB1"

     When I clicked toggle details button on object 4
     Then object 4 is certified
      And object 4 has collapsed "Attribute" list displayed
      And object 4 has collapsed "Metric" list displayed
      And object 4 has collapsed location displayed
      And object 4 has id "3633950911EAA96889F00080EF25F8A4"

      And I logged out

    Given I ensured object "4BF6385A11EA638B25610080EFC58CB1" in Tutorial project is certified

      And I logged in as default user
      And I refreshed all objects
      And I waited for all progress notifications to disappear
      And I closed all notifications

     When I clicked toggle details button on object 1
     Then object 1 is certified

     When I clicked toggle details button on object 2
     Then object 2 is certified

     When I clicked toggle details button on object 4
     Then object 4 is certified

      And I decertified object "4BF6385A11EA638B25610080EFC58CB1" in Tutorial project

      And I logged out
