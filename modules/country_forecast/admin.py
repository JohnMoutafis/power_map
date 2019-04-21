from django.contrib import admin

from modules.country_forecast.models import CountryForecast


class CountryForecastAdmin(admin.ModelAdmin):
    list_display = ('country_name',)

    def country_name(self, obj):
        return obj.country.name


admin.site.register(CountryForecast, CountryForecastAdmin)
