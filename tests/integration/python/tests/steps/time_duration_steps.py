from behave import *

from framework.util.assert_util import AssertUtil


@step('I saved execution start time to "{timer_name}"')
def step_impl(context, timer_name):
    context.pages.time_duration_page().save_execution_start(timer_name)


@step('I saved execution end time to "{timer_name}"')
def step_impl(context, timer_name):
    context.pages.time_duration_page().save_execution_end(timer_name)


@step('I verified that execution time "{first_timer_name}" is similar to "{second_timer_name}" '
      'with "{threshold}" seconds threshold')
def step_impl(context, first_timer_name, second_timer_name, threshold):
    result = context.pages.time_duration_page().is_execution_time_similar(
        first_timer_name,
        second_timer_name,
        float(threshold)
    )

    AssertUtil.assert_simple(result, True)


@step('I verified that execution time "{first_timer_name}" is not longer than "{second_timer_name}"')
def step_impl(context, first_timer_name, second_timer_name):
    result = context.pages.time_duration_page().is_execution_time_not_longer_than(
        first_timer_name,
        second_timer_name,
    )

    AssertUtil.assert_simple(result, True)
