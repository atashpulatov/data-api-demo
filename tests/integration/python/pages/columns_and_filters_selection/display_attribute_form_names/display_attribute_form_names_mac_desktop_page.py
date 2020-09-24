from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage


class DisplayAttributeFormNamesMacDesktopPage(BaseMacDesktopPage):
    ATTRIBUTE_FORM_DROPDOWN = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[3]/AXComboBox/AXGroup[0]/AXGroup[0]"
    ATTRIBUTE_FORM_DROPDOWN_GROUPS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[%s]"
    ATTRIBUTE_FORM_DROPDOWN_SUFFIX = "/AXList[0]/AXStaticText[@AXTitle='%s']"

    def select_display_attributes_form_names_element(self, visualization_type):
        self.get_element_by_xpath(DisplayAttributeFormNamesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN).click()

        groups_no = self.get_elements_by_xpath(
            DisplayAttributeFormNamesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_GROUPS
        )

        selector_suffix = \
            DisplayAttributeFormNamesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_SUFFIX % visualization_type

        self.get_element_by_xpath_workaround(
            DisplayAttributeFormNamesMacDesktopPage.ATTRIBUTE_FORM_DROPDOWN_GROUPS + selector_suffix,
            expected_list_len=len(groups_no)
        ).click()
