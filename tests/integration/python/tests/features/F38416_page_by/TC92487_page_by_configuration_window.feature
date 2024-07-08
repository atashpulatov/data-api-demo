#@ci_pipeline_postmerge_windows_chrome
Feature: F38416 - Import reports with page-by as separate sheets in the Excel Add-in

  Scenario: [TC92487] - Page-by configuration window functionality and display settings checks
    Given I initialized Excel
     When I logged in as default user

    # Change page-by setting to "Import default page"
      And I open Settings in Dots Menu
      And I clicked "Page-By" section on Settings menu
      And I selected "Import default page" display option
      And I click back button in Settings
     Then I verified Settings is NOT visible

    # Importing default page of a report
     When I clicked Import Data button
      And I found and selected object "Bursting Report - Multiple attribute in page-by"
      And I clicked Prepare Data button
     Then I verified that Columns & Filters Selection is visible

     When I selected all metrics
      And I selected import type "Import Data" and clicked import
     Then I verified that number of worksheets is 1
      And I verified that number of objects in side panel is 1

    # Change page-by setting to "Prompt to select pages"
     When I open Settings in Dots Menu
      And I clicked "Page-By" section on Settings menu
      And I selected "Prompt to select pages" display option
      And I click back button in Settings
     Then I verified Settings is NOT visible

     When I clicked "Edit" using context menu in object 1
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import Data button in Columns and Filters Selection without success check
     Then I verified that Page-by window is visible

    # Adding additional pages with "All elements" attribute selected
     When I clicked Page-by "Category" dropdown
      And I selected "All Elements" attribute element
      And I closed Page-by "Category" dropdown
      And I clicked "Add" button
     Then I verified that number of pages is 4 in Page-by grid

    # Adding additional pages with "All elements" attribute selected
     When I clicked "Add All" button
    #  todo: investigate why it is returning 17
     #Then I verified that number of pages is 20 in Page-by grid

   # Additional manipulations
      When I searched for string "Movies" in Page-by grid
      Then I verified that number of pages is 5 in Page-by grid

      When I cleared search box in Page-by grid
       And I searched for string "no_such_object" in Page-by grid
      Then I verified that number of pages is 0 in Page-by grid
       And I cleared search box in Page-by grid

      When I selected page number 1 from Page-by grid
       And I selected page number 5 from Page-by grid
       And I selected page number 12 from Page-by grid
       And I clicked "Remove" button
      Then I verified that number of pages is 17 in Page-by grid

      When I clicked "Reset" button
      Then I verified that number of pages is 1 in Page-by grid

      When I clicked Page-by "User" dropdown
       And I selected "All Elements" attribute element
       And I closed Page-by "User" dropdown
       And I clicked Page-by "Region" dropdown
       And I selected "All Elements" attribute element
       And I closed Page-by "Region" dropdown
       And I clicked "Add" button
      #Then I verified that number of pages is 20 in Page-by grid

      When I clicked "Import" button
      Then I verified that Page-by window is NOT visible
       And I waited for object to be imported successfully
       And I verified that number of worksheets is 21
       And I verified that number of objects in side panel is 20

      When I edit object 1 using context menu without prompt
       And I verified that Import with dropdown button is enabled
       And I clicked Import dropdown button
       And I verified that "Import Data" item in Import dropdown is enabled
       And I selected "Import Data" item in Import dropdown
       And I clicked Import Data button in Columns and Filters Selection without success check
      Then I verified that Page-by window is visible
       #And I verified that number of pages is 20 in Page-by grid

      When I clicked "Reset" button
      Then I verified that number of pages is 1 in Page-by grid

      When I clicked "Import" button without checking results
      Then I verified that Page-by window is NOT visible
       And I closed all notifications
       And I verified that number of worksheets is 22
       And I verified that number of objects in side panel is 1

      When I clicked Add Data button
       And I found and selected object "Report with Prompt and Page by"
       And I selected import type "Import Data" and clicked import
       And I selected "Movies" as an answer for "1. Category" prompt - object prompt
       And I selected "Music" as an answer for "1. Category" prompt - object prompt
       And I clicked Run button
      Then I verified that Page-by window is visible

      When I clicked Page-by "Subcategory" dropdown
       And I selected "Business" attribute element
       And I selected "Literature" attribute element
       And I closed Page-by "Subcategory" dropdown
       And I clicked "Add" button
      Then I verified that number of pages is 3 in Page-by grid

      When I clicked "Import" button
      Then I verified that Page-by window is NOT visible
       And I waited for object to be imported successfully
       And I closed all notifications
       And I verified that number of objects in side panel is 4

      When I clicked "Edit" using context menu in object 3
       And I unselected "Books" as an answer for "1. Category" prompt - object prompt
       And I clicked Run button
       And I verified that Import with dropdown button is enabled
       And I clicked Import dropdown button
       And I verified that "Import Data" item in Import dropdown is enabled
       And I selected "Import Data" item in Import dropdown
       And I clicked Import Data button in Columns and Filters Selection without success check
      Then I verified that number of pages is 1 in Page-by grid

      When I clicked "Import" button without checking results
      Then I verified that Page-by window is NOT visible
       And I closed all notifications
       And I verified that number of objects in side panel is 2

      When I open Settings in Dots Menu
       And I clicked "Page-By" section on Settings menu
       And I selected "Import all pages" display option
       And I click back button in Settings
      Then I verified Settings is NOT visible

      When I clicked Add Data button
       And I found and selected object "Bursting Report - Multiple attribute in page-by"
       And I selected import type "Import Data" and clicked import
       And I waited for object to be imported successfully
       And I closed all notifications
      Then I verified that number of objects in side panel is 22

      When I open Settings in Dots Menu
       And I clicked "Page-By" section on Settings menu
       And I selected "Prompt to select pages" display option
       And I click back button in Settings
      Then I verified Settings is NOT visible

       And I logged out
