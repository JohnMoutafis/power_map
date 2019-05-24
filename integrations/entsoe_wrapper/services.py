import requests

from power_map import settings
from integrations.entsoe_wrapper import errors
from integrations.entsoe_wrapper.http_action_wrappers import perform_fetch_request
from integrations.entsoe_wrapper.parsers import entsoe_error_parser


def fetch_entsoe_data(params):
    """
    Fetches data from ENTSOE for a document specified in the parameters.

    Args:
        params: Request parameters as dictionary.

    Raises:
        errors.BadRequest
        errors.Unauthorized
        errors.NotFound
        errors.Unavailable

    Returns:
        Response content in xml format.
    """
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
