@mac_chrome
Feature: F24086 - Improved browsing by adding filters

  Scenario: [TC54853] - [Object filtering] Refresh button & filter panel
    Given I logged in as default user
      And I clicked Import Data button
      And I switched on MyLibrary
      And I clicked Filters button
     Then Certified Status category header on My Library has title "Certified Status"
      And Certified Status element on My Library has title "Certified"
      And Owner category header on My Library has title "Owner"
      And Modified category header on My Library has title "Modified"
      And Modified category on My Library has From field
      And Modified category on My Library has To field
      And Clear All on My Library has correct title
     
     When I clicked "Administrator" from "Owner" category
      And I clicked "MSTR User" from "Owner" category
     
      When I clicked header on column "Name"

      When I selected the first object from the list
       And I scrolled down list of objects by 1 pages
       And I scrolled down list of objects to end
       And I pressed key Arrow Down
       And I pressed key Arrow Down
       And I pressed key Arrow Down
       And I pressed key Arrow Down
       And I clicked Import button to open Import Dossier
       And I waited for dossier to load successfully
       And I selected any visualization
       And I clicked import dossier
       And I closed last notification

      When I removed 1 columns starting from column "A"

      When I clicked Refresh on object 1
       And I waited for object to be refreshed successfully
       And I closed all notifications

      When I added a new worksheet
       And I clicked Add Data button
       And I ensured that MyLibrary Switch is OFF
       And I clicked Filters button
       And I clicked application "MicroStrategy Tutorial"
       And I clicked type "Dataset"

      When I opened All for Modified category
       And I clicked Last Quarter within Modified All Panel
       And I found object by ID "94A1482F11EA8E01B50F0080EF05D782" and selected "ABCD_update"
       And I clicked Import button
       And I closed last notification

      When I clicked clear data

      When I clicked view data

       And I logged out
