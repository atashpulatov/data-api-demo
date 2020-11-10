from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class DisplayAttributeFormNamesWindowsDesktopPage(BaseWindowsDesktopPage):
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
