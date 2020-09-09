@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67539] - Imported objects details showing, hiding  and coping with keyboard navigation - accessibility
    Given I logged in as default user

    #Importing objects for test execution
     When I clicked Import Data button
      And MyLibrary Switch is OFF  
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I selected "Movies" as an answer for "1. Category" prompt - object prompt
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I ensure that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Subcategory" with all elements
      And I clicked Import button in Columns and Filters Selection
     Then I closed last notification

     When I selected cell "H1"
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found object by ID "5BBA2D6911EA906EE92E0080EF1515C7" and selected "100 Sales Records.csv"
      And I clicked Prepare Data button
      And I ensure that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I selected filter "Order Date" with all elements
      And I clicked Import button in Columns and Filters Selection
     Then I closed last notification

     When I selected cell "X1"
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found object by ID "69CC877E11E9FEEDDC670080EFD50918" and selected "Dossier with many visualisations and pages"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
     Then I closed last notification

    #Expanding details on imported objects with keyboard navigation
     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Enter
      And I pressed key Enter
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
     Then I pressed key Enter

    #Hidding imported objects details
     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

     When I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
     Then I pressed key Enter

    #Executing actions on objects with keyboard navigation
     When I clicked on object 2
      And I pressed key Tab
      And I pressed key Enter
      And I pressed key Esc
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
     Then I closed last notification

     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
     Then I pressed key Esc

     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
     Then I closed last notification

     When I clicked on object 1
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Tab
      And I pressed key Enter
     Then I closed last notification

      And I log out