from django.db import models

from base.models import BaseModel, BaseDataModel
from modules.countries.models import Country


class GenerationForecast(BaseModel):
    hour_frame = models.CharField(max_length=14, default='', blank=True)
    generation_forecast = models.IntegerField(default=0, null=True, blank=True)
    consumption_forecast = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        verbose_name = 'Generation Forecast'
        verbose_name_plural = 'Generation Forecast'
        ordering = ['hour_frame']


class WindSolarGenerationForecast(BaseModel):
    hour_frame = models.CharField(max_length=14, default='', blank=True)
    solar_forecast = models.IntegerField(default=0, null=True, blank=True)
    wind_onshore_forecast = models.IntegerField(default=0, null=True, blank=True)
    wind_offshore_forecast = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        verbose_name = 'Wind/Solar Generation Forecast'
        verbose_name_plural = 'Wind/Solar Generation Forecast'
        ordering = ['hour_frame']


class CountryForecast(BaseDataModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    forecast = models.ManyToManyField(GenerationForecast, blank=True)
    wind_solar_forecast = models.ManyToManyField(WindSolarGenerationForecast, blank=True)

    class Meta:
        verbose_name = 'Country Generation Forecast'
        verbose_name_plural = 'Countries Generation Forecast'
        ordering = ['country']
