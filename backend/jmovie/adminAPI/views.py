from rest_framework import generics, filters, permissions, viewsets 
from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .permissions import IsStaffAdmin
from .serializers import (
    AdminMovieSerializer, 
    AdminSeriesSerializer, 
    AdminUserSerializer, 
    AdminGenreSerializer,
)
# series
from series.models import Series
from series.filters import SeriesFilter
# movie
from movies.models import Movie, MovieCast
from movies.filters import MovieFilter
# accounts
from django.contrib.auth import get_user_model
User = get_user_model()
# genres
from genres.models import Genre

# ==========================
# admin base view
# ==========================

class AdminModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# ==========================
# Admin - Users
# ==========================

class AdminUserViewSet(AdminModelViewSet):
    serializer_class = AdminUserSerializer
    queryset = User.objects.all().order_by("-date_joined")
    lookup_field = "id"

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering_fields = ["id", "date_joined", "last_login", "username", "email"]
    ordering = ["-date_joined"]



# ==========================
# Admin - movies
# ==========================


class AdminMovieViewSet(AdminModelViewSet):
    """
    Admin Movie API

    - List movies
    - Create movie
    - Retrieve movie by id
    - Update movie
    - Delete movie
    """

    queryset = Movie.objects.all().order_by("-updated_at")
    serializer_class = AdminMovieSerializer
    lookup_field = "id"

    # filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MovieFilter

    search_fields = [
        "title",
        "original_title",
        "release_date",
        "imdb_id",
        "genres__name",
        "cast__name",
    ]

    ordering_fields = [
        "id"
        "release_date",
        "rating",
        "created_at",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .prefetch_related(
                "genres",
                Prefetch(
                    "movie_cast",
                    queryset=MovieCast.objects
                    .select_related("person")
                    .order_by("id"),
                ),
                "downloads",
            )
        )



# ==========================
# Admin - series
# ==========================

class AdminSeriesViewSet(AdminModelViewSet):
    queryset = Series.objects.all().prefetch_related("genres").order_by("-updated_at")
    search_fields = [
    "imdb_id", 
    "title", 
    "original_title", 
    "start_date",
    "genres__name",
    # "cast__character_name",
    ]
    
    ordering_fields = [
        "id"
        "start_date",
        "rating",
        "created_at",
    ]

    serializer_class = AdminSeriesSerializer
    lookup_field = "id"
    ordering = ["-created_at"]



# ==========================
# Admin - genres
# ==========================

class AdminGenreViewSet(AdminModelViewSet):
    serializer_class = AdminGenreSerializer
    queryset = Genre.objects.all().order_by("name")
    lookup_field = "id"

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "slug"]
    ordering_fields = ["id", "name", "slug"]
    ordering = ["name"]
