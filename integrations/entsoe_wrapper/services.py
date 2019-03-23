import requests

from euro_energy_flow import settings
from integrations.entsoe_wrapper import errors
from integrations.entsoe_wrapper.http_action_wrappers import perform_fetch_request


def fetch_entsoe_data():
    params = {
        'securityToken': settings.ENTSOE_SECURITY_TOKEN,
        'documentType': 'A65',
        'processType':  'A16',
        'outBiddingZone_Domain': '10YCZ-CEPS-----N',
        'periodStart': 201512312300,
        'periodEnd': 201612312300
    }
    try:
        response = perform_fetch_request(url=settings.ENTSOE_BASE_URL, params=params)
    except requests.exceptions.HTTPError as exc:
        if exc.response.status_code == 400:
            raise errors.BadRequest('Parameter Errors Occurred: {}'.format(exc.response.json()))
        if exc.response.status_code == 401:
            raise errors.Unauthorized('User is Unauthorized.')
        if exc.response.status_code == 404:
            raise errors.NotFound('Endpoint: {} with params: {} not found.'.format(settings.ENTSOE_BASE_URL, params))
        raise errors.Unavailable('An internal error occurred on ENTSO-E\'s endpoint.')

    return response.content
