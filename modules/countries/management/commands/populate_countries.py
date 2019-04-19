import logging
import os

from django.contrib.gis.utils import LayerMapping
from django.core.management import BaseCommand

from modules.countries.models import Country
from power_map.settings import BASE_DIR

logger = logging.getLogger('power_map')

entsoe_shp = os.path.join(BASE_DIR, 'modules', 'countries', 'resources', 'entsoe_borders', 'entsoe_borders.shp')
country_mapping = {
    'name': 'NAME',
    'iso2': 'ISO2',
    'iso3': 'ISO3',
    'border': 'MULTIPOLYGON'
}


def populate_db():
    lm = LayerMapping(Country, entsoe_shp, country_mapping, transform=False)
    lm.save(strict=True, verbose=True)


class Command(BaseCommand):
    """
    Management command to populate Countries.
    Execute: ./manage.py populate_countries
    """
    def handle(self, *args, **kwargs):
        if not Country.objects.all().exists():
            populate_db()
            logger.info('Countries Table populated successfully.')
        else:
            logger.info('Countries Table already populated.')
