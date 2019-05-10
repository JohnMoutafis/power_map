from django.db import models

from base.models import BaseDataModel
from modules.countries.models import Country


class CountryCapacity(BaseDataModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    # Types
    biomass = models.IntegerField(default=0, null=True, blank=True)
    fossil_coal_derived_gas = models.IntegerField(default=0, null=True, blank=True)
    fossil_gas = models.IntegerField(default=0, null=True, blank=True)
    fossil_hard_coal = models.IntegerField(default=0, null=True, blank=True)
    fossil_lignite = models.IntegerField(default=0, null=True, blank=True)
    fossil_oil = models.IntegerField(default=0, null=True, blank=True)
    fossil_oil_shale = models.IntegerField(default=0, null=True, blank=True)
    fossil_peat = models.IntegerField(default=0, null=True, blank=True)
    geothermal = models.IntegerField(default=0, null=True, blank=True)
    hydro_pumped_storage = models.IntegerField(default=0, null=True, blank=True)
    hydro_river_and_poundage = models.IntegerField(default=0, null=True, blank=True)
    hydro_water_reservoir = models.IntegerField(default=0, null=True, blank=True)
    marine = models.IntegerField(default=0, null=True, blank=True)
    nuclear = models.IntegerField(default=0, null=True, blank=True)
    other = models.IntegerField(default=0, null=True, blank=True)
    other_renewable = models.IntegerField(default=0, null=True, blank=True)
    solar = models.IntegerField(default=0, null=True, blank=True)
    waste = models.IntegerField(default=0, null=True, blank=True)
    wind_offshore = models.IntegerField(default=0, null=True, blank=True)
    wind_onshore = models.IntegerField(default=0, null=True, blank=True)
    # Total Capacity
    total_capacity = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        verbose_name = 'Country Capacity'
        verbose_name_plural = 'Countries Capacity'
        ordering = ['country']
