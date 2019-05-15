from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from modules.country_forecast.api.serializers import CountryForecastSerializer, UpdateForecastSerializer
from modules.country_forecast.models import CountryForecast
from modules.country_forecast.tasks import update_country_forecast


class CountryForecastViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing CountryForecast Info."""
    queryset = CountryForecast.objects.all()
    serializer_class = CountryForecastSerializer

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
