import requests

from framework.util.config_util import ConfigUtil
from framework.pages_base.base_page import BasePage


class RestApiPage(BasePage):

    def __init__(self):
        super().__init__()
        env_number = ConfigUtil.get_add_in_environment()
        self.env_url = 'https://env-' + env_number + '.customer.cloud.microstrategy.com/MicroStrategyLibrary/api'

    def _getAuthTokenAndCookies(self):
        add_in_environment = ConfigUtil.get_add_in_environment()
        payload = {
            "username": 'a',
            "password": '',
            "loginMode": 1
        }
        resp = requests.post(
            self.env_url + '/auth/login',
            data=payload
        )
        auth_token = resp.headers['X-MSTR-AuthToken']
        cookies = resp.cookies
        return auth_token, cookies

    def certify_object(self, object_id, project_id):
        auth_token, cookies = self._getAuthTokenAndCookies()
        custom_headers = {
          "X-MSTR-AuthToken": auth_token,
          "X-MSTR-ProjectID": project_id,
        }
        response = requests.put(
            self.env_url + '/objects/' + object_id + '/certify?type=3&certify=true',
            headers=custom_headers,
            cookies=cookies
        )

    def decertify_object(self, object_id, project_id):
        auth_token, cookies = self._getAuthTokenAndCookies()
        custom_headers = {
          "X-MSTR-AuthToken": auth_token,
          "X-MSTR-ProjectID": project_id,
        }
        response = requests.put(
            self.env_url + '/objects/' + object_id + '/certify?type=3&certify=false',
            headers=custom_headers,
            cookies=cookies
        )

    def is_object_certified(self, object_id, project_id):
        auth_token, cookies = self._getAuthTokenAndCookies()
        custom_headers = {
          "X-MSTR-AuthToken": auth_token,
          "X-MSTR-ProjectID": project_id,
        }
        response = requests.get(
            self.env_url + '/objects/' + object_id + '?type=3',
            headers=custom_headers,
            cookies=cookies
        )
        return response.json()['certifiedInfo']['certified']
