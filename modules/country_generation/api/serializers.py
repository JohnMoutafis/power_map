from django.core.exceptions import ValidationError
from rest_framework import serializers

from modules.countries.api.serializers import CountrySerializer, SimpleCountrySerializer
from modules.country_generation.models import CountryGeneration, GenerationPerType


class GenerationPerTypeSerializer(serializers.ModelSerializer):
    """Standard GenerationPerType Model Serializer."""
    class Meta:
        model = GenerationPerType
        fields = (
            'hour_frame', 'biomass', 'fossil_coal_derived_gas', 'fossil_gas', 'fossil_hard_coal', 'fossil_lignite',
            'fossil_oil', 'fossil_oil_shale', 'fossil_peat', 'geothermal', 'hydro_pumped_storage',
            'hydro_river_and_poundage', 'hydro_water_reservoir', 'marine', 'nuclear', 'other', 'other_renewable',
            'solar', 'waste', 'wind_offshore', 'wind_onshore'
        )


class CountryGenerationSerializer(serializers.ModelSerializer):
    """Standard CountryGeneration Model Serializer."""
    country = CountrySerializer()
    hourly_generation = GenerationPerTypeSerializer(many=True, read_only=True)

    class Meta:
        model = CountryGeneration
        fields = ('id', 'last_updated', 'country', 'reference_date', 'hourly_generation')
        read_only_field = ('id', 'last_updated')


class PublicCountryGenerationSerializer(serializers.ModelSerializer):
    country = SimpleCountrySerializer()
    hourly_generation = serializers.SerializerMethodField('filter_hourly_generation_data')

    class Meta:
        model = CountryGeneration
        fields = ('id', 'last_updated', 'country', 'reference_date', 'hourly_generation')
        read_only_field = ('id', 'last_updated', 'country')

    def filter_hourly_generation_data(self, instance):
        extra_filters = {}
        time_exact = self.context.get('request').query_params.get('generation_time_exact')
        time_after = self.context.get('request').query_params.get('generation_time_after')
        time_before = self.context.get('request').query_params.get('generation_time_before')
        if time_exact:
            extra_filters.update({'hour_frame': time_exact})
        elif time_after or time_before:
            if time_after and not time_before:
                extra_filters.update({'hour_frame__gte': time_after, 'hour_frame__lte': '23:00'})
            elif time_before and not time_after:
                extra_filters.update({'hour_frame__gte': '00:00', 'hour_frame__lte': time_before})
            else:
                extra_filters.update({'hour_frame__gte': time_after, 'hour_frame__lte': time_before})

        try:
            forecast_data = GenerationPerType.objects.filter(countrygeneration=instance, **extra_filters)
            serializer = GenerationPerTypeSerializer(forecast_data, many=True)
        except ValidationError:
            raise serializers.ValidationError('Time Input must have the appropriate format: HH:MM[:ss[.uuuuuu]]')
        return serializer.data


class UpdateGenerationSerializer(serializers.Serializer):
    """Update CountryCapacity endpoint Serializer."""
    country = serializers.CharField(default='all')
    date = serializers.DateField(input_formats=['%Y-%m-%d'])
