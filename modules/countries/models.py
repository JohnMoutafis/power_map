from django.contrib.gis.db import models


class Country(models.Model):
    name = models.CharField(max_length=50)
    iso2 = models.CharField(max_length=2)
    iso3 = models.CharField(max_length=3)
    border = models.MultiPolygonField()
