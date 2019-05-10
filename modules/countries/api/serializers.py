from rest_framework import serializers

from modules.countries.models import Country


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'name', 'iso2', 'iso3', 'border')
        read_only_field = ('id',)
