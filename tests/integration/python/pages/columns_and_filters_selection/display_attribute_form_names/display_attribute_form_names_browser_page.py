from framework.pages_base.base_browser_page import BaseBrowserPage


class DisplayAttributeFormNamesBrowserPage(BaseBrowserPage):
    ATTRIBUTE_FORM_DROPDOWN = '.ant-select-selection--single'
    ATTRIBUTE_FORM_DROP_DOWN_ITEM = '.ant-select-dropdown-menu-item'

    def select_display_attributes_form_names_element(self, form_visualization_type):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(DisplayAttributeFormNamesBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        self.find_element_by_text_in_elements_list_by_css(
            DisplayAttributeFormNamesBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM, form_visualization_type)

    def select_first_display_attributes_form_names_element(self):
        self.get_element_by_css(DisplayAttributeFormNamesBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        self.get_element_by_css(DisplayAttributeFormNamesBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM).click()

    def get_background_color_of_first_attribute_form_names_element(self):
        self.get_element_by_css(DisplayAttributeFormNamesBrowserPage.ATTRIBUTE_FORM_DROPDOWN).click()

        element = self.get_element_by_css(DisplayAttributeFormNamesBrowserPage.ATTRIBUTE_FORM_DROP_DOWN_ITEM)

        return element.get_background_color()
