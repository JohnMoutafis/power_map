from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from modules.country_generation.api.serializers import CountryGenerationSerializer, UpdateGenerationSerializer
from modules.country_generation.models import CountryGeneration
from modules.country_generation.tasks import update_country_generation


class CountryGenerationViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing CountryGeneration Info."""
    queryset = CountryGeneration.objects.all()
    serializer_class = CountryGenerationSerializer

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
