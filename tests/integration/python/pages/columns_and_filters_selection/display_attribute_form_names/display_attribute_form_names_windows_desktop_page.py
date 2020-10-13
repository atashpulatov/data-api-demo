from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class DisplayAttributeFormNamesWindowsDesktopPage(BaseWindowsDesktopPage):
    DROPDOWN_ELEM = '//Button/ComboBox'

    # TODO use form_visualization_type
    def select_display_attributes_form_names_element(self, form_visualization_type):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            DisplayAttributeFormNamesWindowsDesktopPage.DROPDOWN_ELEM
        ).click()
