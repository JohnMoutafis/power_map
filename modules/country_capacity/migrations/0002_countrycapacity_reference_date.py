# Generated by Django 2.1.7 on 2019-05-10 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country_capacity', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='countrycapacity',
            name='reference_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
