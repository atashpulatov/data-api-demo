# List of tags

**Check [running tests](running_tests.md) to check  how to use tags.** 

1. [Driver tags](#driver_tags)
1. [Tasks related tags](#tasks_related_tags)
1. [CI pipeline tags](#CI_pipeline_tags)

<a name="driver_tags"></a>
### 1. Driver tags

  ```
  - @windows_desktop
  - @windows_chrome
  - @mac_desktop
  - @mac_chrome
  - @disabled_mac_chrome
  - @disabled_windows_chrome
  - @disabled_windows_desktop
  - @disabled_mac_desktop
  ```
   We are using those tags to mark test cases ready for automation for tagged platform. When the test case broke 
   for specific platform we are tagging it with @disabled_xxx


<a name="#tasks_related_tags"></a>    
### 2. Tasks related tags

   ```
   - @release_validation
   - @ga_validation
   ```
Tags related to selecting tests for different tasks:

- `@release_validation` - tag used for running the release validation test set (test cases with this tag should
  be reviewed before each release validation),
- `@ga_validation` - tag used for running the GA validation test set (test cases with this tag should be reviewed
  before each GA validation),

<a name="CI_pipeline_tags"></a>
### 3. CI pipeline tags
   ```
   - @ci_pipeline_rv_windows_desktop
   - @ci_pipeline_rv_windows_chrome
   - @ci_pipeline_rv_mac_chrome
   - @ci_pipeline_rv_mac_desktop
   - @ci_pipeline_premerge_windows_desktop
   - @ci_pipeline_premerge_windows_chrome
   - @ci_pipeline_premerge_mac_desktop
   - @ci_pipeline_premerge_mac_chrome
   - @ci_pipeline_postmerge_windows_desktop
   - @ci_pipeline_postmerge_windows_chrome
   - @ci_pipeline_postmerge_mac_desktop
   - @ci_pipeline_postmerge_mac_chrome
   - @ci_pipeline_daily_windows_desktop
   - @ci_pipeline_daily_windows_chrome
   - @ci_pipeline_daily_mac_desktop
   - @ci_pipeline_daily_mac_chrome
   - @ci_pipeline_all_windows_desktop
   - @ci_pipeline_all_windows_chrome
   - @ci_pipeline_all_mac_desktop
   - @ci_pipeline_all_mac_chrome
   ```
   All tags above will be used for CI pipeline jobs. 

   `@ci_pipeline_rv_xx`  - with this tag, we are marking only TC included in Release Validation for a specific release.
                           (test cases with this tag should be reviewed before each release and GA validation)

   `@ci_pipeline_premerge_xx` - test cases with this tag will be used for pre-merge check

   `@ci_pipeline_postmerge_xx` - test cases with this tag will be used for post-merge check

   `@ci_pipeline_daily_xx` - this tag will be used for running test cases after each working day. 

   `@ci_pipeline_all_xx` - using this  tag we will  be  running full list of working test cases on multi platforms
