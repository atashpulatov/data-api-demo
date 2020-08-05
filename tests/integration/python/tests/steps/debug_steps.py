from behave import *

from framework.util.util import Util


@step('I pass')
def step_impl(context):
    pass


@step('I wait {secs}')
def step_impl(context, secs):
    Util.pause(int(secs))


@step('I debug')
def step_impl(context):
    context.pages.debug_page().execute_tmp_code()


@step('I log source')
def step_impl(context):
    context.pages.debug_page().log_page_source()
