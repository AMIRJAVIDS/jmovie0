from django.urls import path
from .views import (
    GlobalSearchView,
    MovieSearchView,
    SeriesSearchView
)

urlpatterns = [
    path("", GlobalSearchView.as_view()),
    path("movies/", MovieSearchView.as_view()),
    path("series/", SeriesSearchView.as_view()),
]