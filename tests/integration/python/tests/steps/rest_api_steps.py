from behave import *

TUTORIAL_PROJECT_ID = "B7CA92F04B9FAE8D941C3E9B7E0CD754"

# @step('I certified object {objectId} in {projectId}')
# def step_impl(context, objectId, projectId):
#     context.pages.rest_api_page().certify_object(objectId, projectId)

@step('I certified object {objectId} in Tutorial project')
def step_impl(context, objectId):
    context.pages.rest_api_page().certify_object(objectId, TUTORIAL_PROJECT_ID)
