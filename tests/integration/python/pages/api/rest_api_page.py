import requests

from framework.pages_base.base_page import BasePage


class RestApiPage(BasePage):
    def _login_user(self, userName, password):
        # resp = requests.get('https://env-224703.customer.cloud.microstrategy.com/MicroStrategyLibrary/api')
        # print(resp)
        print('test2')
        # return resp

    def certify_object(self, objectId):
        # something = self._login_user('a', '')
        print('test')
        # print(something)
