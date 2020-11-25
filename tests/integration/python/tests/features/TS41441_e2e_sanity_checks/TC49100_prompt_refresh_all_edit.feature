@mac_chrome
@windows_chrome
@release_validation
@ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Import Prompted Reports | Import multiple objects | Refresh All | Refresh | Edit - Prompts)
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "24F3C9804D8FCA7194F1A48D1B8F1C17" and selected "Report with prompt - Attribute element prompt of Category | Required | Not default"

     When I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
     Then I verified that Columns & Filters Selection is visible
      And I verified popup title is "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that counter of "attributes" shows "0" of "3" selected
      And I verified that counter of "metrics" shows "0" of "2" selected
      And I verified that counter of "filters" shows "0" of "3" selected
      #TODO And I verified Data Preview button is disabled
      #TODO And I verified Import button is disabled
      #TODO And I verified Cancel button is enabled

     When I clicked attribute "Year"
      And I clicked attribute "Region"
      And I ensured attribute is selected and I clicked forms { "Category": ["ID"] }
      And I clicked metric "Revenue"
      And I selected filter "Year" with all elements
      And I selected filters { "Region" : ["Central", "Southwest", "South", "Northeast"] }
      And I clicked Data Preview button
      And I clicked Close Preview button
      #TODO Then I verified Data Preview button is enabled / OR I verified all buttons are enabled
      #TODO And I verified Import button is enabled
      #TODO And I verified Cancel button is enabled

     When I clicked Import button in Columns and Filters Selection
      And I closed last notification
     Then object number 1 should be called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And cells ["A3", "B3"] should have values ["2014", "Northeast"]

     When I selected cell "G1"
      And I clicked Add Data button
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I closed last notification
     Then object number 1 should be called "Report with a subtotal & prompt"
      And cells ["G8", "H8", "L8"] should have values ["Jan 2014", "Total", "$ 302,399"]

    #TODO When I hovered on Refresh icon tooltip "Refresh Data" should be displayed
    When I clicked Refresh on object 2
     And I waited for object to be refreshed successfully
     And I closed notification on object 2
    Then cells ["A3", "B3"] should have values ["2014", "Northeast"]

    #TODO When I hovered on Edit icon tooltip "Edit Data" should be displayed
    When I clicked Edit object 1
     And I waited for Run button to be enabled
     And I selected "Music" as an answer for "1. Category" prompt - object prompt
     And I unselected "Electronics" as an answer for "1. Category" prompt - object prompt
     And I clicked Run button
     And I verified that Columns & Filters Selection is visible

    Then I verified that counter of "metrics" shows "4" of "4" selected
     And I verified that counter of "attributes" shows "2" of "2" selected
     And I verified that counter of "filters" shows "0" of "2" selected

    When I clicked attribute "Month"
     And I clicked metric "Profit"
     And I ensured attribute is selected and I clicked forms { "Subcategory": ["ID"] }
     And I selected filters { "Subcategory" : ["Alternative", "Pop"] }

    Then I verified that counter of "metrics" shows "3" of "4" selected
     And I verified that counter of "attributes" shows "1" of "2" selected
     And I verified that counter of "filters" shows "1" of "2" selected

    When I clicked Import button in Columns and Filters Selection
     And I closed notification on object 1
    Then cells ["G4", "H4", "I8", "K4"] should have values ["", "Total", "", "$ 1,197,222"]

    When I added a new worksheet
     And I clicked Add Data button
     And I found object by ID "6D70D06949B83CD9DBFAC0AF5FE0010E" and selected "Report with prompt - Object prompt | Required | Default answer"
     And I clicked Import button without checking results
     And I waited for Run button to be enabled
     And I clicked Run button
     And I closed last notification
     And I clicked Edit object 1

     And I unselected "Category" as an answer for "1. Objects" prompt - object prompt
     And I unselected "Subcategory" as an answer for "1. Objects" prompt - object prompt
     And I selected "Year" as an answer for "1. Objects" prompt - object prompt
     And I waited for Run button to be enabled
     And I clicked Run button

     And I verified that Columns & Filters Selection is visible
     And I clicked metric "Profit"
     And I clicked metric "Profit"

    Then I verified that counter of "filters" shows "0" of "1" selected

    When I clicked Import button in Columns and Filters Selection
     And I closed notification on object 1
    Then cells ["A1", "B4", "D1"] should have values ["Year", "$2,249,397", ""]


    When I selected worksheet number 1
     And I selected cell "M1"
     And I clicked Add Data button
     And I found object by ID "FB57AF3E11EA94342AF20080EFD58458" and selected "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Polish Pójdźże, kiń tę chmurność w głąb flaszy!"
     And I clicked Import button

     And I selected cell "R1"
     And I clicked Add Data button
     And I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
     And I clicked Import button

     And I selected cell "W1"
     And I clicked Add Data button
     And I found object by ID "A2BC67F211E9F56F23850080EF55D48D" and selected "Grid/graph"
     And I clicked Import button

     And I selected cell "AB1"
     And I clicked Add Data button
     And I found object by ID "3902375B11EA951135AC0080EFA5B3E7" and selected "this name is so long that it has ellipsis when it is displayed and in fact it is more than 100 chara"
     And I clicked Import button

     And I selected cell "AR1"
     And I clicked Add Data button
     And I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
     And I clicked Import button

     And I selected cell "BG1"
     And I clicked Add Data button
     And I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
     And I clicked Import button

     And I refreshed all objects
     And I waited for all progress notifications to disappear
     And I closed all notifications

    And I removed object 1 using icon
    And I removed object 9 using icon
    And I closed all notifications

    Then cells ["A1", "BG1"] should have values ["", ""]

    And I logged out
