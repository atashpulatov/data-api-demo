#@ci_pipeline_postmerge_windows_chrome
Feature: F39228 - Introduce Excel add-in formatting settings for importing as text and merged columns

  Scenario: [TC92492] - Preserving data formatting for attributes by importing all types of data as Text 
    Given I initialized Excel
     When I logged in as default user

      And I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
     Then I verified "Import data as text" setting is OFF
      And I verified "Merge columns" setting is ON

     When I click back button in Settings
      And I clicked Import Data button
      And I found and selected object "Date format report"
      And I clicked Import button
      And I closed last notification

    # Verify the state of imported grid with importAsText OFF
     Then I verified that cell "A4" has value "30/12/2023"
      And I verified that cell "A3" has value "30/12/2024"
      And I verified that cell "A2" has value "12.30.2023"
      And I verified that cell "A4" has format "Date"
      And I verified that cell "A3" has format "Custom"
      And I verified that cell "A2" has format "General"

      And I verified that cell "B4" has value "01/01/2021"
      And I verified that cell "B4" has format "Custom"

      And I verified that cell "C5" has value "Mai 2022"
      And I verified that cell "C6" has value "01/04/2022"
      And I verified that cell "C5" has format "General"
      And I verified that cell "C6" has format "Custom"


    # Change the settings to import all data as text
       When I open Settings in Dots Menu
        And I clicked "Import" section on Settings menu
        And I click on "Import data as text" setting
       Then I verified "Import data as text" setting is ON

      When I click back button in Settings
       And I added a new worksheet
       And I clicked Import Data button
       And I found and selected object "Date format report"
       And I clicked Import button
       And I closed last notification

    # Verify the state of imported grid with importAsText ON
      Then I verified that cell "A4" has value "12/30/2023"
       And I verified that cell "A3" has value "12/30"
       And I verified that cell "A2" has value "12.30.2023"
       And I verified that cell "A4" has format "Text"
       And I verified that cell "A3" has format "Text"
       And I verified that cell "A2" has format "Text"

       And I verified that cell "B4" has value "January 2021"
       And I verified that cell "B4" has format "Text"

       And I verified that cell "C5" has value "Mai 2022"
       And I verified that cell "C6" has value "April 2022"
       And I verified that cell "C5" has format "Text"
       And I verified that cell "C6" has format "Text"

    # Change the settings to importAsText OFF
      When I open Settings in Dots Menu
       And I clicked "Import" section on Settings menu
       And I click on "Import data as text" setting
      Then I verified "Import data as text" setting is OFF

    # Edit the imported grid
     When I clicked Edit object 2
      And I clicked attribute "Date(en)"
      And I clicked Import button in Columns and Filters Selection
      And I closed all notifications

    # Verify the state of imported grid with importAsText OFF
     When I click back button in Settings
     Then I verified that cell "A4" has value "30/12/2023"
      And I verified that cell "A3" has value "30/12/2024"
      And I verified that cell "A2" has value "12.30.2023"
      And I verified that cell "A4" has format "Date"
      And I verified that cell "A3" has format "Custom"
      And I verified that cell "A2" has format "General"

      And I verified that cell "B5" has value "Mai 2022"
      And I verified that cell "B6" has value "01/04/2022"
      And I verified that cell "B5" has format "General"
      And I verified that cell "B6" has format "Custom"

    # Change the settings to importAsText ON
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I click on "Import data as text" setting
     Then I verified "Import data as text" setting is ON

    # Refresh and check the state of imported grid with importAsText ON
     When I click back button in Settings
      And I clicked Refresh on object 2
      And I closed all notifications

    # Verify the state of imported grid with importAsText ON doesn't change after refresh
     When I click back button in Settings
     Then I verified that cell "A4" has value "30/12/2023"
      And I verified that cell "A3" has value "30/12/2024"
      And I verified that cell "A2" has value "12.30.2023"
      And I verified that cell "A4" has format "Date"
      And I verified that cell "A3" has format "Custom"
      And I verified that cell "A2" has format "General"

      And I verified that cell "B5" has value "Mai 2022"
      And I verified that cell "B6" has value "01/04/2022"
      And I verified that cell "B5" has format "General"
      And I verified that cell "B6" has format "Custom"

    # Import "Shoe Size and tracking number Report" with importAsText ON
     When I selected cell "E1"
      And I clicked Add Data button
      And I found and selected object "Shoe Size and tracking number Report"
      And I clicked Import button
      And I closed last notification

    # Verify the state of imported grid with importAsText ON
     Then I verified that cell "E2" has format "Text"
      And I verified that cell "E3" has format "Text"
      And I verified that cell "E4" has format "Text"
      And I verified that cell "F2" has format "Text"
      And I verified that cell "F4" has format "Text"
      And I verified that cell "G4" has format "Text"
      And I verified that cell "H2" has format "General"
      And I verified that cell "H3" has format "General"
      And I verified that cell "H4" has format "General"

     # Change the settings to importAsText OFF
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I click on "Import data as text" setting
     Then I verified "Import data as text" setting is OFF

      # Duplicate the imported grid
     When I click back button in Settings
      And I selected cell "J1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Import button in Duplicate popup
      And I closed last notification

     # Verify the state of duplicated grid with importAsText OFF
     Then I verified that cell "J2" has format "Text"
      And I verified that cell "J3" has format "Text"
      And I verified that cell "J4" has format "Text"
      And I verified that cell "K2" has format "Text"
      And I verified that cell "K4" has format "Text"
      And I verified that cell "L4" has format "Text"
      And I verified that cell "M2" has format "General"
      And I verified that cell "M3" has format "General"
      And I verified that cell "M4" has format "General"


     # Import the "Shoe Size and tracking number Report" with importAsText OFF
      When I selected cell "P1"
       And I clicked Add Data button
       And I found and selected object "Shoe Size and tracking number Report"
       And I clicked Import button
       And I closed last notification

      # Verify the state of imported grid with importAsText OFF
      Then I verified that cell "P1" has format "General"
       And I verified that cell "P1" has value "1"

       And I verified that cell "Q2" has format "Custom"
       And I verified that cell "Q2" has value "09/07/2024"

       And I verified that cell "R2" has format "Number"
       And I verified that cell "R2" has value "1,23456789012345E+24"

       And I verified that cell "S2" has format "General"
       And I verified that cell "S2" has value "50"


      When I added a new worksheet
       And I clicked Import Data button
       And I found and selected object "Signs report"
       And I clicked Import button
       And I clicked Import button and saw error "An error has occurred in Excel. There was an internal error while processing the request."
       And I clicked OK on error

      # Change the settings to importAsText ON
      When I open Settings in Dots Menu
       And I clicked "Import" section on Settings menu
       And I click on "Import data as text" setting
      Then I verified "Import data as text" setting is ON

      When I added a new worksheet
       And I clicked Import Data button
       And I found and selected object "Signs report"
       And I clicked Import button
       And I closed last notification

      # Verify the state of imported grid with importAsText ON
     Then I verified that cell "A2" has format "Text"
      And I verified that cell "A3" has format "Text"
      And I verified that cell "A14" has format "Text"
      And I verified that cell "B4" has format "Text"
      And I verified that cell "B8" has format "Text"
      And I verified that cell "C8" has format "General"
      And I verified that cell "B8" has value ""

     When I manually input the value "1" in cell "B8"
     Then I verified that cell "B8" has value "1"
      And I logged out
