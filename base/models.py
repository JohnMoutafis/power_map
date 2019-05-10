from uuid import uuid4
from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(
        default=uuid4,
        primary_key=True
    )
    last_updated = models.DateField(auto_now=True)

    class Meta:
        abstract = True


class BaseDataModel(BaseModel):
    reference_date = models.DateField(blank=True, null=True)

    class Meta:
        abstract = True
