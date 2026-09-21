import django_filters as filters
from django.db.models import Q

from .models import Movie, MovieCast


class MovieFilter(filters.FilterSet):
    query = filters.CharFilter(method="filter_query")
    
    # ژانر بر اساس slug (مطابق /genres/)
    genre = filters.CharFilter(field_name="genres__slug", lookup_expr="iexact")
    # چند ژانری: ?genre__in=action,drama
    genre__in = filters.BaseInFilter(field_name="genres__slug", lookup_expr="in")

    country = filters.CharFilter(field_name="country", lookup_expr="icontains")
    
    year = filters.NumberFilter(field_name="year")
    min_year = filters.NumberFilter(field_name="year", lookup_expr="gte")
    max_year = filters.NumberFilter(field_name="year", lookup_expr="lte")

    min_rating = filters.NumberFilter(field_name="imdb_rating", lookup_expr="gte")
    max_rating = filters.NumberFilter(field_name="imdb_rating", lookup_expr="lte")

    director = filters.NumberFilter(method="filter_director")
    director_name = filters.CharFilter(method="filter_director_name")

    actor = filters.NumberFilter(method="filter_actor")
    actor_name = filters.CharFilter(method="filter_actor_name")
    
    class Meta:
        model = Movie
        fields = [
            "query",
            "genre",
            "genre__in",
            "country",
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
            movie_cast__person__name__icontains=value,
            movie_cast__role=MovieCast.ROLE_ACTOR,
        ).distinct()

    def filter_director_name(self, queryset, name, value):
        return queryset.filter(
            movie_cast__person__name__icontains=value,
            movie_cast__role=MovieCast.ROLE_DIRECTOR,
        ).distinct()
    
    def filter_director(self, queryset, name, value):
        return queryset.filter(
            movie_cast__person_id=value,
            movie_cast__role=MovieCast.ROLE_DIRECTOR,
        ).distinct()
    
    # Add this missing method
    def filter_actor(self, queryset, name, value):
        return queryset.filter(
            movie_cast__person_id=value,
            movie_cast__role=MovieCast.ROLE_ACTOR,
        ).distinct()