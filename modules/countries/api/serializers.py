from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from modules.countries.models import Country


class CountrySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'border'
        fields = ('name', 'iso2', 'iso3')


class CountryNameIsoSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField('to_label')
    value = serializers.SerializerMethodField('to_value')

    class Meta:
        model = Country
        fields = ('label', 'value')

    def to_label(self, obj):
        return obj.name

    def to_value(self, obj):
        return obj.iso2
