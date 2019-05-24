from django.contrib import admin

from modules.countries.models import Country


class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'iso3', 'iso2')


admin.site.register(Country, CountryAdmin)
