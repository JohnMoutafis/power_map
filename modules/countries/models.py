from django.contrib.gis.db import models

from base.models import BaseModel


class Country(BaseModel):
    name = models.CharField(max_length=50)
    iso2 = models.CharField(max_length=2)
    iso3 = models.CharField(max_length=3)
    border = models.MultiPolygonField()

    class Meta:
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'
        ordering = ['name']
