from behave import *

from framework.util.assert_util import AssertUtil


@step('I certified object "{object_id}" in Tutorial project')
def step_impl(context, object_id):
    context.pages.rest_api_page().certify_object(object_id)


@step('I decertified object "{object_id}" in Tutorial project')
def step_impl(context, object_id):
    context.pages.rest_api_page().decertify_object(object_id)


@step('object "{object_id}" is certified in Tutorial project')
def step_impl(context, object_id):
    is_certified = context.pages.rest_api_page().is_object_certified(object_id)

    AssertUtil.assert_simple(is_certified, True)


@step('object "{object_id}" is not certified in Tutorial project')
def step_impl(context, object_id):
    is_certified = context.pages.rest_api_page().is_object_certified(object_id)

    AssertUtil.assert_simple(is_certified, False)
