from datetime import datetime

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from modules.countries.api.serializers import SimpleCountrySerializer
from modules.country_capacity.models import CountryCapacity


class CountryCapacitySerializer(serializers.ModelSerializer):
    """Standard CountryCapacity Model Serializer."""
    country = SimpleCountrySerializer()

    class Meta:
        model = CountryCapacity
        fields = (
            'id', 'last_updated', 'country', 'reference_year', 'biomass', 'fossil_coal_derived_gas', 'fossil_gas',
            'fossil_hard_coal', 'fossil_lignite', 'fossil_oil', 'fossil_oil_shale', 'fossil_peat', 'geothermal',
            'hydro_pumped_storage', 'hydro_river_and_poundage', 'hydro_water_reservoir', 'marine', 'nuclear', 'other',
            'other_renewable', 'solar', 'waste', 'wind_offshore', 'wind_onshore', 'total_capacity'
        )
        read_only_field = ('id', 'last_updated', 'country')


class UpdateCapacitySerializer(serializers.Serializer):
    """Update CountryCapacity endpoint Serializer."""
    country = serializers.CharField(default='all')
    year = serializers.CharField(min_length=4, max_length=4, default=str(datetime.now().year))

    def validate(self, attrs):
        try:
            int(attrs('year'))
        except ValueError:
            raise ValidationError('Must be a valid Year value.')
