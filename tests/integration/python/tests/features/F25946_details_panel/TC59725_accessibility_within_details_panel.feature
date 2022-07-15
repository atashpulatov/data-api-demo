@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_chrome @mac_chrome
 #Test case doesn't work because of the defect: DE214579
Feature: F25946 - Details panel

  Scenario: [TC59725] Accessibility within details panel
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object "8738171C11E97AED00000080EF155102"
      And I selected the first object from the list

#TODO - uncomment steps when DE214579 will be fixed
#      And I pressed key Tab
#      And I pressed key Tab
#      And I pressed key Tab
#      And I pressed key Tab
#      And I pressed key Tab
#      And I pressed key Tab
     Then I verified that the background color of the first object is "#f0f7fe"

#TODO when I pressed key Tab - should be deleted when DE214579 will be fixed
     When I pressed key Tab
      And I pressed key Enter
      And I verified that the details of the first expanded object displayed "id" as "8738171C11E97AED00000080EF155102"
     Then I verified that details arrow tooltip for object number 1 displays "Show less"

     When I pressed key Enter
     Then I verified that details arrow tooltip for object number 1 displays "Show more"
