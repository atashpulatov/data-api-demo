from framework.pages_base.windows_desktop_popup_element_cache import WindowsDesktopMainAddInElementCache


class BaseWindowsDesktopPage(WindowsDesktopMainAddInElementCache):
    def prepare_image_name(self, image_name):
        return '%s_%s' % (self.__class__.__name__, image_name)
