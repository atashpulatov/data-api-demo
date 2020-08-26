import requests

envUrl = 'https://env-224087.customer.cloud.microstrategy.com/MicroStrategyLibrary/api'

payload = {
  "username": "a",
  "password": "",
  "loginMode": 1
}

# print(envUrl + '/api/auth/login')
resp = requests.post(
  envUrl + '/auth/login',
  data=payload
  )

authToken = resp.headers['X-MSTR-AuthToken']
cookies = resp.cookies

customHeaders = {
  "X-MSTR-AuthToken": authToken,
  "X-MSTR-ProjectID": "B7CA92F04B9FAE8D941C3E9B7E0CD754"
}

# print(customHeaders)

response = requests.get(
  envUrl + '/objects/13CFD83A458A68655A13CBA8D7C62CD5?type=3',
  headers=customHeaders,
  cookies=cookies
)

print(response.json()['certifiedInfo'])

response = requests.put(
  envUrl + '/objects/13CFD83A458A68655A13CBA8D7C62CD5/certify?type=3&certify=true',
  headers=customHeaders,
  cookies=cookies
)

response = requests.get(
  envUrl + '/objects/13CFD83A458A68655A13CBA8D7C62CD5?type=3',
  headers=customHeaders,
  cookies=cookies
)

print(response.json()['certifiedInfo'])

response = requests.put(
  envUrl + '/objects/13CFD83A458A68655A13CBA8D7C62CD5/certify?type=3&certify=false',
  headers=customHeaders,
  cookies=cookies
)

response = requests.get(
  envUrl + '/objects/13CFD83A458A68655A13CBA8D7C62CD5?type=3',
  headers=customHeaders,
  cookies=cookies
)

print(response.json()['certifiedInfo'])
