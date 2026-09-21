from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from rest_framework.throttling import ScopedRateThrottle


from .models import Download
from .serializers import DownloadSerializer
from .permissions import IsVIPUser


class DownloadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    VIP-only download links for movies and episodes.
    """
    serializer_class = DownloadSerializer
    permission_classes = [permissions.IsAuthenticated, IsVIPUser]

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "downloads"

    filter_backends = [filters.OrderingFilter]
    ordering = ["quality"]

    def get_queryset(self):
        queryset = Download.objects.all()

        content_type = self.request.query_params.get("content_type")
        object_id = self.request.query_params.get("object_id")

        if content_type and object_id:
            try:
                ct = ContentType.objects.get(model=content_type)
            except ContentType.DoesNotExist:
                raise ValidationError("Invalid content_type")

            queryset = queryset.filter(
                content_type=ct,
                object_id=object_id,
            )

        return queryset
