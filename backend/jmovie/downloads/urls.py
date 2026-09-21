from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DownloadViewSet


router = DefaultRouter()
router.register(
    r"downloads",
    DownloadViewSet,
    basename="download",
)

urlpatterns = [
    path("", include(router.urls)),
]
