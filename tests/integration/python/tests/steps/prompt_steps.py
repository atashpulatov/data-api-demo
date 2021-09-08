from behave import *


@step('I waited for Run button to be enabled')
def step_impl(context):
    context.pages.prompt_page().wait_for_run_button()


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run_button()


@step('I clicked Run button for prompted dossier if prompts not already answered')
def step_impl(context):
    context.pages.prompt_page().click_run_button_for_prompted_dossier_if_not_answered()


@step('I selected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().select_answer_for_object_prompt(prompt_number, prompt_name, item)


@step('I selected checkbox for "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().select_checkbox_for_object_prompt(prompt_number, prompt_name, item)


@step('I unselected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().unselect_answer_for_object_prompt(prompt_number, prompt_name, item)


@step('I typed "{text}" for "{prompt_number}. {prompt_name}" prompt - value prompt')
def step_impl(context, text, prompt_number, prompt_name):
    context.pages.prompt_page().select_answer_for_value_prompt(prompt_number, prompt_name, text)


@step('I typed "{date}" and ["{hour}", "{minute}", "{second}"] for "{prompt_number}. {prompt_name}" '
      'prompt - date prompt')
def step_impl(context, date, hour, minute, second, prompt_number, prompt_name):
    context.pages.prompt_page().provide_answer_for_date_prompt(prompt_number, prompt_name, date, hour, minute, second)


@step('I cleared input box for prompt "{prompt_number}. {prompt_name}"')
def step_impl(context, prompt_number, prompt_name):
    context.pages.prompt_page().clear_prompt_input(prompt_number, prompt_name)


@step('I clicked re-prompt button')
def step_impl(context):
    context.pages.prompt_page().click_reprompt_button()
