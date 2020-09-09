@mac_chrome
Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Import Prompted Reports | Import multiple objects | Refresh All | Refresh | Edit - Prompts)
    Given I logged in as default user
    And I clicked Import Data button
    And MyLibrary Switch is OFF
    And I found object by ID "24F3C9804D8FCA7194F1A48D1B8F1C17" and selected "Report with prompt - Attribute element prompt of Category | Required | Not default"

    When I clicked Prepare Data button
    And I waited for Run button to be enabled
    And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
    And I clicked Run button
    And I clicked attribute "Region"
    And I clicked metric "Revenue"
    And I clicked attributes and forms { "Category": ["ID"] }
    And I selected filters { "Region" : ["Central", "South"] }
#     TODO And I clicked Data Preview button
#      TODO And I closed Data Preview
    And I clicked Import button in Columns and Filters Selection

    Then I closed last notification
    And cells ["A3", "B3"] should have values ["South", "$3,741,753"]

    Given I selected cell "D1"
    And I clicked Add Data button
    When I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
    And I clicked Import button without checking results
    And I waited for Run button to be enabled
    And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
    And I clicked Run button

    Then I closed last notification
    And cells ["D8", "E8", "F8", "G8", "H8", "I8"] should have values ["Jan 2014", "Total", "$71,169", "$61,698", "$354,333", "$ 302,399"]

    Then I clicked Refresh on object 2
      And I waited for object to be refreshed successfully
      And I closed last notification

    When I clicked Edit object 1
    And I waited for Run button to be enabled
    And I selected "Music" as an answer for "1. Category" prompt - object prompt
    And I unselected "Electronics" as an answer for "1. Category" prompt - object prompt
    And I clicked Run button
    And I ensure that "4" of "4" metrics are selected
    And I ensure that "2" of "2" attributes are selected
    And I ensure that "0" of "2" filters are selected
    And I clicked attribute "Month"
    And I clicked metric "Profit"
    And I clicked attributes and forms { "Category": ["ID"] }
    And I selected filters { "Subcategory" : ["Alternative", "Pop"] }
    And I ensure that "3" of "4" metrics are selected
    And I ensure that "1" of "2" attributes are selected
    And I ensure that "1" of "2" filters are selected
    And I clicked Import button in Columns and Filters Selection

    And I closed all notifications
    Then cells ["D4", "E4", "F4", "G4"] should have values ['Total', '$23,307', '$1,393,991', '$ 1,197,222']

   Given I selected cell "I1"
    And I clicked Add Data button
    When I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
    And I clicked Import button

    Given I selected cell "N1"
    And I clicked Add Data button
    When I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
    And I clicked Import button

    Given I selected cell "T1"
    And I clicked Add Data button
    When I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
    And I clicked Import button

    Given I selected cell "Y1"
    And I clicked Add Data button
    When I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
    And I clicked Import button

    Given I selected cell "AO1"
    And I clicked Add Data button
    When I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
    And I clicked Import button

    Given I selected cell "BG1"
    And I clicked Add Data button
    When I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
    And I clicked Import button

    When I refreshed all objects
    And I closed all notifications

    When I removed object 6 using icon
     And I removed object 7 using icon
     And I closed all notifications

    Then I log out
















