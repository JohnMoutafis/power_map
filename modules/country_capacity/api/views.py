from datetime import date

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

import django_filters
from rest_framework_gis.filters import GeometryFilter

from common.filters import ListFilter
from common.helpers import create_year_range
from modules.country_capacity.api.serializers import CountryCapacitySerializer, UpdateCapacitySerializer
from modules.country_capacity.models import CountryCapacity
from modules.country_capacity.tasks import update_country_capacity


class CountryCapacityFilterSet(django_filters.FilterSet):
    country_contains_geom = GeometryFilter(field_name='country__border', lookup_expr='contains')
    country_in = ListFilter(field_name='country__iso2')
    reference_year_exact = django_filters.CharFilter(field_name='reference_year', lookup_expr='exact')
    reference_year = django_filters.DateFromToRangeFilter(method='reference_year_range_filter')

    def reference_year_range_filter(self, queryset, name, value):
        if not value.start and not value.stop:
            start_year = end_year = date.today().year
        elif value.start and not value.stop:
            start_year = end_year = value.start.year
        elif not value.start and value.stop or value.start > value.stop:
            start_year = end_year = value.stop.year
        else:
            start_year = value.start.year
            end_year = value.stop.year

        return queryset.filter(reference_year__in=create_year_range(start_year, end_year))


class CountryCapacityViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing CountryCapacity Info."""
    queryset = CountryCapacity.objects.all()
    serializer_class = CountryCapacitySerializer
    filter_class = CountryCapacityFilterSet

    @action(
        methods=['post'], detail=False, url_path='update-installed-capacity',
        permission_classes=[IsAdminUser], serializer_class=UpdateCapacitySerializer
    )
    def update_installed_capacity(self, request, *args, **kwargs):
        """
        Updates a country's capacity for a specified year.

        Payload:
            country: Can be a country identification (name, iso2, iso3) or 'all' (default).
            year:    A 4 digit year variable.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            update_country_capacity.delay(
                serializer.validated_data.get('year'), serializer.validated_data.get('country')
            )
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
