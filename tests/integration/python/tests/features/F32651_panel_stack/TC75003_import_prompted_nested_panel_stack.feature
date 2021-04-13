@release_validation
@ga_validation
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75003] - [Panel Stack] E2E - Importing, Editing, Duplicating, Refreshing, Clear Data for Prompted Dossier with Nested Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
     # And I found object by ID "ID" and selected "Prompted Dossier with nested panel Stack" update ID when added to the CMD env
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected dossier page or chapter 1

      And I select Panel "1" for Panel Stack "Name"
      And I select Panel "1" for nested Panel Stack in Panel Stack "Name"
      And I select Visualization "Name" from Panel "1"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
#     Then I verified that cells [] have values []

     When I clicked Edit object 1
#      And I selected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I select Panel "2" for Panel Stack "Name"
      And I select Panel "2" for nested Panel Stack in Panel Stack "Name"
      And I select Visualization "Name" from Panel "1"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
#     Then I verified that cells [] have values []

     When I selected cell "H1"
      And I clicked Duplicate on object 1
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
#      And I selected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
      And I select Panel "2" for Panel Stack "Name"
      And I select Panel "2" for nested Panel Stack in Panel Stack "Name"
      And I select Visualization "Name" from Panel "1"
      And I clicked import dossier
      And I waited for object to be duplicated successfully
      And I closed last notification
#     Then I verified that cells [] have values []
      And I verified that object number 1 is called "Prompted Dossier with nested panel Stack Copy"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
#     Then I verified that cells [] have values []

     When I clicked clear data
     Then I verified that cells ["", "", "", ""] have values ["", "", "", ""]
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["", ""] have values ["", ""]
      And I logged out

