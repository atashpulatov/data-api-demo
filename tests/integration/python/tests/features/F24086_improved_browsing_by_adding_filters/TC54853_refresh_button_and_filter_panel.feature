@mac_chrome
Feature: F24086 - Improved browsing by adding filters

  Scenario: [TC54853] - [Object filtering] Refresh button & filter panel
    Given I logged in as default user
      And I clicked Import Data button

     When I clicked Filters button

     Then verified that Certified Status category header on My Library has correct title
      And verified that Certified Status category on My Library has element Certified

      And verified that Owner category header on My Library has title "Owner"

      And verified that Modified category header on My Library has correct title
      And verified that Modified category on My Library has From field
      And verified that Modified category on My Library has To field

      And verified that Clear All on My Library has correct name

     When I clicked "Administrator" from "Owner" category
      And I clicked "MSTR User" from "Owner" category

     Then verified that Owner category header on My Library has title "Owner (2)"
      And verified that Filters has "1" categories selected

     When I clicked header on column "Name"
     Then verified that objects are sorted "ascending" on column "Name"

     When I selected the first object from the list
      And I scrolled down list of objects by 1 page(s)
      And I scrolled down list of objects to end
   # TODO according to TC description - select any object at the end and check if it's selected

      And I found object by ID "147F272E11EB016AE2890080EF15EE7D" and selected "Dossier with prompt - Value prompt - Text (Category) | Not required | Default answer"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Visualization 1"

     Then I closed last notification
      And cell "A1" should have value "Region"

     When I removed 1 columns starting from column "A"
     Then cell "A1" should have value "Category"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
     Then I closed all notifications
      And cell "A1" should have value "Region"

     When I added a new worksheet
      And I clicked Add Data button
      And I switched off MyLibrary
      And I clicked Filters button
      And I clicked Application "MicroStrategy Tutorial"
      And I clicked Type "Dataset"

     Then verified that Application category header has title "Application (1)"
      And verified that Filters has "3" categories selected

     When I opened All for Modified category
      And I clicked Last Quarter within Modified All Panel
     Then verified that Filters has "4" categories selected

     When I found object by ID "94A1482F11EA8E01B50F0080EF05D782" and selected "ABCD_update"
      And I clicked Import button
      And I closed last notification
     Then cells ["A1", "A2"] should have values ["A", "a"]

     When I clicked clear data
     Then cells ["A1", "A2"] should have values ["A", ""]

     When I clicked view data
      And I closed last notification
     Then cells ["A1", "A2"] should have values ["A", "a"]

      And I logged out
