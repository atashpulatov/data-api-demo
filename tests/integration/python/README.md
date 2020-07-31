# python_test
(python_test - name to be changed ;) )

**python_test** is a test automation framework and implementation of automated tests for **MicroStrategy
Excel add-in**.

It supports [behavior-driven development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development) and tests 
execution on different platforms. Thanks to modular architecture and use of Page Object Model pattern, tests
definitions are common for all platforms and it's easy to write and maintain tests and add support for new platforms. 

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/), a natural-like language developed
as part of [Cucumber](https://cucumber.io/) framework. Example:

```gherkin
Feature: FMMMM - Import object

  Scenario: [TCNNNNN] - Simple import object
    Given I logged in as default user
      And I clicked Import Data button
      And I found and selected object "report to be imported"
      
     When I clicked Import button
     
     Then number of worksheets should be 1
      And cell "A42" should have value "42"
```

Currently tests can be executed on: Windows Desktop, Windows Chrome, Mac Desktop, Mac Chrome.

### Table of Contents:

- [Installation](docs/installation.md)
- [Running tests](docs/running_tests.md)
- [Running tests using existing application session](docs/running_tests_using_existing_session.md)
- [Adding a new test](docs/development_adding_new_test.md)
- [Adding a new Page](docs/development_adding_new_page.md)
- [Adding support for a new platform](docs/development_adding_new_platform.md)
- [Developer's notes](docs/development_notes.md)
- [Developer's environment](docs/development_environment.md)
- TODO

README TODO:

- BDD https://en.wikipedia.org/wiki/Behavior-driven_development
- tests, Gherkin
- steps (use @step; not @given, @when, @then)
- pages, page object model
- driver factory, selecting driver
- sets of pages
- base pages, page utils
- base elements
- pages factory, selecting set of pages
- utils
- stability issues, pause()
- performance
- preparing selectors https://accessibilityinsights.io/en/downloads
- image recognition, limitations
- configuration, chromedriver
- reuse in different projects
- running in different environments, e.g. executing Python code on Mac, driving Windows Desktop using VirtualBox  
- how to check which test cases are tagged with a given tag (grep -ri '@mac_chrome' *) 
- attach to open session, Chrome (Mac, Windows) and Excel (Windows Desktop, Mac Desktop) already described

### TODO

- change usage of send_keys as it's not stable on Windows Desktop (potentially in other environments too), 
sometimes some chars are not sent;
entered values can be checked using - Windows Desktop: element.text (text node of element),
Mac Chrome: element.get_attribute('value') (input element)
- Windows Desktop - each time search for "MicroStrategy for Office"?
- reporting
- executing tests by Jenkins
- re-executing failing tests
- parallel test execution 
- use assertions library instead of simple Python's assert?
- test 0 verifying required objects existence
- support for different languages (Excel, app)
- multiple test execution in case of failure
