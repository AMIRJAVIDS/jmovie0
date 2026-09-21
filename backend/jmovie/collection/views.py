from rest_framework import generics
from django.db.models import Count
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Collection
from .serializers import (
    CollectionListSerializer,
    CollectionDetailSerializer,
)


class CollectionListView(
    generics.ListAPIView
):

    serializer_class = CollectionListSerializer

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = ["title"]

    ordering_fields = [
        "title",
        "items_count",
        "id",
    ]

    queryset = (
        Collection.objects
        .annotate(
            items_count=Count("items")
        )
        .prefetch_related("items")
    )


class CollectionDetailView(
    generics.RetrieveAPIView
):

    serializer_class = CollectionDetailSerializer

    lookup_field = "slug"

    queryset = (
        Collection.objects
        .annotate(
            items_count=Count("items")
        )
        .filter(is_active=True)
        .prefetch_related("items")
    )