import requests

from framework.pages_base.base_page import BasePage
from framework.util.config_util import ConfigUtil
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException


class RestApiPage(BasePage):
    ENV_URL = 'https://env-%s.customer.cloud.microstrategy.com/MicroStrategyLibrary/api'

    HEADER_NAME_AUTH_TOKEN = 'X-MSTR-AuthToken'
    HEADER_NAME_PROJECT_ID = 'X-MSTR-ProjectID'

    REST_API_LOGIN_ENDPOINT = '/auth/login'

    REST_API_OBJECT_INFO_ENDPOINT = '/objects/%s/?type=3'
    REST_API_OBJECT_CERTIFY_ENDPOINT = '/objects/%s/certify?type=3&certify=%s'

    def __init__(self):
        super().__init__()

    def certify_object(self, environment_id, object_id, project_id=Const.TUTORIAL_PROJECT_ID):
        self._change_certification_state(environment_id, object_id, True, project_id)

    def decertify_object(self, environment_id, object_id, project_id=Const.TUTORIAL_PROJECT_ID):
        self._change_certification_state(environment_id, object_id, False, project_id)

    def ensure_object_is_certified(self, environment_id, object_id, project_id=Const.TUTORIAL_PROJECT_ID):
        if not self.is_object_certified(environment_id, object_id, project_id):
            self.certify_object(environment_id, object_id, project_id)

    def ensure_object_is_decertified(self, environment_id, object_id, project_id=Const.TUTORIAL_PROJECT_ID):
        if self.is_object_certified(environment_id, object_id, project_id):
            self.decertify_object(environment_id, object_id, project_id)

    def _change_certification_state(self, environment_id, object_id, certify, project_id=Const.TUTORIAL_PROJECT_ID):
        cookies, custom_headers = self._get_cookies_and_headers(environment_id, project_id)

        url = self._prepare_env_url(environment_id) + \
              RestApiPage.REST_API_OBJECT_CERTIFY_ENDPOINT % (object_id, str(certify).lower())

        response = requests.put(
            url,
            headers=custom_headers,
            cookies=cookies
        )

        if not response.ok:
            raise MstrException(f'Error while accessing url: {url}, headers: {custom_headers}, cookies: {cookies}, '
                                f'status: {response.status_code}, response content: {response.content}')

    def is_object_certified(self, environment_id, object_id, project_id=Const.TUTORIAL_PROJECT_ID):
        cookies, custom_headers = self._get_cookies_and_headers(environment_id, project_id)

        url = self._prepare_env_url(environment_id) + RestApiPage.REST_API_OBJECT_INFO_ENDPOINT % object_id

        response = requests.get(
            url,
            headers=custom_headers,
            cookies=cookies
        )

        if not response.ok:
            self.log_error(response._content)
            raise MstrException(f'Error while accessing url: {url}, headers: {custom_headers}, cookies: {cookies}, '
                                f'status: {response.status_code}, response content: {response.content}')

        return response.json()['certifiedInfo']['certified']

    def _get_cookies_and_headers(self, environment_id, project_id):
        auth_token, cookies = self._get_auth_token_and_cookies(environment_id)

        custom_headers = {
            RestApiPage.HEADER_NAME_AUTH_TOKEN: auth_token,
            RestApiPage.HEADER_NAME_PROJECT_ID: project_id,
        }

        return cookies, custom_headers

    def _get_auth_token_and_cookies(self, environment_id):
        username, password = ConfigUtil.get_add_in_environment_default_credentials()

        payload = {
            'username': username,
            'password': password,
            'loginMode': 1
        }

        url = self._prepare_env_url(environment_id) + RestApiPage.REST_API_LOGIN_ENDPOINT

        response = requests.post(
            url,
            data=payload
        )

        if not response.ok:
            raise MstrException(f'Error while accessing url: {url}, payload: {payload}, status: '
                                f'{response.status_code}, response content: {response.content}')

        auth_token = response.headers[RestApiPage.HEADER_NAME_AUTH_TOKEN]
        cookies = response.cookies

        return auth_token, cookies

    def _prepare_env_url(self, environment_id):
        return RestApiPage.ENV_URL % environment_id
