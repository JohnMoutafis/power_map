from rest_framework import viewsets

from modules.countries.api.serializers import CountrySerializer
from modules.countries.models import Country


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """A simple ViewSet for viewing Country information"""
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
