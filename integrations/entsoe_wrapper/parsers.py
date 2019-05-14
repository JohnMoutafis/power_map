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


def entsoe_generation_per_type_parser(content):
    response = {}
    hours_covered = []
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')
    for entry in soup.find_all('TimeSeries'):
        production_type = settings.ENTSOE_PRODUCTION_TYPE_MAPPING.get(
            entry.find('psrType').get_text(), entry.find('psrType').get_text()
        )
        response.update({production_type: {}})
        resolution = entry.find('resolution').get_text()

        hour_frame = '{}:00 - {}:00'
        frame_start, frame_end = 0, 1
        if resolution == 'PT60M':
            for point in entry.find_all('Point'):
                response[production_type].update({
                    hour_frame.format(
                        str(frame_start).zfill(2), str(frame_end).zfill(2)
                    ): int(point.find('quantity').get_text())
                })
                frame_start = frame_end
                frame_end += 1
        elif resolution == 'PT30M':
            i = 0
            points = entry.find_all('Point')
            while i < len(points):
                response[production_type].update({
                    hour_frame.format(
                        str(frame_start).zfill(2), str(frame_end).zfill(2)
                    ): int(points[i].find('quantity').get_text()) + int(points[i+1].find('quantity').get_text())
                })
                frame_start = frame_end
                frame_end += 1
                i += 2
        else:
            continue
        hours_covered.append(frame_end)

    if len(set(hours_covered)) == 1:
        response.update({'hours_covered': hours_covered[0]})
    else:
        response.update({'hours_covered': min(hours_covered)})

    return response
