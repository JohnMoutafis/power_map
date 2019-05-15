from rest_framework import serializers

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
    forecast = GenerationForecastSerializer(many=True, read_only=True)
    wind_solar_forecast = WindSolarGenerationForecastSerializer(many=True, read_only=True)

    class Meta:
        model = CountryForecast
        fields = ('id', 'last_updated', 'country', 'reference_date', 'forecast', 'wind_solar_forecast')
        read_only_field = ('id', 'last_updated', 'country')


class UpdateForecastSerializer(serializers.Serializer):
    """Update CountryForecast endpoint Serializer."""
    country = serializers.CharField(default='all')
    date = serializers.DateField(input_formats=['%Y-%m-%d'])
