@mac_chrome
Feature: F25946 - Display filters and prompts

  Scenario: [TC67486] - Imported objects details showing, hiding and updating
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      
      # And I found and selected object "Prompted report with subtotals"
      And I found object by ID "4BF6385A11EA638B25610080EFC58CB1" and selected "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection

    Given I added a new worksheet
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      
      # And I found and selected object "Prompted dossier"
      And I found object by ID "5902C03A11E9FEF1DC670080EF856919" and selected "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
      And I hovered over toggle details button on object 1
      Then Tooltip text for object 1 toggle details button is "Show Details"

    Given I clicked toggle details button on object 1
      And Object 1 has "PROMPT" list displayed
      And Object 1 has "PROMPT" with value "Northeast‎, 1/1/2014"
      And Object 1 has "ATTRIBUTE" list displayed
      And Object 1 has "ATTRIBUTE" with value "Quarter‎, Distribution Center"
      And Object 1 has "METRIC" list displayed
      And Object 1 has "METRIC" with value "Profit‎, Revenue"
      And Object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And Object 1 has owner Administrator
      
    Given I selected excel table for object 1
    # TODO: Should check if object is highlighted

    Given I hovered over toggle details button on object 1
     Then Tooltip text for object 1 toggle details button is "Hide Details"

    Given I clicked toggle details button on object 1
      And Object 1 actions are visible

    Given I clicked toggle details button on object 2
      And Object 2 has "PROMPT" list displayed
      And Object 2 has "PROMPT" with value "Books"
      And Object 2 has "ATTRIBUTE" list displayed
      And I clicked "ATTRIBUTE" list expand button on object 2
      And Object 2 has "ATTRIBUTE" with value "Call Center‎, Country‎, Distribution Center‎, Employee‎, Region"
      And Object 2 has "METRIC" list displayed
      And Object 2 has "METRIC" with value "Cost‎, Profit‎, Profit Margin‎, Revenue‎, Units Sold"
      And Object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And Object 2 has owner Administrator
      
    Given I changed Excel window size to 1920 x 600
      Then Right panel has scrollbar
      And I maximixed Excel window

    Given I clicked Edit object 2
      And I waited for Run button to be enabled
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I unselected all metrics
      And I unselected all attributes
      And I clicked attribute "Region"
      And I clicked attribute "Country"
      And I clicked metric "Cost"
      And I clicked metric "Revenue"
      And I clicked Import button in Columns and Filters Selection
      And I closed notification on object 2

    Given I clicked toggle details button on object 2
      And Object 2 has "PROMPT" with value "Books"
      And Object 2 has "ATTRIBUTE" with value "Country‎, Region"
      And Object 2 has "METRIC" with value "Cost‎, Revenue"
      And Object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And Object 2 has owner Administrator

      And I log out

    Given I certify object "4BF6385A11EA638B25610080EFC58CB1" in Tutorial project
      And I certify object "5902C03A11E9FEF1DC670080EF856919" in Tutorial project

    Given I logged in with username "user2" and password "user2"
      And I clicked toggle details button on object 2
      And Object 2 has "PROMPT" with value "Books"
      And Object 2 has "ATTRIBUTE" with value "Country‎, Region"
      And Object 2 has "METRIC" with value "Cost‎, Revenue"
      And Object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And Object 2 has owner Administrator

    Given I clicked toggle details button on object 1
      And Object 1 has "PROMPT" with value "Northeast‎, 1/1/2014"
      And Object 1 has "ATTRIBUTE" with value "Quarter‎, Distribution Center"
      And Object 1 has "METRIC" with value "Profit‎, Revenue"
      And Object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And Object 1 has owner Administrator

      And I refreshed all objects
      And I closed all notifications

    Given I clicked toggle details button on object 1
     Then Object 1 is certified
      And Object 1 has "PROMPT" with value "Northeast‎, 1/1/2014"
      And Object 1 has "ATTRIBUTE" with value "Quarter‎, Distribution Center"
      And Object 1 has "METRIC" with value "Profit‎, Revenue"
      And Object 1 has id "5902C03A11E9FEF1DC670080EF856919"
      And Object 1 has owner Administrator
      
    Given I clicked toggle details button on object 2
      And Object 2 is certified
      And Object 2 has "PROMPT" with value "Books"
      And Object 2 has "ATTRIBUTE" with value "Country‎, Region"
      And Object 2 has "METRIC" with value "Cost‎, Revenue"
      And Object 2 has id "4BF6385A11EA638B25610080EFC58CB1"
      And Object 2 has owner Administrator

     Then I decertify object "4BF6385A11EA638B25610080EFC58CB1" in Tutorial project
      And I decertify object "5902C03A11E9FEF1DC670080EF856919" in Tutorial project

    And I log out
