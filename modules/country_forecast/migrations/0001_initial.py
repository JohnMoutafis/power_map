# Generated by Django 2.1.7 on 2019-04-21 09:36

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('countries', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CountryForecast',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('last_updated', models.DateField(auto_now=True)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='countries.Country')),
            ],
            options={
                'verbose_name': 'Country Generation Forecast',
                'verbose_name_plural': 'Countries Generation Forecast',
                'ordering': ['country'],
            },
        ),
        migrations.CreateModel(
            name='GenerationForecast',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('last_updated', models.DateField(auto_now=True)),
                ('hour_frame', models.CharField(blank=True, default='', max_length=14)),
                ('forecast', models.IntegerField(blank=True, default=0, null=True)),
            ],
            options={
                'verbose_name': 'Generation Forecast',
                'verbose_name_plural': 'Generation Forecast',
                'ordering': ['hour_frame'],
            },
        ),
        migrations.CreateModel(
            name='WindSolarGenerationForecast',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('last_updated', models.DateField(auto_now=True)),
                ('hour_frame', models.CharField(blank=True, default='', max_length=14)),
                ('solar_forecast', models.IntegerField(blank=True, default=0, null=True)),
                ('wind_onshore_forecast', models.IntegerField(blank=True, default=0, null=True)),
                ('wind_offshore_forecast', models.IntegerField(blank=True, default=0, null=True)),
            ],
            options={
                'verbose_name': 'Wind/Solar Generation Forecast',
                'verbose_name_plural': 'Wind/Solar Generation Forecast',
                'ordering': ['hour_frame'],
            },
        ),
        migrations.AddField(
            model_name='countryforecast',
            name='forecast',
            field=models.ManyToManyField(blank=True, to='country_forecast.GenerationForecast'),
        ),
        migrations.AddField(
            model_name='countryforecast',
            name='wind_solar_forecast',
            field=models.ManyToManyField(blank=True, to='country_forecast.WindSolarGenerationForecast'),
        ),
    ]
