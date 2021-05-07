@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC75890] - Import different types of visualizations - Microchart
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "D28B299011EB13BF96C80080EF9584DE" and selected "Dossier with microchart"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I added dossier to Library if not yet added
      And I selected dossier page or chapter 2
      And I selected visualization "Airline Performance"
      And I clicked import dossier
      And I closed last notification
     # TODO:update when functionality will be implemented
     # Then I verified that cells [] have values []

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "Airline Performance"
      And I selected Exclude for "Sunday" element in "Day of Week" attribute for visualization "Airline Performance"
      And I clicked import dossier
      And I closed last notification
     # TODO:update when functionality will be implemented
     # Then I verified that cells [] have values []
      
     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     # TODO:update when functionality will be implemented
     # Then I verified that cells [] have values []

      And I logged out
