from django.urls import path

from .views import (
    CollectionListView,
    CollectionDetailView,
)

urlpatterns = [
    path(
        "",
        CollectionListView.as_view(),
        name="collection-list",
    ),

    path(
        "<slug:slug>/",
        CollectionDetailView.as_view(),
        name="collection-detail",
    ),
]