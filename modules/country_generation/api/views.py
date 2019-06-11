import django_filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework_gis.filters import GeometryFilter

from common.filters import CharListFilter, TimeFilterPlaceholder
from modules.country_generation.api.serializers import (
    CountryGenerationSerializer, UpdateGenerationSerializer,
    PublicCountryGenerationSerializer
)
from modules.country_generation.models import CountryGeneration
from modules.country_generation.tasks import update_country_generation


class CountryGenerationFilterSet(django_filters.FilterSet):
    country_contains_geom = GeometryFilter(field_name='country__border', lookup_expr='contains')
    country_iso2 = CharListFilter(field_name='country__iso2', lookup_expr='in')
    reference_date_exact = django_filters.DateFilter(field_name='reference_date')
    reference_date = django_filters.DateFromToRangeFilter(
        field_name='reference_date', help_text='Must be set with `_before` and/or `_after` keywords.'
    )
    generation_time_exact = TimeFilterPlaceholder(field_name='hourly_generation__hour_frame')
    generation_time_after = TimeFilterPlaceholder(field_name='hourly_generation__hour_frame')
    generation_time_before = TimeFilterPlaceholder(field_name='hourly_generation__hour_frame')


class CountryGenerationViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing CountryGeneration Info."""
    queryset = CountryGeneration.objects.all()
    serializer_class = CountryGenerationSerializer
    filter_class = CountryGenerationFilterSet

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (AllowAny,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PublicCountryGenerationSerializer
        return CountryGenerationSerializer

    @action(
        methods=['post'], detail=False, url_path='update-generation',
        permission_classes=[IsAdminUser], serializer_class=UpdateGenerationSerializer
    )
    def update_generation(self, request, *args, **kwargs):
        """
        Updates a country's Daily Generation for a specified date.

        Payload:
            country: Can be a country identification (name, iso2, iso3).
            date:    A date.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            update_country_generation.delay(
                serializer.validated_data.get('date'), serializer.validated_data.get('country')
            )
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
