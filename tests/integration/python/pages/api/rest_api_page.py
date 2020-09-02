import requests

from framework.pages_base.base_page import BasePage
from framework.util.config_util import ConfigUtil

TUTORIAL_PROJECT_ID = "B7CA92F04B9FAE8D941C3E9B7E0CD754"


class RestApiPage(BasePage):
    ENV_URL = 'https://env-%s.customer.cloud.microstrategy.com/MicroStrategyLibrary/api'

    def __init__(self):
        super().__init__()

        self.__env_url = RestApiPage.ENV_URL % ConfigUtil.get_add_in_environment()

    def certify_object(self, object_id, project_id=TUTORIAL_PROJECT_ID):
        self._change_certification_state(object_id, True, project_id)

    def decertify_object(self, object_id, project_id=TUTORIAL_PROJECT_ID):
        self._change_certification_state(object_id, False, project_id)

    def _change_certification_state(self, object_id, certified, project_id=TUTORIAL_PROJECT_ID):
        auth_token, cookies = self._get_auth_token_and_cookies()
        custom_headers = {
            "X-MSTR-AuthToken": auth_token,
            "X-MSTR-ProjectID": project_id,
        }

        # TODO check name
        response = requests.put(
            self.__env_url + '/objects/' + object_id + '/certify?type=3&certify=' + str(certified).lower(),
            headers=custom_headers,
            cookies=cookies
        )

    def is_object_certified(self, object_id, project_id=TUTORIAL_PROJECT_ID):
        auth_token, cookies = self._get_auth_token_and_cookies()
        custom_headers = {
            "X-MSTR-AuthToken": auth_token,
            "X-MSTR-ProjectID": project_id,
        }

        response = requests.get(
            self.__env_url + '/objects/' + object_id + '?type=3',
            headers=custom_headers,
            cookies=cookies
        )
        return response.json()['certifiedInfo']['certified']

    def _get_auth_token_and_cookies(self):
        payload = {
            # TODO config or const
            "username": 'a',
            "password": '',
            "loginMode": 1
        }
        resp = requests.post(
            self.__env_url + '/auth/login',
            data=payload
        )

        auth_token = resp.headers['X-MSTR-AuthToken']
        cookies = resp.cookies

        return auth_token, cookies
