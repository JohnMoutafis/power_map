from django.contrib import admin

from modules.country_capacity.models import CountryCapacity


class CountryCapacityAdmin(admin.ModelAdmin):
    list_display = ('country_name', 'total_capacity')

    def country_name(self, obj):
        return obj.country.name


admin.site.register(CountryCapacity, CountryCapacityAdmin)
