from django_filters import BaseInFilter, CharFilter, TimeFilter


class CharListFilter(BaseInFilter, CharFilter):
    pass


class TimeFilterPlaceholder(TimeFilter):
    """A Placeholder filter, enabling Swagger reference without effect."""
    def filter(self, qs, value):
        return qs
