@mac_chrome
@windows_chrome
Feature: F25946 - Display filters and prompts

  Scenario: [TC67486] - Imported objects details showing, hiding and updating
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "4BF6385A11EA638B25610080EFC58CB1" and selected "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

     Then object 1 has details panel hidden

     When I added a new worksheet
      And I clicked Add Data button

      And I found object by ID "5902C03A11E9FEF1DC670080EF856919" and selected "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
      And I hovered over toggle details button on object 1

     Then object 1 has details panel hidden
      And tooltip text for object 1 toggle details button is "Show Details"

     When I clicked toggle details button on object 1

     Then object 1 has "Prompt" list displayed
      And object 1 has "Prompt" list with value "Northeast‎, 1/1/2014"
      And object 1 has "Attribute" list displayed
      And object 1 has "Attribute" list with value "Quarter‎, Distribution Center"
      And object 1 has "Metric" list displayed
      And object 1 has "Metric" list with value "Profit‎, Revenue"
      And object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And object 1 has owner "Administrator"

     When I clicked on object 1
    # TODO: Should check if object is highlighted

     When I hovered over toggle details button on object 1
     Then tooltip text for object 1 toggle details button is "Hide Details"

     When I clicked toggle details button on object 1
     Then object 1 icon bar is visible

     When I clicked toggle details button on object 2

     Then object 2 has "Prompt" list displayed
      And object 2 has "Prompt" list with value "Books"
      And object 2 has "Attribute" list displayed
      And I clicked "Attribute" list expand button on object 2
      And object 2 has "Attribute" list with value "Call Center‎, Country‎, Distribution Center‎, Employee‎, Region"
      And object 2 has "Metric" list displayed
      And object 2 has "Metric" list with value "Cost‎, Profit‎, Profit Margin‎, Revenue‎, Units Sold"
      And object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And object 2 has owner "Administrator"

     When I changed Excel window size to 1920 x 600
     Then Right panel has scrollbar
      And I maximized Excel window

     When I clicked Edit object 2
      And I waited for Run button to be enabled
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I unselected all metrics
      And I unselected all attributes
      And I clicked attribute "Region"
      And I clicked attribute "Country"
      And I clicked metric "Cost"
      And I clicked metric "Revenue"
      And I clicked Import button in Columns and Filters Selection
      And I closed notification on object 2

      And I clicked toggle details button on object 2

     Then object 2 has "Prompt" list with value "Books"
      And object 2 has "Attribute" list with value "Country‎, Region"
      And object 2 has "Metric" list with value "Cost‎, Revenue"
      And object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And object 2 has owner "Administrator"

      And I logged out

    Given I ensured object "4BF6385A11EA638B25610080EFC58CB1" in Tutorial project is certified

     When I logged in with username "user2" and password "user2"
      And I clicked toggle details button on object 2
      And object 2 has "Prompt" list with value "Books"
      And object 2 has "Attribute" list with value "Country‎, Region"
      And object 2 has "Metric" list with value "Cost‎, Revenue"
      And object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And object 2 has owner "Administrator"

     When I clicked toggle details button on object 1
      And object 1 has "Prompt" list with value "Northeast‎, 1/1/2014"
      And object 1 has "Attribute" list with value "Quarter‎, Distribution Center"
      And object 1 has "Metric" list with value "Profit‎, Revenue"
      And object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And object 1 has owner "Administrator"

     When I refreshed all objects
      And I closed all notifications

     Then object 1 has details panel hidden
      And object 2 has details panel hidden

     When I clicked toggle details button on object 1

     Then object 1 has "Prompt" list with value "Northeast‎, 1/1/2014"
      And object 1 has "Attribute" list with value "Quarter‎, Distribution Center"
      And object 1 has "Metric" list with value "Profit‎, Revenue"
      And object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And object 1 has owner "Administrator"

     When I clicked toggle details button on object 2

     Then object 2 is certified
      And object 2 has "Prompt" list with value "Books"
      And object 2 has "Attribute" list with value "Country‎, Region"
      And object 2 has "Metric" list with value "Cost‎, Revenue"
      And object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And object 2 has owner "Administrator"

    Then I decertified object "4BF6385A11EA638B25610080EFC58CB1" in Tutorial project

     And I logged out
