from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import MEDIUM_TIMEOUT


class RightPanelTileDetailsWindowsDesktopPage(BaseWindowsDesktopPage):
    TILES_WRAPPER = "//Group[starts-with(@Name,'Imported Data')]/List"
    TILE_ELEM = '//DataItem[%s]'
    TILE_DETAILS = "//Group[preceding-sibling::Button[@Name='Hide Details']]"

    OBJECT_DETAIL_VALUE = "//Text[@Name='%s']/following-sibling::Text[@Name][1]"

    SHOW_DETAILS = 'Show Details'
    HIDE_DETAILS = 'Hide Details'
    SHOW_DETAILS_XPATH = "//Button[@Name='%s']" % SHOW_DETAILS
    HIDE_DETAILS_XPATH = "//Button[@Name='%s']" % HIDE_DETAILS

    PROMPTS_LIST = 'prompt-icon'
    FILTERS_LIST = 'filter-icon'
    ATTRIBUTES_LIST = 'attribute-icon'
    METRICS_LIST = 'metric-icon'

    AUTOMATION_ID_NODE = "//*[@AutomationId='%s']"
    AUTOMATION_ID_CONTAINS_NODE = "//*[contains(@AutomationId,'%s')]"
    AUTOMATION_ID = "AutomationId"

    NAME_LISTS_TO_ACCESSIBILITY_ID = {
        'Prompt': PROMPTS_LIST,
        'Filter': FILTERS_LIST,
        'Attribute': ATTRIBUTES_LIST,
        'Metric': METRICS_LIST
    }

    PROPERTY_VALUE_COLLAPSED = "//Image[@AutomationId='%s']/parent::Image/following-sibling::Button" \
                               "[starts-with(@Name, '...')]"

    LOCATION_VALUE_COLLAPSED = '//Text[@Name="Location"]/following-sibling::Button[@Name="..."]'

    OBJECT_ID = 'ID'
    OBJECT_OWNER = 'Owner'
    OBJECT_LOCATION = 'Location'
    OBJECT_TOTALS_AND_SUBTOTALS = 'Totals and Subtotals'

    TOTALS_AND_SUBTOTALS_ON = 'ON'

    CERTIFIED_BY = 'Certified by '

    PROMPTS_ANSWERS = 'Prompts answers'
    SELECTED_ATTRIBUTES = 'Selected attributes'
    SELECTED_METRICS = 'Selected metrics'
    SELECTED_FILTERS = 'Selected filters'

    NAME_LISTS_TO_STRING = {
        'Prompt': PROMPTS_ANSWERS,
        'Attribute': SELECTED_ATTRIBUTES,
        'Metric': SELECTED_METRICS,
        'Filter': SELECTED_FILTERS
    }

    LEFT_TO_RIGHT_MARK = '\u200e'

    def click_toggle_details_button(self, object_number):
        self._get_toggle_details_button(object_number).click()

    def hover_over_toggle_details_button(self, object_number):
        self._get_toggle_details_button(object_number).move_to()

    def _get_toggle_details_button(self, object_number):
        tile_element_selector = self._get_tile_element_selector(object_number)

        show_details_selector = tile_element_selector + RightPanelTileDetailsWindowsDesktopPage.SHOW_DETAILS_XPATH
        hide_details_selector = tile_element_selector + RightPanelTileDetailsWindowsDesktopPage.HIDE_DETAILS_XPATH

        return self.get_element_by_xpath(show_details_selector + "|" + hide_details_selector)

    def click_name_list_expand_button(self, object_number, name_list_type):
        property_value_collapsed_selector = self._get_property_value_collapsed_selector(name_list_type)

        selector = self._get_tile_element_selector(object_number) + property_value_collapsed_selector

        self.get_element_by_xpath(selector).click()

    def click_object_location_expand_button(self, object_number):
        selector = self._get_tile_details_container_selector(object_number) \
                   + RightPanelTileDetailsWindowsDesktopPage.LOCATION_VALUE_COLLAPSED

        self.get_element_by_xpath(selector).click()

    def is_object_is_certified(self, object_number):
        return self._get_object_list_property_value_merged(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.CERTIFIED_BY
        ) is not None

    def name_list_exists_on_object(self, object_number, name_list_type):
        return self.get_object_list_property_value(object_number, name_list_type) is not None

    def collapsed_name_list_exists_on_object(self, object_number, name_list_type):
        property_value_collapsed_selector = self._get_property_value_collapsed_selector(name_list_type)

        selector = self._get_tile_details_container_selector(object_number) + property_value_collapsed_selector

        return self.check_if_element_exists_by_xpath(
            selector, image_name=self.prepare_image_name(selector)
        )

    def _get_property_value_collapsed_selector(self, name_list_type):
        accessibility_id = RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_ACCESSIBILITY_ID[name_list_type]

        return RightPanelTileDetailsWindowsDesktopPage.PROPERTY_VALUE_COLLAPSED % accessibility_id

    def collapsed_location_exists_on_object(self, object_number):
        selector = self._get_tile_details_container_selector(object_number) \
                   + RightPanelTileDetailsWindowsDesktopPage.LOCATION_VALUE_COLLAPSED

        return self.check_if_element_exists_by_xpath(selector, image_name=self.prepare_image_name(selector))

    def get_object_list_property_value(self, object_number, name_list_type):
        return self._get_object_list_property_value(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_STRING[name_list_type]
        )

    def is_details_panel_displayed_on_object(self, object_number):
        object_tile = self.get_element_by_xpath(self._get_tile_element_selector(object_number))

        return not object_tile.check_if_element_exists_by_name(
            RightPanelTileDetailsWindowsDesktopPage.SHOW_DETAILS,
            timeout=MEDIUM_TIMEOUT
        )

    def get_toggle_details_tooltip_text(self, object_number):
        """
        Gets toggle details tooltip text, for Windows Desktop it doesn't work as expected and returns hardcoded message
        based on checking if details panel is displayed.

        Currently tooltip is not present in page source and can't be verified.

        :param object_number: Number of object to check tooltip on.

        :return: 'Show Details' or 'Hide Details' based on details panel visibility.
        """

        if self.is_details_panel_displayed_on_object(object_number):
            return RightPanelTileDetailsWindowsDesktopPage.HIDE_DETAILS
        else:
            return RightPanelTileDetailsWindowsDesktopPage.SHOW_DETAILS

    def get_object_id(self, object_number):
        return self._get_object_list_property_value_merged(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.OBJECT_ID
        )

    def get_object_owner(self, object_number):
        return self._get_object_list_property_value_merged(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.OBJECT_OWNER
        )

    def get_object_location(self, object_number):
        return self._get_object_list_property_value_merged(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.OBJECT_LOCATION
        )

    def is_totals_and_subtotals_on(self, object_number):
        return self._get_object_list_property_value_merged(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.TOTALS_AND_SUBTOTALS_ON
        ) is not None

    def _get_object_list_property_value(self, object_number, detail_name):
        names_and_values = self._get_object_list_property_names_and_values(object_number)

        name_list_type_index = names_and_values.index(detail_name)

        # names_and_values[name_list_type_index + 1] contains value of property.
        return names_and_values[name_list_type_index + 1] if len(names_and_values) > 1 else None

    def _get_object_list_property_value_merged(self, object_number, detail_name):
        """
        Gets list of values for properties for which property name and property values are merged in one item
        in page source.

        :param object_number: Number of object to get list of values from.
        :param detail_name: Name of object details to get.

        :return: List of values for a given detail name.
        """
        names_and_values = self._get_object_list_property_names_and_values(object_number)

        detail_value_list = [
            name_value.replace(detail_name, "") for name_value in names_and_values if name_value.startswith(detail_name)
        ]

        return detail_value_list[0] if len(detail_value_list) > 0 else None

    def _get_object_list_property_names_and_values(self, object_number):
        """
        Gets list of object properties names and values

        :param object_number: Number of object to get names and values from.

        :return: List containing names and values of object's properties, odd items contain names, even items values.
        """

        details_container_name = self.get_element_by_xpath(
            self._get_tile_details_container_selector(object_number)
        ).get_name_by_attribute()

        details_data_list = details_container_name.splitlines()

        details_data_list_cleaned = [
            detail_data.replace(RightPanelTileDetailsWindowsDesktopPage.LEFT_TO_RIGHT_MARK, '')
            for detail_data in details_data_list if not ''
        ]

        return details_data_list_cleaned

    def _get_tile_details_container_selector(self, object_number):
        return self._get_tile_element_selector(object_number) + RightPanelTileDetailsWindowsDesktopPage.TILE_DETAILS

    def _get_tile_element_selector(self, object_number):
        tile_elem_selector = RightPanelTileDetailsWindowsDesktopPage.TILE_ELEM % object_number

        return RightPanelTileDetailsWindowsDesktopPage.TILES_WRAPPER + tile_elem_selector
