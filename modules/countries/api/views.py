from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from modules.countries.api.serializers import CountrySerializer, CountryNameIsoSerializer
from modules.countries.models import Country
from modules.country_capacity.models import CountryCapacity
from modules.country_forecast.models import CountryForecast
from modules.country_generation.models import CountryGeneration


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """A simple ViewSet for viewing Country information"""
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )

    @action(methods=['get'], detail=False, url_path='name-iso-list')
    def name_iso_list(self, request, *args, **kwargs):
        serializer = CountryNameIsoSerializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='available-info')
    def country_available_info(self, request, *args, **kwargs):
        response = []
        countries = self.queryset.prefetch_related(
            'countrycapacity_set', 'countrygeneration_set', 'countryforecast_set'
        )
        for country in countries:
            capacity = generation = forecast = {'from': 'N/A', 'to': 'N/A'}
            try:
                capacity = {
                    'from': country.countrycapacity_set.earliest('last_updated').reference_year,
                    'to': country.countrycapacity_set.latest('last_updated').reference_year
                }
            except CountryCapacity.DoesNotExist:
                pass

            try:
                generation = {
                    'from': country.countrygeneration_set.earliest('reference_date').reference_date,
                    'to': country.countrygeneration_set.latest('reference_date').reference_date
                }
            except CountryGeneration.DoesNotExist:
                pass

            try:
                forecast = {
                    'from': country.countryforecast_set.earliest('reference_date').reference_date,
                    'to': country.countryforecast_set.latest('reference_date').reference_date
                }
            except CountryForecast.DoesNotExist:
                pass

            response.append({
                'country': country.name,
                'capacity': capacity,
                'generation': generation,
                'forecast': forecast
            })
        return Response(data=response, content_type='application/json')
