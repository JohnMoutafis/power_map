from rest_framework import serializers

from modules.country_generation.models import CountryGeneration, GenerationPerType


class CountryGenerationSerializer(serializers.ModelSerializer):
    """Standard CountryGeneration Model Serializer."""
    class Meta:
        model = CountryGeneration
        fields = ('id', 'last_updated', 'country', 'reference_date', 'hourly_generation')
        read_only_field = ('id', 'last_updated', 'country')


class GenerationPerTypeSerializer(serializers.ModelSerializer):
    """Standard GenerationPerType Model Serializer."""
    class Meta:
        model = GenerationPerType
        fields = (
            'id', 'last_updated', 'hour_frame', 'biomass', 'fossil_coal_derived_gas', 'fossil_gas', 'fossil_hard_coal',
            'fossil_lignite', 'fossil_oil', 'fossil_oil_shale', 'fossil_peat', 'geothermal', 'hydro_pumped_storage',
            'hydro_river_and_poundage', 'hydro_water_reservoir', 'marine', 'nuclear', 'other', 'other_renewable',
            'solar', 'waste', 'wind_offshore', 'wind_onshore'
        )
        read_only_field = ('id', 'last_updated')


class UpdateGenerationSerializer(serializers.Serializer):
    """Update CountryCapacity endpoint Serializer."""
    country = serializers.CharField(default='all')
    date = serializers.DateField(input_formats=['%Y-%m-%d'])
