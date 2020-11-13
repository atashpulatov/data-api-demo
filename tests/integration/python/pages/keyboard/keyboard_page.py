from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_page import BasePage


class KeyboardPage(BasePage):
    MAP_NAME_TO_KEY = {
        'Tab': Keys.TAB,
        'Arrow Up': Keys.ARROW_UP,
        'Arrow Right': Keys.ARROW_RIGHT,
        'Arrow Down': Keys.ARROW_DOWN,
        'Arrow Left': Keys.ARROW_LEFT,
        'Enter': Keys.ENTER,
        'Esc': Keys.ESCAPE,
    }

    def press_key(self, key_name):
        self.send_keys(KeyboardPage.MAP_NAME_TO_KEY[key_name])
