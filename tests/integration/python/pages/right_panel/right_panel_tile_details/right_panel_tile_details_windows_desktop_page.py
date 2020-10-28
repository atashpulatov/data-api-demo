from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT


class RightPanelTileDetailsWindowsDesktopPage(BaseWindowsDesktopPage):

    TILES_WRAPPER = '//Group[starts-with(@Name,"Imported Data")]/List'
    TILE_ELEM = '//DataItem[%d]'
    SHOW_DETAILS = "Show Details"
    HIDE_DETAILS = "Hide Details"

    PROMPTS_LIST = 'prompt-icon'
    FILTERS_LIST = 'filter-icon'
    ATTRIBUTES_LIST = 'attribute-icon'
    METRICS_LIST = 'metric-icon'

    IMAGE_NODE = "//Image[@AutomationId='%s']"

    ALL_IMAGE_NODE_LIST = "|".join([IMAGE_NODE % PROMPTS_LIST, IMAGE_NODE % ATTRIBUTES_LIST, IMAGE_NODE % METRICS_LIST, IMAGE_NODE % FILTERS_LIST])

    NAME_LISTS_TO_ACCESSIBILITY_ID = {
        'Prompt': PROMPTS_LIST,
        'Filter': FILTERS_LIST,
        'Attribute': ATTRIBUTES_LIST,
        'Metric': METRICS_LIST
    }

    PROPERTY_VALUE_TEXT = "//Image/parent::Image/following-sibling::Text[not(following-sibling::Image/Image[@AutomationId='%s']) and following-sibling::Image/Image[@Name=%s] and not(preceding-sibling::Text[@Name= 'Table Size']) and not(@Name='Table Size')]"

    PROPERTY_VALUE_COLLAPSED = "//Image[@AutomationId = '%s']/parent::Image/following-sibling::Button[ends-with(@Name, '+1')]"

    LOCATION_VALUE_COLLAPSED = '//Text[@Name="Location"]/following-sibling::Button[@Name="..."]'

    OBJECT_DETAIL_VALUE = '//Text[@Name="%s"]/following-sibling::Text[@Name][1]'

    OBJECT_ID = "ID"

    OBJECT_OWNER = "OWNER"

    OBJECT_TOTALS_AND_SUBTOTALS = 'Totals and Subtotals'

    TOTALS_AND_SUBTOTALS_ON = "ON"

    CERTIFIED = "certified"

    TILE_DETAILS = "//Group[preceding-sibling::Button[@Name='Hide Details']|Button[@Name='Show Details']]"

    def click_name_list_expand_button(self, object_number, name_list_type):
        tile_details = self._get_tile_details_container(object_number)
        return tile_details.get_element_by_xpath(
            RightPanelTileDetailsWindowsDesktopPage.PROPERTY_VALUE_COLLAPSED % RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_ACCESSIBILITY_ID[
                name_list_type]
        ).click()

    def click_object_location_expand_button(self, object_number):
        tile_details = self._get_tile_details_container(object_number)
        tile_details.get_element_by_xpath(RightPanelTileDetailsWindowsDesktopPage.LOCATION_VALUE_COLLAPSED).click()

    def is_object_is_certified(self, object_number):
        tile_details = self._get_tile_details_container(object_number)
        return tile_details.check_if_element_exists_by_accessibility_id(RightPanelTileDetailsWindowsDesktopPage.CERTIFIED, image_name=self.prepare_image_name(RightPanelTileDetailsWindowsDesktopPage.CERTIFIED))

    def name_list_exists_on_object(self, object_number, name_list_type):
        tile_details = self._get_tile_details_container(object_number)
        return tile_details.check_if_element_exists_by_accessibility_id(RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_ACCESSIBILITY_ID[name_list_type], image_name=self.prepare_image_name(RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_ACCESSIBILITY_ID[name_list_type]))

    def collapsed_name_list_exists_on_object(self, object_number, name_list_type):
        tile_details = self._get_tile_details_container(object_number)
        selector = RightPanelTileDetailsWindowsDesktopPage.PROPERTY_VALUE_COLLAPSED % RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_ACCESSIBILITY_ID[name_list_type]
        return tile_details.check_if_element_exists_by_xpath(
            selector, image_name=self.prepare_image_name(selector)
        )

    def collapsed_location_exists_on_object(self, object_number):
        tile_details = self._get_tile_details_container(object_number)

        return tile_details.check_if_element_exists_by_xpath(RightPanelTileDetailsWindowsDesktopPage.LOCATION_VALUE_COLLAPSED, image_name=self.prepare_image_name(RightPanelTileDetailsWindowsDesktopPage.LOCATION_VALUE_COLLAPSED))

    def click_toggle_details_button(self, object_number):
        self._get_toggle_details_button(object_number).click()

    def hover_over_toggle_details_button(self, object_number):
        self._get_toggle_details_button(object_number).move_to()

    def is_details_panel_displayed_on_object(self, object_number):
        object_tile = self._get_object_by_index(object_number)

        return not object_tile.check_if_element_exists_by_name(RightPanelTileDetailsWindowsDesktopPage.SHOW_DETAILS)

    def get_toggle_details_tooltip_text(self, object_number):
        # TODO Details tooltip does not appear in the page source. For now, no-op
        if self.is_details_panel_displayed_on_object(object_number):
          return RightPanelTileDetailsWindowsDesktopPage.HIDE_DETAILS
        else:
          return RightPanelTileDetailsWindowsDesktopPage.SHOW_DETAILS

    def get_object_list_property_value(self, object_number, name_list_type):
        tile_details_container = self._get_tile_details_container(object_number)

        types = [type_element.get_attribute("AutomationId") for type_elements in tile_details_container.get_elements_by_xpath(RightPanelTileDetailsWindowsDesktopPage.ALL_IMAGE_NODE_LIST)]

        self.log_error("Types len: " + str(len(types)))

        name_list_type_index = types.index(RightPanelTileDetailsWindowsDesktopPage.NAME_LISTS_TO_ACCESSIBILITY_ID[name_list_type])

        next_name_list_type = types[name_list_type_index + 1] if name_list_type_index < len(types) -1 else ""

        property_value_part_elements = tile_details_container.get_elements_by_xpath(
            RightPanelTileDetailsWindowsDesktopPage.PROPERTY_VALUE_TEXT % (name_list_type, next_name_list_type)
        )

        property_values_string = "".join([property_value_part_element.get_name_by_attribute() for property_value_part_element in property_value_part_elements])

        self.log_error("PROP_VALUE STRING: " + property_values_string)
        
        return property_values_string

    def _get_object_by_index(self, object_number):
        tiles_wrapper = self.get_element_by_xpath(RightPanelTileDetailsWindowsDesktopPage.TILES_WRAPPER, image_name=self.prepare_image_name(RightPanelTileDetailsWindowsDesktopPage.TILES_WRAPPER))

        return tiles_wrapper.get_element_by_xpath(RightPanelTileDetailsWindowsDesktopPage.TILE_ELEM % int(object_number))

    def _get_toggle_details_button(self, object_number):
        object_tile = self._get_object_by_index(object_number)
        return object_tile.get_element_by_name(RightPanelTileDetailsWindowsDesktopPage.SHOW_DETAILS)
    
    def get_object_id(self, object_number):
        return self._get_object_detail(object_number, RightPanelTileDetailsWindowsDesktopPage.OBJECT_ID)

    def get_object_owner(self, object_number):
        return self._get_object_detail(object_number, RightPanelTileDetailsWindowsDesktopPage.OBJECT_OWNER)

    def get_object_location(self, object_number):
        return self._get_object_detail(object_number, RightPanelTileDetailsWindowsDesktopPage.OBJECT_LOCATION)

    def is_totals_and_subtotals_on(self, object_number):
        totals_and_subtotals_value = self._get_object_detail(
            object_number,
            RightPanelTileDetailsWindowsDesktopPage.OBJECT_TOTALS_AND_SUBTOTALS_VALUE
        )

        return totals_and_subtotals_value == RightPanelTileDetailsWindowsDesktopPage.TOTALS_AND_SUBTOTALS_ON

    def _get_object_detail(self, object_number, selector):
        return self._get_tile_details_container(object_number).get_element_by_xpath(selector)

    def _get_tile_details_container(self, object_number):
        tile = self._get_object_by_index(object_number)

        return tile.get_element_by_xpath(RightPanelTileDetailsWindowsDesktopPage.TILE_DETAILS)
