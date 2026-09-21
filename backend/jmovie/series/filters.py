import django_filters as filters
from django.db.models import Q

from .models import Series, SeriesCast


class SeriesFilter(filters.FilterSet):
    query = filters.CharFilter(method="filter_query")

    # ژانر بر اساس slug (مطابق /genres/)
    genre = filters.CharFilter(field_name="genres__slug", lookup_expr="iexact")
    # چند ژانری: ?genre__in=action,drama
    genre__in = filters.BaseInFilter(field_name="genres__slug", lookup_expr="in")

    # توجه: مدل Series در حال حاضر فیلد country ندارد.
    # اگر این فیلتر لازم است، ابتدا باید فیلد country به مدل Series اضافه شود.
    # فعلاً این فیلتر بی‌اثر خواهد بود چون چنین فیلدی در دیتابیس وجود ندارد.
    # country = filters.CharFilter(field_name="country", lookup_expr="icontains")

    # مدل Series فیلد "year" ندارد (year یک property پایتونی روی start_date است)
    # پس باید مستقیماً روی start_date با lookup_expr="year" فیلتر بزنیم
    year = filters.NumberFilter(field_name="start_date", lookup_expr="year")
    min_year = filters.NumberFilter(field_name="start_date", lookup_expr="year__gte")
    max_year = filters.NumberFilter(field_name="start_date", lookup_expr="year__lte")

    min_rating = filters.NumberFilter(field_name="imdb_rating", lookup_expr="gte")
    max_rating = filters.NumberFilter(field_name="imdb_rating", lookup_expr="lte")

    director = filters.NumberFilter(method="filter_director")
    director_name = filters.CharFilter(method="filter_director_name")

    actor = filters.NumberFilter(method="filter_actor")
    actor_name = filters.CharFilter(method="filter_actor_name")

    class Meta:
        model = Series
        fields = [
            "query",
            "genre",
            "genre__in",
            "year",
            "min_year",
            "max_year",
            "min_rating",
            "max_rating",
            "actor",
            "actor_name",
            "director",
            "director_name",
        ]

    def filter_query(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(original_title__icontains=value)
        ).distinct()

    def filter_actor_name(self, queryset, name, value):
        return queryset.filter(
            cast__person__name__icontains=value,
            cast__role=SeriesCast.ROLE_ACTOR if hasattr(SeriesCast, "ROLE_ACTOR") else "actor",
        ).distinct()

    def filter_director_name(self, queryset, name, value):
        return queryset.filter(
            cast__person__name__icontains=value,
            cast__role=SeriesCast.ROLE_DIRECTOR if hasattr(SeriesCast, "ROLE_DIRECTOR") else "director",
        ).distinct()

    def filter_director(self, queryset, name, value):
        return queryset.filter(
            cast__person_id=value,
            cast__role=SeriesCast.ROLE_DIRECTOR if hasattr(SeriesCast, "ROLE_DIRECTOR") else "director",
        ).distinct()

    def filter_actor(self, queryset, name, value):
        return queryset.filter(
            cast__person_id=value,
            cast__role=SeriesCast.ROLE_ACTOR if hasattr(SeriesCast, "ROLE_ACTOR") else "actor",
        ).distinct()