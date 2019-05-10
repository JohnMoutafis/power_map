from rest_framework import viewsets

from modules.country_capacity.api.serializers import CountryCapacitySerializer
from modules.country_capacity.models import CountryCapacity


class CountryCapacityViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing Country information"""
    queryset = CountryCapacity.objects.all()
    serializer_class = CountryCapacitySerializer
