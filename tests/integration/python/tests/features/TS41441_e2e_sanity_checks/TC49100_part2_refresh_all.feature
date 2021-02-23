@ci_pipeline_rv_mac_chrome @ci_pipeline_premerge_mac_chrome @ci_pipeline_postmerge_mac_chrome @ci_pipeline_daily_mac_chrome @ci_pipeline_all_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_premerge_windows_chrome @ci_pipeline_postmerge_windows_chrome @ci_pipeline_daily_windows_chrome @ci_pipeline_all_windows_chrome
@mac_chrome
@windows_chrome
@release_validation
@ga_validation
@11.3.1
Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Part 2. - Import multiple objects | Refresh All
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "24F3C9804D8FCA7194F1A48D1B8F1C17" and selected "Report with prompt - Attribute element prompt of Category | Required | Not default"

     When I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I waited for object to be imported successfully
      And I closed last notification
     Then object number 1 should be called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And cells ["A3", "B3"] should have values ["2014", "Mid-Atlantic"]

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

     When I selected cell "M1"
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

     Then cells ["A3", "B3", "G8", "H8", "L8", "M3", "R3", "W3", "AB3", "AR3", "BG3"] should have values ["2014", "Mid-Atlantic", "Jan 2014", "Total", "$ 302,399", "2015 Q1", "Feb 2014", "Central", "0", "Angola", "Angola" ]
      And object number 8 should be called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And object number 7 should be called "Report with a subtotal & prompt"
      And object number 6 should be called "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Polish Pójdźże, kiń tę chmurność w głąb flaszy!"
      And object number 5 should be called "Seasonal Report"
      And object number 4 should be called "Grid/graph"
      And object number 3 should be called "this name is so long that it has ellipsis when it is displayed and in fact it is more than 100 chara"
      And object number 2 should be called "100_dataset"
      And object number 1 should be called "100_dataset"

     When I removed object 1 using icon
      And I removed object 8 using icon
      And I closed all notifications
     Then cells ["A1", "BG1"] should have values ["", ""]

      And I logged out
