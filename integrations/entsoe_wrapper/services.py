from datetime import datetime, timedelta

import requests

from power_map import settings
from integrations.entsoe_wrapper import errors
from integrations.entsoe_wrapper.http_action_wrappers import perform_fetch_request
from integrations.entsoe_wrapper.parsers import entsoe_error_parser


START_DT = (datetime.now() - timedelta(hours=5))
END_DT = datetime.now()


def fetch_entsoe_data(document_type, process_type='', start_dt=START_DT, end_dt=END_DT):
    params = {
        'securityToken': settings.ENTSOE_SECURITY_TOKEN,
        'documentType': document_type,
        'processType':  process_type,
        'outBiddingZone_Domain': '10YCZ-CEPS-----N',
        # 'in_Domain': '10YCZ-CEPS-----N',
        'periodStart': start_dt.strftime(settings.ENTSOE_DATETIME_FORMAT),
        'periodEnd': end_dt.strftime(settings.ENTSOE_DATETIME_FORMAT)
    }
    try:
        response = perform_fetch_request(url=settings.ENTSOE_BASE_URL, params=params)
    except requests.exceptions.HTTPError as exc:
        if exc.response.status_code == 400:
            raise errors.BadRequest('Parameter Errors Occurred: {}'.format(entsoe_error_parser(exc.response.content)))
        if exc.response.status_code == 401:
            raise errors.Unauthorized('User is Unauthorized.')
        if exc.response.status_code == 404:
            raise errors.NotFound('Endpoint: {} with params: {} not found.'.format(settings.ENTSOE_BASE_URL, params))
        raise errors.Unavailable('An internal error occurred on ENTSO-E\'s endpoint.')

    return response.content
