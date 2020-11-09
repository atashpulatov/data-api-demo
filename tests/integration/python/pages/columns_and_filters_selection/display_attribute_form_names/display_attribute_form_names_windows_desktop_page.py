from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class DisplayAttributeFormNamesWindowsDesktopPage(BaseWindowsDesktopPage):
    DROPDOWN_BUTTON = '//ComboBox'
    DROPDOWN_ELEMENT = '//List/ListItem[@Name=\"%s\"]'
    DROPDOWN_FIRST_ELEMENT_VALUE = 'Automatic'
    DROPDOWN_FIRST_ELEMENT_COLOR = '#f0f7fe'

    DISPLAY_ATTRIBUTES_FORM_NAMES_LABEL = 'form_names_label'
    MENU_ITEM = "//ListItem[@Name='%s']"

    def select_display_attributes_form_names_element(self, form_visualization_type):
        self.get_element_by_accessibility_id(
            DisplayAttributeFormNamesWindowsDesktopPage.DISPLAY_ATTRIBUTES_FORM_NAMES_LABEL,
            image_name=self.prepare_image_name(
                DisplayAttributeFormNamesWindowsDesktopPage.DISPLAY_ATTRIBUTES_FORM_NAMES_LABEL
            )
        ).click()

        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            DisplayAttributeFormNamesWindowsDesktopPage.MENU_ITEM % form_visualization_type
        ).click()

    def select_first_display_attributes_form_names_element(self):
        self._open_dropdown()

        self.get_element_by_xpath(
            DisplayAttributeFormNamesWindowsDesktopPage.DROPDOWN_ELEMENT %
            DisplayAttributeFormNamesWindowsDesktopPage.DROPDOWN_FIRST_ELEMENT_VALUE
        ).click()

    def get_background_color_of_first_attribute_form_names_element(self):
        self._open_dropdown()

        return DisplayAttributeFormNamesWindowsDesktopPage.DROPDOWN_FIRST_ELEMENT_COLOR

    def _open_dropdown(self):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            DisplayAttributeFormNamesWindowsDesktopPage.DROPDOWN_BUTTON
        ).click()
