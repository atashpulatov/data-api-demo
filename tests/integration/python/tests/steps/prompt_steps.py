from behave import *

from framework.util.assert_util import AssertUtil


@step('I waited for Run button to be enabled')
def step_impl(context):
    context.pages.prompt_page().wait_for_run_button()

@step('I waited for Prompt Dialog to be loaded')
def step_impl(context):
    context.pages.prompt_page().wait_for_prompt_dialog()


@step('I clicked Run button')
def step_impl(context):
    context.pages.prompt_page().click_run_button()


@step('I clicked Run button for prompted dossier if prompts not already answered')
def step_impl(context):
    context.pages.prompt_page().click_run_button_for_prompted_dossier_if_not_answered()


@step('I selected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().select_answer_for_object_prompt(prompt_number, prompt_name, item)


@step('I selected in dossier prompt "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().select_answer_for_dossier_object_prompt(prompt_number, prompt_name, item)


@step('I selected checkbox for "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().select_checkbox_for_object_prompt(prompt_number, prompt_name, item)


@step('I unselected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    context.pages.prompt_page().unselect_answer_for_object_prompt(prompt_number, prompt_name, item)

@step('Ignore error I unselected "{item}" as an answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    try:
        context.pages.prompt_page().unselect_answer_for_object_prompt(prompt_number, prompt_name, item)
    except:
        pass


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


@step('I verified "{item}" is a selected answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    is_prompt_answer_selected = context.pages.prompt_page().check_selected_answer_for_object_prompt(prompt_number, prompt_name, item)
    AssertUtil.assert_simple(is_prompt_answer_selected, True)

@step('I verified "{item}" is a available answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    is_prompt_answer_available = context.pages.prompt_page().check_available_answer_for_object_prompt(prompt_number, prompt_name, item)
    AssertUtil.assert_simple(is_prompt_answer_available, True)

@step('I verified in dossier prompt "{item}" is a selected answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    is_prompt_answer_selected = context.pages.prompt_page().check_selected_answer_for_dossier_object_prompt(prompt_number, prompt_name, item)
    AssertUtil.assert_simple(is_prompt_answer_selected, True)

@step('I verified in dossier prompt "{item}" is a available answer for "{prompt_number}. {prompt_name}" prompt - object prompt')
def step_impl(context, item, prompt_number, prompt_name):
    is_prompt_answer_available = context.pages.prompt_page().check_available_answer_for_dossier_object_prompt(prompt_number, prompt_name, item)
    AssertUtil.assert_simple(is_prompt_answer_available, True)

@step('I verified Prompt Dialog has title "Reprompt {obj_number} of {total_obj_number} > {object_name}"')
def step_impl(context, obj_number, total_obj_number, object_name):
    is_title_displayed = context.pages.prompt_page().check_prompt_dialog_title(obj_number, total_obj_number, object_name)
    AssertUtil.assert_simple(is_title_displayed, True)

@step('I create a new personal personal named "{name}"')
def step_impl(context, name):
    context.pages.prompt_page().save_new_answer(name)

@step('I create a new default personal personal named "{name}"')
def step_impl(context, name):
    context.pages.prompt_page().save_new_answer_as_default(name)

@step('I load "{name}" as the current answer')
def step_impl(context, name):
    context.pages.prompt_page().loadPersonalAnswer(name)

@step('I rename personal answer "{oldName}" to "{newName}"')
def step_impl(context, oldName, newName):
    context.pages.prompt_page().renamePersonalAnswer(oldName, newName)

@step('I delete personal answer "{name}"')
def step_impl(context, name):
    context.pages.prompt_page().deletePersonalAnswer(name)

@step('I set "{name}" personal answer as the default answer')
def step_impl(context, name):
    context.pages.prompt_page().setDefaultPersonalAnswer(name)

@step('I clear the current personal answer')
def step_impl(context):
    context.pages.prompt_page().clearPersonalAnswer()

@step('I uncheck save answer checkbox')
def step_impl(context):
    context.pages.prompt_page().uncheckSaveAnswer()

@step('I checked save answer checkbox')
def step_impl(context):
    context.pages.prompt_page().checkSaveAnswer()