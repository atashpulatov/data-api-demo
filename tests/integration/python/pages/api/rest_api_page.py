import requests

from framework.pages_base.base_page import BasePage
from framework.util.config_util import ConfigUtil
from framework.util.const import TUTORIAL_PROJECT_ID
from framework.util.exception.MstrException import MstrException


class RestApiPage(BasePage):
    ENV_URL = 'https://env-%s.customer.cloud.microstrategy.com/MicroStrategyLibrary/api'

    HEADER_NAME_AUTH_TOKEN = 'X-MSTR-AuthToken'
    HEADER_NAME_PROJECT_ID = 'X-MSTR-ProjectID'

    REST_API_LOGIN_ENDPOINT = '/auth/login'

    REST_API_OBJECT_INFO_ENDPOINT = '/object/%s/type=3'
    REST_API_OBJECT_CERTIFY_ENDPOINT = '/object/%s/certify?type=3&certify=%s'

    HTTP_RESPONSE_CODE_OK = 200

    def __init__(self):
        super().__init__()

        self.__env_url = RestApiPage.ENV_URL % ConfigUtil.get_add_in_environment()

    def certify_object(self, object_id, project_id=TUTORIAL_PROJECT_ID):
        self._change_certification_state(object_id, True, project_id)

    def decertify_object(self, object_id, project_id=TUTORIAL_PROJECT_ID):
        self._change_certification_state(object_id, False, project_id)

    def _change_certification_state(self, object_id, certify, project_id=TUTORIAL_PROJECT_ID):
        cookies, custom_headers = self._get_cookies_and_headers(project_id)

        url = self.__env_url + RestApiPage.REST_API_OBJECT_CERTIFY_ENDPOINT % (object_id, str(certify).lower())

        response = requests.put(
            url,
            headers=custom_headers,
            cookies=cookies
        )

        if response.status_code != RestApiPage.HTTP_RESPONSE_CODE_OK:
            raise MstrException(f'Error while accessing url: {url}, headers: {custom_headers}, '
                                f'cookies: {cookies}, status: {response.status_code}')

    def is_object_certified(self, object_id, project_id=TUTORIAL_PROJECT_ID):
        cookies, custom_headers = self._get_cookies_and_headers(project_id)

        url = self.__env_url + RestApiPage.REST_API_OBJECT_INFO_ENDPOINT % object_id

        response = requests.get(
            url,
            headers=custom_headers,
            cookies=cookies
        )

        if response.status_code != RestApiPage.HTTP_RESPONSE_CODE_OK:
            raise MstrException(f'Error while accessing url: {url}, headers: {custom_headers}, '
                                f'cookies: {cookies}, status: {response.status_code}')

        return response.json()['certifiedInfo']['certified']

    def _get_cookies_and_headers(self, project_id):
        auth_token, cookies = self._get_auth_token_and_cookies()

        custom_headers = {
            RestApiPage.HEADER_NAME_AUTH_TOKEN: auth_token,
            RestApiPage.HEADER_NAME_PROJECT_ID: project_id,
        }

        return cookies, custom_headers

    def _get_auth_token_and_cookies(self):
        username, password = ConfigUtil.get_add_in_environment_default_credentials()

        payload = {
            'username': username,
            'password': password,
            'loginMode': 1
        }

        url = self.__env_url + RestApiPage.REST_API_LOGIN_ENDPOINT

        response = requests.post(
            url,
            data=payload
        )

        if response.status_code != RestApiPage.HTTP_RESPONSE_CODE_OK:
            raise MstrException(f'Error while accessing url: {url}, payload: {payload}, status: {response.status_code}')

        auth_token = response.headers[RestApiPage.HEADER_NAME_AUTH_TOKEN]
        cookies = response.cookies

        return auth_token, cookies
