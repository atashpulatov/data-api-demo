#@ci_pipeline_postmerge_windows_chrome
Feature: F38416 - Import reports with page-by as separate sheets in the Excel Add-in

  Scenario: [TC92486] - E2E - Importing a report with page-by attribute filter
    Given I initialized Excel
     When I logged in as default user

    # Import report 1: Prompted report with page-by
      And I clicked Import Data button
      And I found and selected object "Report with Prompt and Page by"
      And I clicked Prepare Data button
      And I selected "Movies" as an answer for "1. Category" prompt - object prompt
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible
      And I selected all metrics
      And I selected all attributes
      And I clicked Import button in Columns and Filters Selection

    # Page by configuration modal initial checks
     Then I verified that Page-by window is visible
      And I verified that Page-by dropdown is visible
      And I verified that "Add" button is enabled
      And I verified that "Add All" button is enabled
      And I verified that "Remove" button is disabled
      And I verified that "Reset" button is enabled
      And I verified that "Import" button is enabled
      And I verified that "Cancel" button is enabled

    # Adding 2 additional pages
     When I clicked Page-by "Subcategory" dropdown
      And I selected "Literature" attribute element
      And I selected "Pop" attribute element
      And I closed Page-by "Subcategory" dropdown
      And I clicked "Add" button
     Then I verified that "Art & Architecture" page is visible in Page-by grid
      And I verified that "Literature" page is visible in Page-by grid
      And I verified that "Pop" page is visible in Page-by grid

    # Importing selected pages to Excel
     When I clicked "Import" button
     Then I verified that Page-by window is NOT visible
      And I verified that number of worksheets is 4
      And I verified that number of objects in side panel is 3

    # Checking pages in Overview window
     When I clicked "Show in Overview" using context menu in object 1
     Then I verified Overview window is opened
      And I verified that filter details are visible in Overview window
      And I verified that number of objects in Overview window is 3
      And I clicked "Close" button in Overview window

      And I logged out
