from rest_framework.routers import DefaultRouter
from adminAPI.views import (
    AdminMovieViewSet, 
    AdminSeriesViewSet, 
    AdminUserViewSet, 
    AdminGenreViewSet,
)

router = DefaultRouter()
router.register("users", AdminUserViewSet, basename="admin-User")
router.register("movies", AdminMovieViewSet, basename="admin-movies")
router.register("series", AdminSeriesViewSet, basename="admin-series")
router.register("genres", AdminGenreViewSet, basename="admin-genres")


urlpatterns = router.urls
