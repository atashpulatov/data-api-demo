Feature: Time duration demo

  Scenario: Time duration demo
    Given I saved execution start time to "timer_1_label"
      And I wait 5
      And I saved execution duration to "timer_1_label"

      And I saved execution start time to "timer_2_label"
      And I wait 10
      And I saved execution duration to "timer_2_label"

     Then I verified that execution duration "timer_2_label" is similar to "timer_1_label" with "7.3" seconds threshold
      And I verified that execution duration "timer_1_label" is not longer than "timer_2_label"
