from framework.pages_base.image_element import ImageElement
from framework.util.config_util import ConfigUtil
from framework.util.exception.MstrException import MstrException
from framework.util.util import Util


class WindowsDesktopWorkaround:
    """
    Workaround for Windows Desktop issues with finding elements.
    """

    __windows_desktop_workaround_enabled = None

    RIGHT_PANEL_ELEM_TYPE = 'ControlType.Custom'
    POPUP_WINDOW_ELEM = '//Window/Window'

    def setup_windows_desktop_workaround(self, enable_workaround):
        Util.log_warning('Setting up Windows Desktop workaround to: %s' % enable_workaround)

        WindowsDesktopWorkaround.__windows_desktop_workaround_enabled = enable_workaround

    def is_windows_desktop_workaround_enabled(self):
        if WindowsDesktopWorkaround is None:
            raise MstrException('Windows Desktop workaround not initialized.')

        return WindowsDesktopWorkaround.__windows_desktop_workaround_enabled

    def focus_on_right_side_panel(self):
        if self.is_windows_desktop_workaround_enabled():
            add_in_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()
            elements = ImageElement.excel_element.get_elements_by_name(add_in_name)

            location = self._find_frame_location(elements)

            ImageElement.excel_element.click(offset_x=location['x'] + 160, offset_y=location['y'] + 20)

    def _find_frame_location(self, elements):
        for element in elements:
            if element.tag_name == WindowsDesktopWorkaround.RIGHT_PANEL_ELEM_TYPE:
                return element.location

        raise MstrException('No custom element')

    def focus_on_popup_window(self):
        if self.is_windows_desktop_workaround_enabled():
            elem = ImageElement.excel_element.get_element_by_xpath(WindowsDesktopWorkaround.POPUP_WINDOW_ELEM)
            location = elem.location

            ImageElement.excel_element.click(offset_x=location['x'] + 100, offset_y=location['y'] + 60)