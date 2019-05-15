import logging
from datetime import datetime, date

from celery import shared_task
from django.db.models import Q

from integrations.entsoe_wrapper.errors import BadRequest, Unauthorized, NotFound, Unavailable
from integrations.entsoe_wrapper.parsers import entsoe_generation_forecast_parser, entsoe_wind_solar_forecast_parser
from integrations.entsoe_wrapper.services import fetch_entsoe_data
from modules.countries.models import Country
from modules.country_forecast.models import CountryForecast, GenerationForecast, WindSolarGenerationForecast
from power_map import settings

logger = logging.getLogger('power_map')


@shared_task
def update_country_forecast(in_date, country: str):
    """
    Creates a Country's generation and wind/solar forecast data for a given date.

    Args:
        in_date: A date type object
        country: A country identifier (name, iso2, iso3)

    Returns:
        A CountryForecast instance
    """
    wind_solar_forecast_doc = 'A69'
    params = {
        'securityToken': settings.ENTSOE_SECURITY_TOKEN,
        'documentType': 'A71',
        'processType': 'A01',
        'in_Domain': '',
        'periodStart': datetime.combine(
            in_date, datetime.strptime('00:00', '%H:%M').time()
        ).strftime(settings.ENTSOE_DATETIME_FORMAT),
        'periodEnd': datetime.combine(
            in_date, datetime.strptime('23:00', '%H:%M').time()
        ).strftime(settings.ENTSOE_DATETIME_FORMAT),
    }

    try:
        country = Country.objects.get(Q(name=country) | Q(iso2=country) | Q(iso3=country))
        params['in_Domain'] = settings.ENTSOE_COUNTRY_ZONES.get(country.name, None)
    except Country.DoesNotExist:
        logger.error('Requested Country ({}) does not exist.'.format(country))
        return

    try:
        generation_forecast_data = entsoe_generation_forecast_parser(fetch_entsoe_data(params=params))
    except (BadRequest, Unauthorized, NotFound, Unavailable) as exc:
        logger.error('Generation Forecast for {}: {}'.format(country.name, exc.message))
        generation_forecast_data = None

    try:
        params['documentType'] = wind_solar_forecast_doc
        wind_solar_forecast_data = entsoe_wind_solar_forecast_parser(fetch_entsoe_data(params=params))
    except (BadRequest, Unauthorized, NotFound, Unavailable) as exc:
        logger.error('Wind/Solar Forecast for {}: {}'.format(country.name, exc.message))
        wind_solar_forecast_data = None

    country_forecast, created = CountryForecast.objects.get_or_create(country=country, reference_date=in_date)

    if created:
        hour_frame_template = '{}:00 - {}:00'
        frame_start, frame_end = 0, 1
        forecast_data_keys = ['generation_forecast', 'consumption_forecast']
        wind_solar_forecast_data_keys = ['solar_forecast', 'wind_offshore_forecast', 'wind_onshore_forecast']
        forecast_list = []
        wind_solar_forecast_list = []
        for n in range(25):
            forecast_types = {}
            wind_solar_types = {}
            hour_frame = hour_frame_template.format(str(frame_start).zfill(2), str(frame_end).zfill(2))

            if generation_forecast_data:
                for key in forecast_data_keys:
                    forecast_types.update({key: generation_forecast_data[key].get(hour_frame, 0)})

            if wind_solar_forecast_data:
                for key in wind_solar_forecast_data_keys:
                    wind_solar_types.update({key: wind_solar_forecast_data[key].get(hour_frame, 0)})

            forecast_list.append(GenerationForecast(hour_frame=hour_frame, **forecast_types))
            wind_solar_forecast_list.append(WindSolarGenerationForecast(hour_frame=hour_frame, **wind_solar_types))
            frame_start = frame_end
            frame_end += 1
            frame_end = 0 if frame_end == 24 else frame_end

        country_forecast.forecast.add(*GenerationForecast.objects.bulk_create(forecast_list))
        country_forecast.wind_solar_forecast.add(
            *WindSolarGenerationForecast.objects.bulk_create(wind_solar_forecast_list)
        )

    return country_forecast


@shared_task
def update_countries_forecast():
    """Mass Creation of every Country's Forecast Generation."""
    for country_iso in Country.objects.all().values_list('iso3', flat=True):
        update_country_forecast(date.today(), country_iso)
