from behave import *

from framework.util.assert_util import AssertUtil
from framework.util.exception.mstr_exception import MstrException
from framework.util.util import Util


@step('I pass')
def step_impl(context):
    pass


@step('I fail')
def step_impl(context):
    AssertUtil.assert_simple(True, False)


@step('I fail with exception')
def step_impl(context):
    raise MstrException('I fail with exception')


@step('I wait {secs}')
def step_impl(context, secs):
    Util.pause(int(secs))


@step('I debug')
def step_impl(context):
    context.pages.debug_page().execute_tmp_code()


@step('I log page source')
def step_impl(context):
    context.pages.debug_page().log_page_source()
