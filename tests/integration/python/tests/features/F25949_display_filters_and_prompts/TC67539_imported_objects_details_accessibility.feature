#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@disabled_windows_chrome @disabled_mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67539] - Imported objects details showing, hiding  and coping with keyboard navigation - accessibility
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I selected "Movies" as an answer for "1. Category" prompt - object prompt
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Subcategory" with all elements
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

     Then I verified that cells ["A10", "B10", "C10", "D10"] have values ["Jan-14", "Computers", "$6,530", "$5,347"]

     When I selected cell "H1"
      And I clicked Add Data button
      And I found object by ID "5BBA2D6911EA906EE92E0080EF1515C7" and selected "100 Sales Records.csv"
      And I clicked Prepare Data button
      And I verified that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Item Type" with all elements
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

     Then I verified that cells ["J15", "K15", "L15", "M15"] have values ["519820964", "C", "Sub-Saharan Africa", "Offline"]

     When I selected cell "X1"
      And I clicked Add Data button
      And I found object by ID "69CC877E11E9FEEDDC670080EFD50918" and selected "Dossier with many visualisations and pages"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cells ["X5", "X9"] have values ["27000", "42000"]

     # expanding details on imported objects with keyboard navigation
     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab

     Then tooltip text for object 1 toggle details button is "Show Details"

     When I pressed key Enter
     Then I verified that object 1 has details panel displayed
      And I verified that object 1 has "Attribute" list with value "Salary"
      And I verified that object 1 has "Metric" list with value "Count of Customers"
      And I verified that object 1 has id "69CC877E11E9FEEDDC670080EFD50918"
      And I verified that object 1 has collapsed location displayed

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that object 1 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Dossier with many visualisations and pages" displayed

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that object 2 has details panel displayed
      And I verified that object 2 has collapsed "Filter" list displayed
      And I verified that object 2 has collapsed "Attribute" list displayed
      And I verified that object 2 has collapsed "Metric" list displayed
      And I verified that object 2 has id "5BBA2D6911EA906EE92E0080EF1515C7"
      And I verified that object 2 has collapsed location displayed

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that object 2 has "Filter" list with value "Item Type (Baby Food, Beverages, Cereal, Clothes, Cosmetics, Fruits, Household, Meat, Office Supplies, Personal Care, Snacks, Vegetables)"

     When I pressed key Enter
     Then I verified that object 2 has "Attribute" list with value "Item Type, Order Date, Order ID, Order Priority, Region, Sales Channel, Ship Date"

     When I pressed key Enter
     Then I verified that object 2 has "Metric" list with value "Country, Row Count - 100 Sales Records.csv, Total Cost, Total Profit, Total Revenue, Unit Cost, Unit Price, Units Sold"

     When I pressed key Enter
     Then I verified that object 2 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > 100 Sales Records.csv" displayed

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that object 3 has details panel displayed
      And I verified that object 3 has "Prompt" list with value "Books, Electronics, Movies, Music"
      And I verified that object 3 has collapsed "Filter" list displayed
      And I verified that object 3 has "Attribute" list with value "Month, Subcategory"

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
     Then I verified that object 3 has "Filter" list with value "Subcategory (Art & Architecture, Business, Literature, Books - Miscellaneous, Science & Technology, Sports & Health, Audio Equipment, Cameras, Computers, Electronics - Miscellaneous, TV's, Video Equipment, Action, Comedy, Drama, Horror, Kids / Family, Special Interests, Alternative, Country, Music - Miscellaneous, Pop, Rock, Soul / R&B)"

     When I pressed key Enter
     Then I verified that object 3 has "Metric" list with value "Profit, Profit Forecast, Revenue, Revenue Forecast"
      # workaround for screen resolution on CI Pipeline line "I clicked toggle details button on object 3" x2 to be removed, once to do is implemented for scroll down
     When I clicked toggle details button on object 3
      And I clicked toggle details button on object 3
     Then I verified that object 3 has id "300DBAFA4A1D8EC546AC6AB8CDE7834E"

      # 4 Tab steps to be removed once the todo for scroll is implemented
     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      # TODO: step to implement
      # And I scrolled down right panel to the end
     Then I verified that object 3 has collapsed location displayed

     When I pressed key Enter
     Then I verified that object 3 has full location "MicroStrategy Tutorial > Public Objects > Reports > _Centralised Main Folder > Report with a subtotal & prompt" displayed

      # hiding imported objects details
     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab

     Then tooltip text for object 1 toggle details button is "Hide Details"

     When I pressed key Enter
     Then I verified that object 1 has details panel hidden

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that object 2 has details panel hidden

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that object 3 has details panel hidden

     # executing actions on objects with keyboard navigation
     When I clicked on object 2
      And I pressed key Tab
      And I pressed key Enter
      And I pressed key Esc
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Arrow Up
      And I pressed key Tab
      And I pressed key Enter
      And I waited for all progress notifications to disappear
      And I closed last notification

     Then I verified that object number 1 is called "100 Sales Records.csv Copy"
      And I verified that number of worksheets is 2

     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I verified that counter of "metrics" shows "8" of "8" selected
      And I verified that counter of "attributes" shows "7" of "7" selected
      And I pressed key Esc

     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter

     Then I waited for object to be refreshed successfully
      And I closed last notification

     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
      And I closed last notification

     Then I verified that object number 1 is called "Visualization 1"

      And I logged out
