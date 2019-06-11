# Generated by Django 2.1.7 on 2019-06-10 18:23

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
            name='CountryGeneration',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('last_updated', models.DateField(auto_now=True)),
                ('reference_date', models.DateField(blank=True, null=True)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='countries.Country')),
            ],
            options={
                'verbose_name': 'Country Generation',
                'verbose_name_plural': 'Countries Generation',
                'ordering': ['country'],
            },
        ),
        migrations.CreateModel(
            name='GenerationPerType',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('last_updated', models.DateField(auto_now=True)),
                ('hour_frame', models.TimeField(blank=True, null=True)),
                ('biomass', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_coal_derived_gas', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_gas', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_hard_coal', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_lignite', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_oil', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_oil_shale', models.IntegerField(blank=True, default=0, null=True)),
                ('fossil_peat', models.IntegerField(blank=True, default=0, null=True)),
                ('geothermal', models.IntegerField(blank=True, default=0, null=True)),
                ('hydro_pumped_storage', models.IntegerField(blank=True, default=0, null=True)),
                ('hydro_river_and_poundage', models.IntegerField(blank=True, default=0, null=True)),
                ('hydro_water_reservoir', models.IntegerField(blank=True, default=0, null=True)),
                ('marine', models.IntegerField(blank=True, default=0, null=True)),
                ('nuclear', models.IntegerField(blank=True, default=0, null=True)),
                ('other', models.IntegerField(blank=True, default=0, null=True)),
                ('other_renewable', models.IntegerField(blank=True, default=0, null=True)),
                ('solar', models.IntegerField(blank=True, default=0, null=True)),
                ('waste', models.IntegerField(blank=True, default=0, null=True)),
                ('wind_offshore', models.IntegerField(blank=True, default=0, null=True)),
                ('wind_onshore', models.IntegerField(blank=True, default=0, null=True)),
            ],
            options={
                'verbose_name': 'Actual Generation Per Type',
                'verbose_name_plural': 'Actual Generation Per Type',
                'ordering': ['hour_frame'],
            },
        ),
        migrations.AddField(
            model_name='countrygeneration',
            name='hourly_generation',
            field=models.ManyToManyField(blank=True, to='country_generation.GenerationPerType'),
        ),
    ]
