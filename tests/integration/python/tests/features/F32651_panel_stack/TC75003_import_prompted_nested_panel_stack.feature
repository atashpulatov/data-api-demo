@release_validation
@ga_validation
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75003] - [Panel Stack] E2E - Importing, Editing, Duplicating, Refreshing, Clear Data for Prompted Dossier with Nested Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "5DE8EDE90343E3D15A66A9AD5ADDA674" and selected "Prompted Nested Panel Stack"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I selected dossier page or chapter 1
    # TODO implement steps
      And I selected Panel "1" for Panel Stack "Name"
      And I selected Panel "1" for nested Panel Stack in Panel Stack "Name"
      And I selected Visualization "Name" from Panel "1"

      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
   # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []

     When I clicked Edit object 1
   # TODO implement step
       #  And I selected checkbox for "Electronics" as an answer for "1. Choose from all elements of 'Category'." prompt
      And I clicked Run button for prompted dossier if prompts not already answered
   # TODO implement steps
      And I selected Panel "2" for Panel Stack "Name"
      And I selected Panel "2" for nested Panel Stack in Panel Stack "Name"
      And I selected Visualization "Name" from Panel "1"

      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
    # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []

     When I selected cell "H1"
      And I clicked Duplicate on object 1
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
   # TODO:update when object will be added to the CMD env
     #  And I selected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I clicked Run button for prompted dossier if prompts not already answered
   # TODO steps
      And I selected Panel "2" for Panel Stack "Name"
      And I selected Panel "2" for nested Panel Stack in Panel Stack "Name"
      And I selected Visualization "Name" from Panel "1"
      And I clicked import dossier
      And I waited for object to be duplicated successfully
      And I closed last notification
   # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []
      And I verified that object number 1 is called "Prompted Dossier with nested panel Stack Copy"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
   # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []

     When I clicked clear data
   # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
   # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []
      And I logged out

