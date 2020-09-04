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
#    And I clicked attributes and forms { "Category": ["ID"] }
    And I selected filters { "Region" : ["Central", "South"] }
#     TODO And I clicked Data Preview button
#      TODO And I closed Data Preview
    And I clicked Import button in Columns and Filters Selection

    Then I closed last notification
    And cells ["C5", "A7", "B7", "C25"] should have values ["$14,215", "2015", "Electronics", ""]

    Given I selected cell "H1"
    And I clicked Add Data button
    When I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
    And I clicked Import button without checking results
    And I waited for Run button to be enabled
    And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
    And I clicked Run button

    Then I closed last notification
    And cells ["H5", "I7", "J7", "K25"] should have values ["$14,215", "2015", "Electronics", ""]

    When I clicked Refresh on object 2
#    And I closed all notifications

    When I clicked Edit object 1
    And I waited for Run button to be enabled
    And I selected "Music" as an answer for "1. Category" prompt - object prompt
    And I clicked Run button
    And I ensure that "1" of "4" metrics are selected
    And I ensure that "1" of "2" attributes are selected
    And I ensure that "1" of "2" filters are selected
    And I clicked attribute "Month"
    And I clicked metric "Profit"
    #    And I clicked attributes and forms { "Category": ["ID"] }
    And I selected filters { "Subcategory" : ["Audio Equipment", "TV's"] }
    And I ensure that "1" of "4" metrics are selected
    And I ensure that "1" of "2" attributes are selected
    And I ensure that "1" of "2" filters are selected
    And I clicked Import button in Columns and Filters Selection

    Then I closed last notification
    And cells ["H5", "I7", "J7", "K25"] should have values ["$14,215", "2015", "Electronics", ""]

   Given I selected cell "M1"
    And I clicked Add Data button
    When I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
    And I clicked Import button

    Given I selected cell "M1"
    And I clicked Add Data button
    When I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
    And I clicked Import button

    Given I selected cell "M1"
    And I clicked Add Data button
    When I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
    And I clicked Import button

    Given I selected cell "M1"
    And I clicked Add Data button
    When I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
    And I clicked Import button

    Given I selected cell "M1"
    And I clicked Add Data button
    When I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
    And I clicked Import button

    Given I selected cell "M1"
    And I clicked Add Data button
    When I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
    And I clicked Import button

    When I refreshed all objects
    And I closed all notifications

    When I removed object 6 using icon
     And I removed object 7 using icon
     And I closed all notifications

    Then I log out
















