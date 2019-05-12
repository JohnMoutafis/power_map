from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from modules.country_capacity.api.serializers import CountryCapacitySerializer, UpdateCapacitySerializer
from modules.country_capacity.models import CountryCapacity
from modules.country_capacity.tasks import update_country_capacity


class CountryCapacityViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing Country information"""
    queryset = CountryCapacity.objects.all()
    serializer_class = CountryCapacitySerializer

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
