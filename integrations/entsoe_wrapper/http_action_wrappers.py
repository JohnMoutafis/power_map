import logging
import requests

from integrations.entsoe_wrapper import errors

logger = logging.getLogger('django')


def perform_fetch_request(url, params=None, headers=None):
    """
    Performs a GET request to the provided endpoint.
    Args:
        url:     Endpoint's url.
        params:  Request parameters.
        headers: Request headers.

    Raises:
        errors.Unavailable

    Returns:
        response type object.
    """
    try:
        with requests.session() as session:
            logger.info('Perform GET request at endpoint: {}'.format(url))
            response = session.get(url, params=params, headers=headers)
    except (requests.ConnectionError, requests.Timeout) as exc:
        logger.debug(exc)
        raise errors.Unavailable('Endpoint {} is unavailable'.format(url)) from exc

    response.raise_for_status()
    return response


def perform_post_request(url, payload=None, headers=None):
    """
    Performs a POST request to the provided endpoint.
    Args:
        url:     Endpoint's url.
        payload: Request payload.
        headers: Request headers.

    Raises:
        errors.Unavailable

    Returns:
        Response type object.
    """
    try:
        with requests.session() as session:
            logger.info('Perform POST request at endpoint: {}'.format(url))
            response = session.post(url, headers=headers, data=payload)
    except (requests.ConnectionError, requests.Timeout) as exc:
        logger.debug(exc)
        raise errors.Unavailable('Endpoint {} is unavailable'.format(url)) from exc

    response.raise_for_status()
    return response
