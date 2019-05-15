"""power_map URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import SimpleRouter
from rest_framework_swagger.views import get_swagger_view

from modules.countries.api.views import CountryViewSet
from modules.country_capacity.api.views import CountryCapacityViewSet
from modules.country_forecast.api.views import CountryForecastViewSet
from modules.country_generation.api.views import CountryGenerationViewSet

schema_view = get_swagger_view(title='Power Map API')

router = SimpleRouter()
router.register('countries', CountryViewSet, base_name='countries')
router.register('country_capacities', CountryCapacityViewSet, base_name='country-capacity')
router.register('country-generation', CountryGenerationViewSet, base_name='country-generation')
router.register('country-forecast', CountryForecastViewSet, base_name='country-forecast')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/api-auth/', include('rest_framework.urls')),
    path('api/v1/api-token-auth/', obtain_auth_token),
    path('api/v1/docs/', schema_view),
    path('api/v1/', include(router.urls)),
]
