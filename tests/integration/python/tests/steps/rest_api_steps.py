from behave import *
from framework.util.assert_util import AssertUtil

TUTORIAL_PROJECT_ID = "B7CA92F04B9FAE8D941C3E9B7E0CD754"


@given('Object {object_id} in Tutorial project is not certified')
def step_impl(context, object_id):
    context.pages.rest_api_page().decertify_object(object_id, TUTORIAL_PROJECT_ID)


@step('I certify object {object_id} in Tutorial project')
def step_impl(context, object_id):
    context.pages.rest_api_page().certify_object(object_id, TUTORIAL_PROJECT_ID)


@step('I decertify object {object_id} in Tutorial project')
def step_impl(context, object_id):
    context.pages.rest_api_page().decertify_object(object_id, TUTORIAL_PROJECT_ID)


@step('object {object_id} is certified in Tutorial project')
def step_impl(context, object_id):
    is_certified = context.pages.rest_api_page().is_object_certified(object_id, TUTORIAL_PROJECT_ID)

    AssertUtil.assert_simple(is_certified, True)


@step('object {object_id} is not certified in Tutorial project')
def step_impl(context, object_id):
    is_certified = context.pages.rest_api_page().is_object_certified(object_id, TUTORIAL_PROJECT_ID)

    AssertUtil.assert_simple(is_certified, False)
