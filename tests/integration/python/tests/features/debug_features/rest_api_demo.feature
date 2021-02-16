Feature: Rest API demo feature

  Scenario: Certify object
    """
    REST API calling demo.

    To prepare environment url to be called, current implementation assumes environment_id is stored in behave's
    context (context.environment_id).
    It is necessary to initialize Excel ('I initialized Excel' step) and to later call 'I stored environment id' step.

    REST API url is https://env-NNNNNN.customer.cloud.microstrategy.com/MicroStrategyLibrary/api, where NNNNNN
    is environment_id taken from Add-In name (e.g. current_env_RV_NNNNNN).
    """
    Given I initialized Excel

     When I stored environment id in context

      And I ensured object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project is certified
      And I ensured object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project is decertified

     When I certified object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project
     Then object "8B7F2D9611EA9A8C50AA0080EFD55E92" is certified in Tutorial project

     When I decertified object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project
     Then object "8B7F2D9611EA9A8C50AA0080EFD55E92" is not certified in Tutorial project
