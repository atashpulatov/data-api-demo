import requests

from framework.util.config_util import ConfigUtil
from framework.pages_base.base_page import BasePage


class RestApiPage(BasePage):
    add_in_environment = ConfigUtil.get_add_in_environment()
    envUrl = 'https://env-' + add_in_environment + '.customer.cloud.microstrategy.com/MicroStrategyLibrary/api'
    # envUrl = ''
    userName = 'a'
    password = ''

    def _getAuthTokenAndCookies(self, userName, password):
        payload = {
            "username": userName,
            "password": password,
            "loginMode": 1
        }
        resp = requests.post(
            envUrl + '/auth/login',
            data=payload
        )
        authToken = resp.headers['X-MSTR-AuthToken']
        cookies = resp.cookies
        return authToken, cookies

    def certify_object(self, objectId, projectId):
        authToken, cookies = _getAuthTokenAndCookies(userName, password)
        customHeaders = {
          "X-MSTR-AuthToken": authToken,
          "X-MSTR-ProjectID": "B7CA92F04B9FAE8D941C3E9B7E0CD754"
        }
        response = requests.put(
            envUrl + '/objects/' + objectId + '/certify?type=3&certify=true',
            headers=customHeaders,
            cookies=cookies
        )
    
    # def decertify_object(self, objectId, projectId):
        
