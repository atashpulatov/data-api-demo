@windows_chrome
@mac_chrome
Feature: F24086 - Improved browsing by adding filters

  Scenario: [TC54853] - [Object filtering] Refresh button & filter panel
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button

     When I clicked Filters button

     Then I verified that Certified Status category header on My Library has correct title
      And I verified that Certified Status category on My Library has element Certified

      And I verified that Owner category header on My Library has title "Owner"

      And I verified that Modified category header on My Library has correct title
      And I verified that Modified category on My Library has From field
      And I verified that Modified category on My Library has To field

      And I verified that Clear All on My Library has correct name

     When I clicked "Administrator" from "Owner" category
      And I clicked "MSTR User" from "Owner" category

     Then I verified that Owner category header on My Library has title "Owner (2)"
      And I verified that Filters has "1" categories selected

     When I clicked header on column "Name"
     Then verified that objects are sorted "ascending" on column "Name"
      And I verified that Import button is disabled

     When I hover over Import button
     Then I verified that tooltip for Import button shows message "This button is currently disabled because you didn’t select any data"

     When I selected the first object from the list
      And I scrolled down list of objects by 1 page(s)
      And I scrolled down list of objects to end

     Then I selected object "Visualization manipulation"
      And I verified that Import button is enabled

     When I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Visualization 1"

     Then I closed last notification
      And I verified that cell "A1" has value "Year"

     When I removed 1 columns starting from column "A"
     Then I verified that cell "A1" has value "Catalog"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
     Then I closed all notifications
      And I verified that cell "A1" has value "Year"

     When I added a new worksheet
      And I clicked Add Data button
      And I switched off MyLibrary
      And I clicked Filters button
      And I clicked Application "MicroStrategy Tutorial"
      And I clicked Type "Dataset"

     Then I verified that Application category header has title "Application (1)"
      And I verified that Filters has "3" categories selected

     When I opened All for Modified category
      And I clicked "Last Quarter" within Modified All Panel
     Then I verified that Filters has "4" categories selected

     When I found object by ID "94A1482F11EA8E01B50F0080EF05D782" and selected "ABCD_update"
      And I clicked Import button
      And I closed last notification
     Then I verified that cells ["A1", "A2"] have values ["A", "a"]

     When I clicked clear data
     Then I verified that cells ["A1", "A2"] have values ["A", ""]

     When I clicked view data
      And I closed last notification
     Then I verified that cells ["A1", "A2"] have values ["A", "a"]

      And I logged out
