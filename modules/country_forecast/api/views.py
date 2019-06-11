import django_filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework_gis.filters import GeometryFilter

from common.filters import CharListFilter, TimeFilterPlaceholder
from modules.country_forecast.api.serializers import CountryForecastSerializer, PublicCountryForecastSerializer, \
    UpdateForecastSerializer
from modules.country_forecast.models import CountryForecast
from modules.country_forecast.tasks import update_country_forecast


class CountryForecastFilterSet(django_filters.FilterSet):
    country_contains_geom = GeometryFilter(field_name='country__border', lookup_expr='contains')
    country_iso2 = CharListFilter(field_name='country__iso2', lookup_expr='in')
    reference_date_exact = django_filters.DateFilter(field_name='reference_date')
    reference_date = django_filters.DateFromToRangeFilter(
        field_name='reference_date', help_text='Must be set with `_before` and/or `_after` keywords.'
    )
    forecast_time_exact = TimeFilterPlaceholder(field_name='forecast__hour_frame')
    forecast_time_after = TimeFilterPlaceholder(field_name='forecast__hour_frame')
    forecast_time_before = TimeFilterPlaceholder(field_name='forecast__hour_frame')
    wind_solar_time_exact = TimeFilterPlaceholder(field_name='forecast__hour_frame')
    wind_solar_time_after = TimeFilterPlaceholder(field_name='forecast__hour_frame')
    wind_solar_time_before = TimeFilterPlaceholder(field_name='forecast__hour_frame')


class CountryForecastViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing CountryForecast Info."""
    queryset = CountryForecast.objects.all()
    filter_class = CountryForecastFilterSet
    serializer_class = PublicCountryForecastSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (AllowAny, )
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PublicCountryForecastSerializer
        return CountryForecastSerializer

    @action(
        methods=['post'], detail=False, url_path='update-forecast',
        permission_classes=[IsAdminUser], serializer_class=UpdateForecastSerializer
    )
    def update_forecast(self, request, *args, **kwargs):
        """
        Updates a country's Daily Forecast for a specified date.

        Payload:
            country: Can be a country identification (name, iso2, iso3).
            date:    A date.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            update_country_forecast.delay(
                serializer.validated_data.get('date'), serializer.validated_data.get('country')
            )
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
