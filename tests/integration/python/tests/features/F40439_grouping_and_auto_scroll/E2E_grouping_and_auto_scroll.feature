#@ci_pipeline_postmerge_windows_chrome
Feature: F40439 - Power Point and Excel Add-in usability improvements for order of exported content and tracking users' activity

  Scenario: E2E - Importing objects
    Given I initialized Excel
     When I logged in as default user

    # Import report 1: Reprompt Report 1 - Prompt on Country on 1st sheet
      And I clicked Import Data button
      And I found and selected object "Reprompt Report 1 - Prompt on Country"
      And I clicked Prepare Data button
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I selected "Canada" as an answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all metrics
      And I selected all attributes
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I verified that number of worksheets is 1
      And I verified that number of object groups in side panel is 1
      And I verified object group "Reprompt Report 1 - Prompt o..." is active
      And I verified that number of objects in side panel is 1

    # Import report 2: Reprompt Report 1 - Prompt on Country (copy) on 2nd sheet
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Reprompt Report 1 - Prompt on Country"
      And I clicked Prepare Data button
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I selected "Canada" as an answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all metrics
      And I selected all attributes
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I verified that number of worksheets is 2
      And I verified that number of object groups in side panel is 2
      And I verified object group "Reprompt Report 1 - Prom ...(2)" is active
      And I verified that number of objects in side panel is 2

    # Import report 3: Reprompt Report 1 - Prompt on Country (another copy) on 2nd sheet
      And I selected cell "H1"
      And I clicked Add Data button
      And I found and selected object "Reprompt Report 1 - Prompt on Country"
      And I clicked Prepare Data button
      And I verified "USA" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Web" is a selected answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a available answer for "1. Country" prompt - object prompt
      And I selected "Canada" as an answer for "1. Country" prompt - object prompt
      And I verified "Canada" is a selected answer for "1. Country" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all metrics
      And I selected all attributes
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I verified that number of worksheets is 2
      And I verified that number of object groups in side panel is 2
      And I verified object group "Reprompt Report 1 - Prom ...(2)" is active
      And I verified that number of objects in side panel is 3

    # Change active worksheet, ensure side panel updates active group
      And I selected worksheet number 1
      And I verified object group "Reprompt Report 1 - Prompt o..." is active
      And I selected worksheet number 2
      And I verified object group "Reprompt Report 1 - Prom ...(2)" is active

      And I logged out
