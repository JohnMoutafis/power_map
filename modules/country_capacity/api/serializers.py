from rest_framework import serializers

from modules.country_capacity.models import CountryCapacity


class CountryCapacitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryCapacity
        fields = (
            'id', 'reference_date', 'last_updated', 'country', 'biomass', 'fossil_coal_derived_gas', 'fossil_gas',
            'fossil_hard_coal', 'fossil_lignite', 'fossil_oil', 'fossil_oil_shale', 'fossil_peat', 'geothermal',
            'hydro_pumped_storage', 'hydro_river_and_poundage', 'hydro_water_reservoir', 'marine', 'nuclear', 'other',
            'other_renewable', 'solar', 'waste', 'wind_offshore', 'wind_onshore', 'total_capacity'
        )
        read_only_field = ('id', 'last_updated', 'country', 'reference_date')
