from rest_framework_gis.serializers import GeoFeatureModelSerializer

from modules.countries.models import Country


class CountrySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'border'
        fields = ('name', 'iso2', 'iso3')
