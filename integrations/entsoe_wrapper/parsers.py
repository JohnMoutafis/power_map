from bs4 import BeautifulSoup

from power_map import settings


def entsoe_error_parser(content):
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')
    return soup.find('Reason').find('text').get_text()


def entsoe_installed_capacity_parser(content):
    """
    Parses ENTSOE Country Capacity Data Response (document A68).

    Args:
        content: ENTSOE response xml content.

    Returns:
        A dictionary with {production_type: capacity} format.
    """
    response = {}
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')
    for entry in soup.find_all('TimeSeries'):
        production_type = entry.find('psrType')
        production_info = entry.find('Point')
        response.update({
            settings.ENTSOE_PRODUCTION_TYPE_MAPPING.get(production_type.get_text(), production_type.get_text()):
            int(production_info.find('quantity').get_text())
        })
    return response
