from datetime import datetime

from django.db import models

from base.models import BaseModel, BaseDataModel
from modules.countries.models import Country


class GenerationPerType(BaseModel):
    hour_frame = models.CharField(max_length=14, default='', blank=True)
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

    class Meta:
        verbose_name = 'Actual Generation Per Type'
        verbose_name_plural = 'Actual Generation Per Type'
        ordering = ['hour_frame']


class CountryGeneration(BaseDataModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    hourly_generation = models.ManyToManyField(GenerationPerType, blank=True)

    class Meta:
        verbose_name = 'Country Generation'
        verbose_name_plural = 'Countries Generation'
        ordering = ['country']
