from behave import *

from framework.util.assert_util import AssertUtil


@step('I ensured that MyLibrary Switch is OFF')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_off()


@step('I switched on MyLibrary')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_on()


@step('I switched off MyLibrary')
def step_impl(context):
    context.pages.import_data_page().ensure_mylibrary_switch_is_off()

@step('I opened All objects list')
def step_imp(context):
    context.pages.import_data_page().go_to_all_objects_list()

@step('I selected first found object from the objects list')
def step_impl(context):
    context.pages.import_data_page().select_first_found_object()

@step('I selected object "{object_name}" from the objects list')
def step_impl(context, object_name):
    context.pages.import_data_page().find_and_select_object_from_list(object_name)


@step('I found object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().find_object(object_name)


@step('I found and selected object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().find_and_select_object(object_name)


@step('I selected object "{object_name}"')
def step_impl(context, object_name):
    context.pages.import_data_page().select_object_by_name(object_name)


@step('I found object by ID "{object_id}" and selected "{object_name}"')
def step_impl(context, object_id, object_name):
    context.pages.import_data_page().find_and_select_object_by_id(object_name, object_id)


@step('I clicked Import button')
def step_impl(context):
    context.pages.import_data_page().click_import_button(context.reset_framework, context)


@step('I clicked Import button without checking results')
def step_impl(context):
    context.pages.import_data_page().click_import_button_without_checking_results()


@step('I clicked Import button to open Import Dossier')
def step_impl(context):
    context.pages.import_data_page().click_import_button_to_open_import_dossier()

@step('I clicked Import image button without checking results')
def step_impl(context):
    context.pages.import_data_page().click_import_image_button_without_checking_results()

@step('I verified that Prepare Data button is disabled')
def step_impl(context):
    is_prepare_data_enabled = context.pages.import_data_page().is_prepare_data_button_enabled()

    AssertUtil.assert_simple(is_prepare_data_enabled, False)

@step('I verified that Prepare Data button is enabled')
def step_impl(context):
    is_prepare_data_enabled = context.pages.import_data_page().is_prepare_data_button_enabled()

    AssertUtil.assert_simple(is_prepare_data_enabled, True)


@step('I clicked Prepare Data button')
def step_impl(context):
    context.pages.import_data_page().click_prepare_data_button()


@step('I added dossier to Library if not yet added')
def step_impl(context):
    context.pages.import_data_page().add_dossier_to_library()


@step('I displayed details for object number {object_number}')
def step_impl(context, object_number):
    context.pages.import_data_page().show_object_details(object_number)


@step('I verified that copying the details to clipboard works correctly')
def step_impl(context):
    compare_result = context.pages.import_data_page().copy_object_details_to_clipboard_and_verify_if_correct()

    AssertUtil.assert_simple(compare_result, True)


@step('I verified that the details of the first expanded object displayed "{detail_type}" as "{expected_value}"')
def step_impl(context, detail_type, expected_value):
    object_detail_value = context.pages.import_data_page().get_object_detail_value(detail_type)

    AssertUtil.assert_simple(object_detail_value, expected_value)


@step('I closed Import Data popup')
def step_impl(context):
    context.pages.import_data_page().close_import_data_popup()


@step('I clicked Filters button')
def step_impl(context):
    context.pages.import_data_page().click_filters_button()


@step('I clicked Import button and saw error "{error_message}"')
def step_impl(context, error_message):
    context.pages.import_data_page().click_import_button_to_import_with_error(error_message)


@step('I clicked Import button and saw global error "{error_message}"')
def step_impl(context, error_message):
    context.pages.import_data_page().click_import_button_to_import_with_global_error(error_message)


@step('I hovered over the first object in the list')
def step_impl(context):
    context.pages.import_data_page().hover_over_first_object_in_list()


@step('I selected the first object from the list')
def step_impl(context):
    context.pages.import_data_page().select_first_object_from_list()


@step('I verified that the background color of the first object is "{color}"')
def step_impl(context, color):
    found_color = context.pages.import_data_page().find_the_color_of_first_object_in_list()

    AssertUtil.assert_simple(found_color, color)


@step('I verified that Import button is disabled')
def step_impl(context):
    is_disabled = context.pages.import_data_page().verify_if_import_button_is_enabled()

    AssertUtil.assert_simple(is_disabled, False)


@step('I verified that Import button is enabled')
def step_impl(context):
    is_disabled = context.pages.import_data_page().verify_if_import_button_is_enabled()

    AssertUtil.assert_simple(is_disabled, True)

@step('I verified that Import image button is disabled')    
def step_impl(context):
    is_disabled = context.pages.import_data_page().verify_if_import_image_button_is_enabled()

    AssertUtil.assert_simple(is_disabled, False)

@step('I verified that Import image button is enabled')
def step_impl(context):
    is_disabled = context.pages.import_data_page().verify_if_import_image_button_is_enabled()

    AssertUtil.assert_simple(is_disabled, True)

@step('I cleared search box')
def step_impl(context):
    context.pages.import_data_page().clear_search_box()


@step('I clicked header on column "{header}"')
def step_impl(context, header):
    context.pages.import_data_page().click_column_header(header)


@step('verified that objects are sorted "{expected_sort_order}" on column "{header}"')
def step_impl(context, expected_sort_order, header):
    sort_order = context.pages.import_data_page().get_column_header_sort_order(header)

    AssertUtil.assert_simple(sort_order, expected_sort_order)


@step('I scrolled down list of objects by {number} page(s)')
def step_impl(context, number):
    context.pages.import_data_page().scroll_objects_list_by_number_of_pages(number)


@step('I scrolled down list of objects to end')
def step_impl(context):
    context.pages.import_data_page().scroll_objects_list_to_end()


@step('I verified that Filters has "{number}" categories selected')
def step_impl(context, number):
    filters_number = context.pages.import_data_page().get_filters_number()

    AssertUtil.assert_simple(filters_number, number)


@step('I hover over Import button')
def step_impl(context):
    context.pages.import_data_page().hover_over_import_button()


@step('I verified that tooltip for Import button shows message "{expected_tooltip_text}"')
def step_impl(context, expected_tooltip_text):
    tooltip_text = context.pages.import_data_page().get_tooltip_message_for_button()

    AssertUtil.assert_simple(tooltip_text, expected_tooltip_text)


@step('I selected "{selector_name}" for attribute/metric selector')
def step_impl(context, selector_name):
    context.pages.import_data_page().select_attribute_metric_selector_by_name(selector_name)


@step('I verified that details arrow tooltip for object number 1 displays "Show less"')
def step_impl(context):
    tooltip_text = context.pages.import_data_page().get_tooltip_message_for_details_arrow_opened()

    expected_tooltip = "Show less"

    AssertUtil.assert_simple(tooltip_text, expected_tooltip)


@step('I verified that details arrow tooltip for object number 1 displays "Show more"')
def step_impl(context):
    tooltip_text = context.pages.import_data_page().get_tooltip_message_for_details_arrow_closed()

    expected_tooltip = "Show more"

    AssertUtil.assert_simple(tooltip_text, expected_tooltip)


@step('I verified that the Import Data popup show "{expected_view}"')
def step_impl(context,expected_view):
    is_selected = context.pages.import_data_page().verify_if_view_is_selected(expected_view)

    AssertUtil.assert_simple(is_selected, True)

@step('I switched the Import Data popup view to "{expected_view}"')
def step_impl(context,expected_view):
    context.pages.import_data_page().switch_view_to(expected_view)


@step('I found and clicked "{type}" object "{name}" in "{expected_view}"')
def step_impl(context,type,name,expected_view):
    context.pages.import_data_page().library_home_click_on_target_object(type,name,expected_view)


@step('I click on Library icon')
def step_impl(context):
    context.pages.import_data_page().click_on_library_icon()


@step('I switched to Content Discovery')
def step_impl(context):
    context.pages.import_data_page().switch_to_content_discovery()


@step('I switched to project "{project}"')
def step_impl(context,project):
    context.pages.import_data_page().switch_to_project(project)


@step('I clicked on folder "{folder}"')
def step_impl(context,folder):
    context.pages.import_data_page().click_on_folder(folder)

@step('I clicked on back button in data import button')
def step_impl(context):
    context.pages.import_data_page().click_back_button()