from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception import MstrException


class FilterPanelWindowsDesktopPage(BaseWindowsDesktopPage):
    OWNER_ALL_PANEL = '//Button[@AutomationId=\"owners-expand-btn\"]'

    ELEMENT_FROM_CATEGORY = '//Text[@Name=\"%s\"]/following-sibling::Button[1]' \
                            '//CheckBox[@AutomationId=\"%s\"]'

    ALL_PANEL_EMPTY_ELEMENT = '//Text[@Name=\"0\"][1]/preceding-sibling::Text[2]/CheckBox[1]'
    SELECT_ALL_WITHIN_ALL_PANEL = '//Button[@Name=\"Select All\"]'
    ALL_PANEL_FIRST_CHECKBOX = '//Button[starts-with(@Name, \"Filters\")]//Group/Text[1]/CheckBox[1]'
    VIEW_SELECTED_SWITCH_ALL_PANEL = '//Button[starts-with(@Name, \"Filters\")]' \
                                     '//Group[@AutomationId=\"mstr-switch-toggle\"]'

    SEARCH_INPUT = '//Edit[@Name=\"Search...\"]'

    APPLICATIONS_FIRST_CHECKBOX = '//Button[starts-with(@Name, \"Filters\")]/Button[2]/Text[1]/CheckBox'
    APPLICATIONS_ALL_PANEL = '//Button[@AutomationId=\"applications-expand-btn\"]'

    TYPES_REPORT_CHECKBOX = '//CheckBox[@AutomationId=\"Report\"]'
    TYPES_DATASET_CHECKBOX = '//CheckBox[@AutomationId=\"Dataset\"]'
    TYPES_DOSSIER_CHECKBOX = '//CheckBox[@AutomationId=\"Dossier\"]'
    CERTIFIED_CHECKBOX = '//CheckBox[@AutomationId=\"Certified\"]'

    OWNERS_FIRST_CHECKBOX = '//Button[starts-with(@Name,\"Administrator\")]/Text/CheckBox'

    MAP_ELEMENT_NAME_TO_SELECTOR = {
        'View Selected switch': VIEW_SELECTED_SWITCH_ALL_PANEL,
        'Select All button in All Panel': SELECT_ALL_WITHIN_ALL_PANEL,
        'Search input': SEARCH_INPUT,
        'first checkbox in All Panel': ALL_PANEL_FIRST_CHECKBOX,
        'first checkbox in Applications': APPLICATIONS_FIRST_CHECKBOX,
        'Applications All button': APPLICATIONS_ALL_PANEL,
        'checkbox for Report': TYPES_REPORT_CHECKBOX,
        'checkbox for Dataset': TYPES_DATASET_CHECKBOX,
        'checkbox for Dossier': TYPES_DOSSIER_CHECKBOX,
        'checkbox for Certified': CERTIFIED_CHECKBOX,
        'first checkbox in Owners': OWNERS_FIRST_CHECKBOX,
        'Owners All button': OWNER_ALL_PANEL,
    }

    def __init__(self):
        super().__init__()

    def click_owner_all_panel(self):
        add_in_main_element = self.get_add_in_main_element()
        add_in_main_element.get_element_by_xpath(self.OWNER_ALL_PANEL).click()

    def click_select_all_within_all_panel(self):
        self.get_element_by_xpath(
            self.SELECT_ALL_WITHIN_ALL_PANEL,
            image_name=self.prepare_image_name(FilterPanelWindowsDesktopPage.SELECT_ALL_WITHIN_ALL_PANEL)
        ).click()

    def click_element_from_list(self, category, element):
        add_in_main_element = self.get_add_in_main_element()
        element = add_in_main_element.get_element_by_xpath(
            FilterPanelWindowsDesktopPage.ELEMENT_FROM_CATEGORY % (category, element)
        )

        if element is not None:
            element.click()
            return

        raise MstrException(f'No element found for category: {category} and element: {element}, '
                            f'selector: {FilterPanelWindowsDesktopPage.ELEMENT_FROM_CATEGORY % (category, element)}')

    def get_all_panel_first_empty_element(self):
        return self.get_element_by_xpath(FilterPanelWindowsDesktopPage.ALL_PANEL_EMPTY_ELEMENT)

    def click_all_panel_first_empty_element(self):
        return self.get_all_panel_first_empty_element().click()

    def examine_if_first_empty_element_is_checked(self):
        element = self.get_element_by_xpath(
            FilterPanelWindowsDesktopPage.ALL_PANEL_EMPTY_ELEMENT
        )

        if element is not None:
            return element.is_selected()

        raise MstrException(f'No element found for selector: {FilterPanelWindowsDesktopPage.ALL_PANEL_EMPTY_ELEMENT}')

    def examine_if_element_has_focus(self, element_name):
        element = self.get_element_by_xpath(
            FilterPanelWindowsDesktopPage.MAP_ELEMENT_NAME_TO_SELECTOR[element_name]
        )

        if element is not None:
            return element == self.get_element_with_focus()

        raise MstrException(f'No element found for {element_name}, '
                            f'selector: {FilterPanelWindowsDesktopPage.MAP_ELEMENT_NAME_TO_SELECTOR[element_name]}')
