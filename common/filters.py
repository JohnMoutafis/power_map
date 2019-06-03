from django_filters import Filter
from django_filters.fields import Lookup


class ListFilter(Filter):
    def filter(self, qs, value):
        if value:
            return super().filter(qs, Lookup(value.split(u','), 'in'))
        return qs
