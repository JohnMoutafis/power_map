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
    """
    Parses ENTSOE Country Generation Data Response (document 75).

    Args:
        content: ENTSOE response xml content.

    Returns:
        A dictionary with {production_type: {hour_frame: generation}} format.
    """
    response = {}
    hours_covered = []
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')
    for entry in soup.find_all('TimeSeries'):
        production_type = settings.ENTSOE_PRODUCTION_TYPE_MAPPING.get(
            entry.find('psrType').get_text(), entry.find('psrType').get_text()
        )
        response.update({production_type: {}})
        resolution = entry.find('resolution').get_text()

        hour_frame = '{}:00'
        current_hour = 0
        if resolution == 'PT60M':
            for point in entry.find_all('Point'):
                response[production_type].update({
                    hour_frame.format(str(current_hour).zfill(2)): int(point.find('quantity').get_text())
                })
                current_hour += 1
                current_hour = 0 if current_hour == 24 else current_hour
        elif resolution == 'PT30M':
            i = 0
            points = entry.find_all('Point')
            while i < len(points):
                try:
                    response[production_type].update({
                        hour_frame.format(
                            str(current_hour).zfill(2)): (
                                int(points[i].find('quantity').get_text()) +
                                int(points[i+1].find('quantity').get_text())
                            )
                    })
                except IndexError:
                    # TODO: This need to be handled better.
                    response[production_type].update({hour_frame.format(str(current_hour).zfill(2)): 0})

                current_hour += 1
                current_hour = 0 if current_hour == 24 else current_hour
                i += 2
        else:
            continue
        hours_covered.append(current_hour)

    if len(set(hours_covered)) == 1:
        response.update({'hours_covered': hours_covered[0]})
    elif len(set(hours_covered)) > 1:
        response.update({'hours_covered': min(hours_covered)})
    else:
        response.update({'hours_covered': 0})

    return response


def entsoe_generation_forecast_parser(content):
    """
    Parses ENTSOE Country Generation Forecast Data Response (document 71).

    Args:
        content: ENTSOE response xml content.

    Returns:
        A dictionary with {
            generation_forecast: {hour_frame: forecast}, consumption_forecast: {hour_frame: forecast}
        } format.
    """
    hour_frame_template = '{}:00'
    current_hour = 0
    response = {'generation_forecast': {}, 'consumption_forecast': {}}
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')
    generation = soup.find_all('TimeSeries')[0]
    generation_points = generation.find_all('Point')
    resolution = generation.find('resolution').get_text()

    try:
        consumption = soup.find_all('TimeSeries')[1]
        consumption_points = consumption.find_all('Point')
    except IndexError:
        consumption_points = None

    if resolution == 'PT60M':
        for n in range(len(generation_points)):
            hour_frame = hour_frame_template.format(str(current_hour).zfill(2))
            response['generation_forecast'].update({
                hour_frame: int(generation_points[n].find('quantity').get_text())
            })
            try:
                response['consumption_forecast'].update({
                    hour_frame: int(consumption_points[n].find('quantity').get_text()) if consumption_points else 0
                })
            except IndexError:
                response['consumption_forecast'].update({hour_frame: 0})

            current_hour += 1
            current_hour = 0 if current_hour == 24 else current_hour
    elif resolution == 'PT30M':
        n = 0
        while n < len(generation_points):
            hour_frame = hour_frame_template.format(str(current_hour).zfill(2))
            response['generation_forecast'].update({
                hour_frame: (
                    int(generation_points[n].find('quantity').get_text()) +
                    int(generation_points[n+1].find('quantity').get_text())
                )
            })
            try:
                response['consumption_forecast'].update({
                    hour_frame: (
                        int(consumption_points[n].find('quantity').get_text()) +
                        int(consumption_points[n+1].find('quantity').get_text())
                    ) if consumption_points else 0
                })
            except IndexError:
                response['consumption_forecast'].update({hour_frame: 0})

            current_hour += 1
            current_hour = 0 if current_hour == 24 else current_hour
            n += 2
    return response


def entsoe_wind_solar_forecast_parser(content):
    """
    Parses ENTSOE Country Wind/Solar Generation Forecast Data Response (document 69).

    Args:
        content: ENTSOE response xml content.

    Returns:
        A dictionary with {
            solar_forecast: {hour_frame: forecast},
            wind_offshore_forecast: {hour_frame: forecast},
            wind_onshore_forecast: {hour_frame: forecast}
        } format.
    """
    hour_frame_template = '{}:00'
    current_hour = 0
    response = {'solar_forecast': {}, 'wind_offshore_forecast': {}, 'wind_onshore_forecast': {}}
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')

    try:
        solar = soup.find(name='psrType', text='B16').find_parent('TimeSeries').find_all('Point')
    except AttributeError:
        solar = []

    try:
        wind_offshore = soup.find(name='psrType', text='B18').find_parent('TimeSeries').find_all('Point')
    except AttributeError:
        wind_offshore = []

    try:
        wind_onshore = soup.find(name='psrType', text='B19').find_parent('TimeSeries').find_all('Point')
    except AttributeError:
        wind_onshore = []

    resolution = soup.find('resolution').get_text()
    if resolution == 'PT60M':
        for n in range(max([len(solar), len(wind_offshore), len(wind_onshore)])):
            hour_frame = hour_frame_template.format(str(current_hour).zfill(2))
            try:
                response['solar_forecast'].update({
                    hour_frame: int(solar[n].find('quantity').get_text()) if solar else 0
                })
            except IndexError:
                response['solar_forecast'].update({hour_frame: 0})

            try:
                response['wind_offshore_forecast'].update({
                    hour_frame: int(wind_offshore[n].find('quantity').get_text()) if wind_offshore else 0
                })
            except IndexError:
                response['wind_offshore_forecast'].update({hour_frame: 0})

            try:
                response['wind_onshore_forecast'].update({
                    hour_frame: int(wind_onshore[n].find('quantity').get_text()) if wind_onshore else 0
                })
            except IndexError:
                response['wind_onshore_forecast'].update({hour_frame: 0})
            current_hour += 1
            current_hour = 0 if current_hour == 24 else current_hour
    elif resolution == 'PT30M':
        n = 0
        while n < max([len(solar), len(wind_offshore), len(wind_onshore)]):
            hour_frame = hour_frame_template.format(str(current_hour).zfill(2))
            try:
                response['solar_forecast'].update({
                    hour_frame: (
                        int(solar[n].find('quantity').get_text()) +
                        int(solar[n+1].find('quantity').get_text())
                    ) if solar else 0
                })
            except IndexError:
                response['solar_forecast'].update({hour_frame: 0})

            try:
                response['wind_offshore_forecast'].update({
                    hour_frame: (
                        int(wind_offshore[n].find('quantity').get_text()) +
                        int(wind_offshore[n+1].find('quantity').get_text())
                    ) if wind_offshore else 0
                })
            except IndexError:
                response['wind_offshore_forecast'].update({hour_frame: 0})

            try:
                response['wind_onshore_forecast'].update({
                    hour_frame: (
                        int(wind_onshore[n].find('quantity').get_text()) +
                        int(wind_onshore[n+1].find('quantity').get_text())
                    ) if wind_onshore else 0
                })
            except IndexError:
                response['wind_onshore_forecast'].update({hour_frame: 0})
            current_hour += 1
            current_hour = 0 if current_hour == 24 else current_hour
            n += 2

    return response
