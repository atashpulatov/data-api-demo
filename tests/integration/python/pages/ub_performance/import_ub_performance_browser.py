import os
import time

from framework.pages_base.base_browser_page import BaseBrowserPage


class UbPerformancePage(BaseBrowserPage):
    environment_name = ""
    exception_message = ''
    initial_timer_start = 0.0

    TEST_CASE_ID = 'TC60456'
    TEST_CASE_NAME = 'Universal Benchmarking for Excel plugin from Chrome Browser | PerBuild'
    TEST_CASE_LINK = 'https://rally1.rallydev.com/#/53987408409d/detail/testcase/362684441788'
    NUMBER_OF_CLICKS = 15

    CURRENT_WORKING_DIRECTORY = os.getcwd()
    SAMPLE_MANIFEST_PATH = './framework/resources/ub_benchmarking/sampleManifest.xml'
    MODIFIED_MANIFEST_PATH = './framework/resources/ub_benchmarking/modified_manifest.xml'
    UB_CSV_PATH = './framework/resources/ub_benchmarking/UB.csv'
    ABSOLUTE_MODIFIED_MANIFEST_PATH = CURRENT_WORKING_DIRECTORY \
        + '/framework/resources/ub_benchmarking/modified_manifest.xml'

    INSERT_BUTTON_ID = 'Insert'
    OFFICE_ADD_INS_MENU_ID = 'InsertAppsForOffice'
    ADMIN_MANAGED_ADD_INS_ID = 'Admin Managed'
    UPLOAD_MENU_ID = 'UploadMenu'
    UPLOAD_FILE_DIALOG_ID = 'BrowserFile'
    UPLOAD_FILE_BUTTON_ID = 'DialogInstall'
    CLOSE_DEFAULT_ADD_IN_BUTTON_ID = 'AgaveTaskpaneCloseButtonId'

    # Always start from when/then
    steps_list = '''
        When I selected cell "A1"
         And I clicked Import Data button
         And I switched off MyLibrary
         And I found object "Platform Analytics Cube"
         And I selected object "Platform Analytics Cube"
         And I clicked Prepare Data button
         And I selected "Session" in attribute selector
         And I selected "Account" in attribute selector
         And I clicked metric "Step Count"
         And I clicked metric "Execution Duration (ms)"
         And I clicked metric "Total Queue Duration (ms)"
         And I clicked metric "SQL Pass Count"
         And I clicked metric "Job CPU Duration (ms)"
         And I clicked metric "Initial Queue Duration (ms)"
         And I clicked metric "Prompt Answer Duration (ms)"
         And I clicked Import button
         And I updated execution start time for timer "import_time"
         And I closed last notification
         And I incremented execution timer named"import_time"
         And I removed all objects
         And I closed last notification
        '''

    def get_environment_name_from_cmd_line(self, context):
        env_name = context.config.userdata.get('env_name')
        self.environment_name = env_name

    def generate_manifest_file(self):
        file_in = open(UbPerformancePage.SAMPLE_MANIFEST_PATH, 'rt')
        file_out = open(UbPerformancePage.MODIFIED_MANIFEST_PATH, 'wt')

        for line in file_in:
            modified_line = line.replace('env-173736', self.environment_name)
            file_out.write(modified_line)

        file_in.close()
        file_out.close()

    def execute_stability_test(self, context, number_of_hours):
        end_time = time.time() + float(number_of_hours) * 60 * 60

        while time.time() < end_time:
            execution_status = self.execute_steps_list(context, self.steps_list)
            if not execution_status:
                break

    def execute_steps_list(self, context, steps_list):
        try:
            context.execute_steps(steps_list)
        except Exception as exc:
            self.exception_message = exc
            return False

        return True

    def click_insert_menu(self):
        self.get_element_by_id(UbPerformancePage.INSERT_BUTTON_ID).click()

    def click_office_add_ins_menu(self):
        self.get_element_by_id(UbPerformancePage.OFFICE_ADD_INS_MENU_ID).click()

    def click_admin_managed_menu(self):
        self.focus_on_add_in_upload_frame()
        self.get_element_by_id(UbPerformancePage.ADMIN_MANAGED_ADD_INS_ID).click()

    def click_upload_add_in(self):
        self.focus_on_add_in_upload_frame()
        self.get_element_by_id(UbPerformancePage.UPLOAD_MENU_ID).click()

    def upload_file_to_dialog_window(self):
        self.focus_on_add_in_upload_frame()
        file_input = self.get_element_by_id(UbPerformancePage.UPLOAD_FILE_DIALOG_ID)
        file_input.send_keys(UbPerformancePage.ABSOLUTE_MODIFIED_MANIFEST_PATH)

    def click_upload_button(self):
        self.focus_on_add_in_upload_frame()
        self.get_element_by_id(UbPerformancePage.UPLOAD_FILE_BUTTON_ID).click()

    def click_close_button_on_default_addon(self):
        self.focus_on_add_in_frame()
        self.get_element_by_id(UbPerformancePage.CLOSE_DEFAULT_ADD_IN_BUTTON_ID).click()

    def log_performance_data_csv(self, context):
        start_time = context.pages.time_duration_page().get_timestamp('start_time')
        end_time = context.pages.time_duration_page().get_timestamp('end_time')
        import_time = context.pages.time_duration_page().get_timer_duration_sum('import_time')
        import_counter = context.pages.time_duration_page().get_execution_counter('import_time')

        exception_message_text = str(self.exception_message).partition('\n')[0]

        f = open(UbPerformancePage.UB_CSV_PATH, 'a')
        f.write(f'\n{self.TEST_CASE_ID},{self.TEST_CASE_NAME},{self.TEST_CASE_LINK},{start_time},{end_time},'
                f'{self.NUMBER_OF_CLICKS},{import_time / import_counter}, DEBUG_DATA: sum_duration: {import_time} '
                f' counter: {import_counter} errors: {exception_message_text}')
        f.close()
