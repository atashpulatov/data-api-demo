@windows_chrome
@mac_chrome
Feature: I18n demo feature

  Scenario: I18n demo scenario
    Given I pass

      And I closed Excel
      And I opened Excel and logged in to Excel using locale "de-de"

      And I closed Excel
      And I opened Excel and logged in to Excel using locale "es-es"
