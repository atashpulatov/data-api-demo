#@ci_pipeline_postmerge_windows_chrome
Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Part 2. - Import multiple objects | Refresh All
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Report with prompt - Attribute element prompt of Category | Required | Not default"

     When I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that object number 1 is called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that cells ["A3", "B3"] have values ["2014", "Mid-Atlantic"]

     When I selected cell "G1"
      And I clicked Add Data button
      And I found and selected object "Report with a subtotal & prompt"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I closed last notification
     Then I verified that object number 1 is called "Report with a subtotal & prompt"
      And I verified that cells ["G8", "H8", "L8"] have values ["Jan-20", "Total", "$ 302,399"]

     When I selected cell "M1"
      And I clicked Add Data button
      And I found and selected object "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Polish Pójdźże, kiń tę chmurność w głąb flaszy!"
      And I clicked Import button

      And I selected cell "R1"
      And I clicked Add Data button
      And I found and selected object "Seasonal Report"
      And I clicked Import button

      And I selected cell "W1"
      And I clicked Add Data button
      And I found and selected object "Grid/graph"
      And I clicked Import button

      And I selected cell "AB1"
      And I clicked Add Data button
      And I found and selected object "this name is so long that it has ellipsis when it is displayed and in fact it is more than 100 chara"
      And I clicked Import button

      And I selected cell "AR1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button

      And I selected cell "BG1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button

      And I refreshed all objects
      And I waited for all progress notifications to disappear
      And I closed all notifications

     Then I verified that cells ["A3", "B3", "G8", "H8", "L8", "M3", "R3", "W3", "AB3", "AR3", "BG3"] have values ["2020", "Mid-Atlantic", "Jan-20", "Total", "$ 302,399", "2015 Q1", "Feb-20", "Central", "0", "Angola", "Angola"]
      And I verified that object number 8 is called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that object number 7 is called "Report with a subtotal & prompt"
      And I verified that object number 6 is called "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Polish Pójdźże, kiń tę chmurność w głąb flaszy!"
      And I verified that object number 5 is called "Seasonal Report"
      And I verified that object number 4 is called "Grid/graph"
      And I verified that object number 3 is called "this name is so long that it has ellipsis when it is displayed and in fact it is more than 100 chara"
      And I verified that object number 2 is called "100_dataset"
      And I verified that object number 1 is called "100_dataset"

     When I removed object 1 using icon
      And I removed object 8 using icon
      And I closed all notifications
     Then I verified that cells ["A1", "BG1"] have values ["", ""]

      And I logged out
