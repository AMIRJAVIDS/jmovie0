from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiTypes,
)

from .models import Comment
from .serializers import CommentSerializer
from accounts.permissions import IsOwner


@extend_schema(
    parameters=[
        OpenApiParameter(
            name="content_type",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description="Model name (e.g. movie, post, article)",
        ),
        OpenApiParameter(
            name="object_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="ID of the target object",
        ),
    ]
)
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner]

    filter_backends = [filters.OrderingFilter]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = Comment.objects.select_related("user")

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)