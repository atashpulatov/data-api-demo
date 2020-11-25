from framework.pages_base.element_info import ElementInfo
from framework.util.const import DEFAULT_TIMEOUT


class ElementCheck(ElementInfo):
    def check_if_element_exists_by_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.get_element_info_by_name(selector, timeout, image_name, safe=True) is not None

    def check_if_element_exists_by_css(self, selector, timeout=DEFAULT_TIMEOUT):
        return self.get_element_info_by_css(selector, timeout, safe=True) is not None

    def check_if_element_exists_by_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.get_element_info_by_id(selector, timeout, image_name, safe=True) is not None

    def check_if_element_exists_by_accessibility_id(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.get_element_info_by_mobile_accessibility_id(selector, timeout, image_name, safe=True) is not None

    def check_if_element_exists_by_xpath(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.get_element_info_by_xpath(selector, timeout, image_name, safe=True) is not None

    def check_if_element_exists_by_class_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.get_element_info_by_class_name(selector, timeout, image_name, safe=True) is not None

    def check_if_element_exists_by_tag_name(self, selector, timeout=DEFAULT_TIMEOUT, image_name=None):
        return self.get_element_info_by_tag_name(selector, timeout, image_name, safe=True) is not None
