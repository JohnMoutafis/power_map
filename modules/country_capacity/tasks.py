import logging
from datetime import datetime

from celery import shared_task
from django.db.models import Q

from integrations.entsoe_wrapper.errors import BadRequest, Unauthorized, NotFound, Unavailable
from integrations.entsoe_wrapper.parsers import entsoe_installed_capacity_parser
from integrations.entsoe_wrapper.services import fetch_entsoe_data
from modules.countries.models import Country
from modules.country_capacity.models import CountryCapacity
from power_map import settings

logger = logging.getLogger('django')


@shared_task
def update_country_capacity(year=None, country='all'):
    """
    Updates the given country's installed capacity info for a given year.

    Args:
        year:    Year in standard format (4 digit string)
        country: A country identifier (name, iso2, iso3 or all for every country)
    """
    year = year if year else datetime.now().year
    params = {
        'securityToken': settings.ENTSOE_SECURITY_TOKEN,
        'documentType': 'A68',
        'processType': 'A33',
        'in_Domain': '',
        'periodStart': f'{year}01312300',
        'periodEnd': f'{year}12312300'
    }

    if country == 'all':
        country_list = []
        excluded_countries = CountryCapacity.objects.filter(reference_year=year).values_list('country', flat=True)
        for country in Country.objects.all().exclude(id__in=excluded_countries):
            try:
                params['in_Domain'] = settings.ENTSOE_COUNTRY_ZONES.get(country.name, None)
                capacity_data = entsoe_installed_capacity_parser(fetch_entsoe_data(params=params))
            except (BadRequest, Unauthorized, NotFound, Unavailable) as exc:
                logger.error('{}: {}'.format(country.name, exc.message))
                capacity_data = {}

            country_list.append(
                CountryCapacity(
                    country=country, reference_year=year, total_capacity=sum(capacity_data.values()), **capacity_data
                )
            )
        CountryCapacity.objects.bulk_create(country_list)
        logger.info('Countries Capacity data for year {} updated.'.format(year))
    else:
        try:
            country = Country.objects.get(Q(name=country) | Q(iso2=country) | Q(iso3=country))
        except Country.DoesNotExist:
            logger.error('Requested Country ({}) does not exist.'.format(country))
            return

        try:
            params['in_Domain'] = settings.ENTSOE_COUNTRY_ZONES.get(country.name, None)
            capacity_data = entsoe_installed_capacity_parser(fetch_entsoe_data(params=params))
        except (BadRequest, Unauthorized, NotFound, Unavailable) as exc:
            logger.error('{}: {}'.format(country.name, exc.message))
            capacity_data = {}

        CountryCapacity.objects.update_or_create(
            country=country, reference_year=year, total_capacity=sum(capacity_data.values()), **capacity_data
        )
        logger.info('{} Capacity data for year {} updated.'.format(country.name, year))
