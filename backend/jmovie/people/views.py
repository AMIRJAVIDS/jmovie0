from rest_framework import permissions
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Person
from .serializers import PersonSerializer


class PersonViewSet(ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]

    queryset = (
        Person.objects
        .prefetch_related("images")
        .all()
    )

    serializer_class = PersonSerializer

    lookup_field = "slug"