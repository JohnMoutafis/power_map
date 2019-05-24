from django.contrib import admin

from modules.country_generation.models import CountryGeneration


class CountryGenerationAdmin(admin.ModelAdmin):
    list_display = ('country_name',)

    def country_name(self, obj):
        return obj.country.name


admin.site.register(CountryGeneration, CountryGenerationAdmin)
