import logging
from datetime import date, datetime, timedelta

from celery import shared_task
from django.db.models import Q

from integrations.entsoe_wrapper.errors import BadRequest, NotFound, Unauthorized, Unavailable
from integrations.entsoe_wrapper.parsers import entsoe_generation_per_type_parser
from integrations.entsoe_wrapper.services import fetch_entsoe_data
from modules.countries.models import Country
from modules.country_generation.models import CountryGeneration, GenerationPerType
from power_map import settings

logger = logging.getLogger('power_map')


@shared_task
def update_country_generation(in_date: date, country: str = None):

    params = {
        'securityToken': settings.ENTSOE_SECURITY_TOKEN,
        'documentType': 'A75',
        'processType': 'A16',
        'in_Domain': '',
        'periodStart': datetime.combine(
            in_date, datetime.strptime('00:00', '%H:%M').time()
        ).strftime(settings.ENTSOE_DATETIME_FORMAT),
        'periodEnd': datetime.combine(
            in_date + timedelta(days=1), datetime.strptime('00:00', '%H:%M').time()
        ).strftime(settings.ENTSOE_DATETIME_FORMAT),
    }

    try:
        country = Country.objects.get(Q(name=country) | Q(iso2=country) | Q(iso3=country))
        params['in_Domain'] = settings.ENTSOE_COUNTRY_ZONES.get(country.name, None)
    except Country.DoesNotExist:
        logger.error('Requested Country ({}) does not exist.'.format(country))
        return

    try:
        generation_data = entsoe_generation_per_type_parser(fetch_entsoe_data(params=params))
    except (BadRequest, Unauthorized, NotFound, Unavailable) as exc:
        logger.error('{}: {}'.format(country.name, exc.message))
        return

    country_generation, created = CountryGeneration.objects.get_or_create(country=country, reference_date=in_date)

    hours_covered = generation_data.pop('hours_covered', 0)
    generation_data_keys = list(generation_data.keys())
    generation_per_type_list = []

    if created:
        last_covered = 0
        hour_frame_template = '{}:00 - {}:00'
        frame_start, frame_end = 0, 1
    else:
        last_covered = country_generation.hourly_generation.all().count()
        hour_frame_template = '{}:00 - {}:00'
        frame_start, frame_end = last_covered, last_covered + 1

    for n in range(last_covered, hours_covered):
        types = {}
        hour_frame = hour_frame_template.format(str(frame_start).zfill(2), str(frame_end).zfill(2))
        for key in generation_data_keys:
            types.update({key: generation_data[key].get(hour_frame, 0)})
        generation_per_type_list.append(GenerationPerType(hour_frame=hour_frame, **types))
        frame_start = frame_end
        frame_end += 1

    country_generation.hourly_generation.add(*GenerationPerType.objects.bulk_create(generation_per_type_list))

    return country_generation

