from django_filters import BaseInFilter, CharFilter


class CharListFilter(BaseInFilter, CharFilter):
    pass
