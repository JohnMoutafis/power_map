from celery import shared_task


@shared_task
def update_country_capacity(country_id, country_name):
    pass
