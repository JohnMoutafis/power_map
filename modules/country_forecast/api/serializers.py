from django.core.exceptions import ValidationError
from rest_framework import serializers

from modules.countries.api.serializers import SimpleCountrySerializer, CountrySerializer
from modules.country_forecast.models import CountryForecast, WindSolarGenerationForecast, GenerationForecast


class GenerationForecastSerializer(serializers.ModelSerializer):
    """Standard GenerationForecast Model serializer."""
    class Meta:
        model = GenerationForecast
        fields = ('hour_frame', 'generation_forecast', 'consumption_forecast')


class WindSolarGenerationForecastSerializer(serializers.ModelSerializer):
    """Standard WindSolarGenerationForecast Model Serializer."""
    class Meta:
        model = WindSolarGenerationForecast
        fields = ('hour_frame', 'solar_forecast', 'wind_onshore_forecast', 'wind_offshore_forecast')


class CountryForecastSerializer(serializers.ModelSerializer):
    """Standard CountryForecast Model Serializer."""
    country = CountrySerializer()
    forecast = GenerationForecastSerializer(many=True)
    wind_solar_forecast = WindSolarGenerationForecastSerializer(many=True)

    class Meta:
        model = CountryForecast
        fields = ('id', 'last_updated', 'country', 'reference_date', 'forecast', 'wind_solar_forecast')
        read_only_field = ('id', 'last_updated')


class PublicCountryForecastSerializer(serializers.ModelSerializer):
    """Public CountryForecast Model Serializer."""
    country = SimpleCountrySerializer()
    forecast = serializers.SerializerMethodField('filter_forecast_data')
    wind_solar_forecast = serializers.SerializerMethodField('filter_wind_solar_data')

    class Meta:
        model = CountryForecast
        fields = ('id', 'last_updated', 'country', 'reference_date', 'forecast', 'wind_solar_forecast')
        read_only_field = ('id', 'last_updated', 'country')

    def filter_forecast_data(self, instance):
        extra_filters = {}
        time_exact = self.context.get('request').query_params.get('forecast_time_exact')
        time_after = self.context.get('request').query_params.get('forecast_time_after')
        time_before = self.context.get('request').query_params.get('forecast_time_before')
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
            forecast_data = GenerationForecast.objects.filter(countryforecast=instance, **extra_filters)
            serializer = GenerationForecastSerializer(forecast_data, many=True)
        except ValidationError:
            raise serializers.ValidationError('Time Input must have the appropriate format: HH:MM[:ss[.uuuuuu]]')
        return serializer.data

    def filter_wind_solar_data(self, instance):
        extra_filters = {}
        time_exact = self.context.get('request').query_params.get('wind_solar_time_exact')
        time_after = self.context.get('request').query_params.get('wind_solar_time_after')
        time_before = self.context.get('request').query_params.get('wind_solar_time_before')
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
            wind_solar_forecast_data = WindSolarGenerationForecast.objects.filter(
                countryforecast=instance, **extra_filters
            )
            serializer = WindSolarGenerationForecastSerializer(wind_solar_forecast_data, many=True)
        except ValidationError:
            raise serializers.ValidationError('Time Input must have the appropriate format: HH:MM[:ss[.uuuuuu]]')
        return serializer.data


class UpdateForecastSerializer(serializers.Serializer):
    """Update CountryForecast endpoint Serializer."""
    country = serializers.CharField(default='all')
    date = serializers.DateField(input_formats=['%Y-%m-%d'])
