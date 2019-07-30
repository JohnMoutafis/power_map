from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from modules.countries.api.serializers import CountrySerializer, CountryNameIsoSerializer
from modules.countries.models import Country


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """A simple ViewSet for viewing Country information"""
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

    @action(methods=['get'], detail=False, url_path='name-iso-list')
    def name_iso_list(self, request, *args, **kwargs):
        serializer = CountryNameIsoSerializer(self.queryset, many=True)
        return Response(serializer.data)
