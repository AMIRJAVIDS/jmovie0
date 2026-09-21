from rest_framework import viewsets, permissions

from .models import Genre
from .serializers import GenreSerializer, GenreMinimalSerializer


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API for genres.
    Used in movies and series.
    """
    queryset = Genre.objects.all().order_by("name")
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        return (
            GenreMinimalSerializer
            if self.action == "list"
            else GenreSerializer
        )
