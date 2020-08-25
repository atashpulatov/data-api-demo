from behave import *


@step('I certified object {objectId}')
def step_impl(context, objectId):
    context.pages.rest_api_page().certify_object(objectId)
