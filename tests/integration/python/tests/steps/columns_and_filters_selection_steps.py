from behave import *

from framework.util.assert_util import AssertUtil


@step('I verified that Columns & Filters Selection is visible')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().ensure_columns_and_filters_selection_is_visible()


@step('I verified popup title is "{title}"')
def step_impl(context, title):
    context.pages.columns_and_filters_selection_page().ensure_popup_title_is_correct(title)


@step('I verified that counter of "{item_type}" shows "{number}" of "{of_number}" selected')
def step_impl(context, number, of_number, item_type):
    context.pages.columns_and_filters_selection_page().ensure_item_selection(item_type, number, of_number)


@step('I clicked attribute "{attribute_name}"')
def step_impl(context, attribute_name):
    context.pages.columns_and_filters_selection_page().click_attribute(attribute_name)


@step('I clicked attribute "{attribute_name}" for dataset')
def step_impl(context, attribute_name):
    context.pages.columns_and_filters_selection_page().click_attribute_for_dataset(attribute_name)


@step('I clicked metric "{metric_name}"')
def step_impl(context, metric_name):
    context.pages.columns_and_filters_selection_page().click_metric(metric_name)


@step('I set Display attribute form names to "{form_visualization_type}"')
def step_impl(context, form_visualization_type):
    context.pages.columns_and_filters_selection_page().select_display_attributes_form_names_element(
        form_visualization_type
    )


@step('I selected the first option from Display attribute form names')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().select_first_display_attributes_form_names_element()


@step('I verified that the background color of the first option in Display attribute form names is "{color}"')
def step_impl(context, color):
    found_color = context.pages.columns_and_filters_selection_page(). \
        get_background_color_of_first_attribute_form_names_element()

    AssertUtil.assert_simple(found_color, color)


@step('I selected all attributes')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().select_all_attributes()


@step('I unselected all attributes')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().unselect_all_attributes()


@step('I selected all metrics')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().select_all_metrics()


@step('I unselected all metrics')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().unselect_all_metrics()


@step('I selected filter "{filter}" with all elements')
def step_impl(context, filter):
    context.pages.columns_and_filters_selection_page().select_all_filter_elements(filter)


@step('I ensured attribute is selected and I clicked forms {attributes_and_forms_json}')
def step_impl(context, attributes_and_forms_json):
    context.pages.columns_and_filters_selection_page().ensure_attribute_is_selected_and_click_forms(
        attributes_and_forms_json
    )


@step('attribute number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_attribute_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('metric number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_metric_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('filter number {object_number} should be called "{expected_name}"')
def step_impl(context, object_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_filter_name(object_number)

    AssertUtil.assert_simple(result, expected_name)


@step('I changed sort order of "{object_type}" to ascending by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().sort_elements_ascending_by_click(object_type)


@step('I changed sort order of "{object_type}" to descending by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().sort_elements_descending_by_click(object_type)


@step('I changed sort order of "{object_type}" to default by click')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().sort_elements_default_by_click(object_type)


@step('I searched for element called "{element_name}"')
def step_impl(context, element_name):
    context.pages.columns_and_filters_selection_page().search_for_element(element_name)


@step('I cleared the search for element')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().clear_search_element()


@step('I cleared the search for element with backspace')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().clear_element_search_with_backspace()


@step('I pressed tab until sorting "{object_type}" is focused')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_tab_until_object_type_focused(object_type)


@step('I changed sort order of "{object_type}" to ascending by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_enter_to_sort_element_ascending(object_type)


@step('I changed sort order of "{object_type}" to descending by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_enter_to_sort_element_descending(object_type)


@step('I changed sort order of "{object_type}" to default by pressing Enter')
def step_impl(context, object_type):
    context.pages.columns_and_filters_selection_page().press_enter_to_sort_element_default(object_type)


@step('I selected "{object_type}" element number {object_number}')
def step_impl(context, object_type, object_number):
    context.pages.columns_and_filters_selection_page().select_element_by_number(object_type, object_number)


@step('I deselected "{object_type}" element number {object_number}')
def step_impl(context, object_type, object_number):
    context.pages.columns_and_filters_selection_page().select_element_by_number(object_type, object_number)


@step('I expanded attribute forms of attribute number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_page().expand_attribute_form(object_number)


@step('I collapsed attribute forms of attribute number {object_number}')
def step_impl(context, object_number):
    context.pages.columns_and_filters_selection_page().collapse_attribute_form(object_number)


@step('attribute form number {attribute_form_number} of attribute number {attribute_number} '
      'should be called "{expected_name}"')
def step_impl(context, attribute_form_number, attribute_number, expected_name):
    result = context.pages.columns_and_filters_selection_page().get_attribute_form_name(
        attribute_form_number,
        attribute_number
    )
    AssertUtil.assert_simple(result, expected_name)


@step('I scrolled into "{object_type}" element number {object_number}')
def step_impl(context, object_type, object_number):
    context.pages.columns_and_filters_selection_page().scroll_into_object_by_number(object_number, object_type)


@step('I clicked Import button in Columns and Filters Selection')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button()

@step('I clicked Import button in Columns and Filters Selection without success check')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button_without_success_check()


@step('I clicked Import button in Columns and Filters Selection to duplicate object')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_import_button_to_duplicate()


@step('I clicked Back button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_back_button()


@step('I clicked Cancel button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_cancel_button()


@step('I selected filters {filters_and_elements_json}')
def step_impl(context, filters_and_elements_json):
    context.pages.columns_and_filters_selection_page().select_filter_elements(filters_and_elements_json)


@step('I closed popup window')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().close_popup_window()


@step('I hovered over first filter')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().hover_over_first_filter()


@step('I selected the first filter')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().select_first_filter()


@step('I verified that the background color of the first filter is "{color}"')
def step_impl(context, color):
    found_color = context.pages.columns_and_filters_selection_page().get_background_color_of_first_filter()

    AssertUtil.assert_simple(found_color, color)


@step('I clicked Include Subtotals and Totals switch')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_include_totals_and_subtotals()


@step('I clicked Data Preview button')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_data_preview()


@step('I clicked Close Data Preview')
def step_impl(context):
    context.pages.columns_and_filters_selection_page().click_close_data_preview()
