from django.conf import settings
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

from core.models import TimeStampedModel
User = settings.AUTH_USER_MODEL


class Comment(TimeStampedModel):
    # 🔗 Generic relation to Movie / Series / Episode
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    # 👤 Author
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    # 💬 Comment content
    text = models.TextField()

    # 🧵 Threaded comments
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies"
    )

    # ✅ Moderation
    is_active = models.BooleanField(
        default=True
    )

    is_approved = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ("created_at",)
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["is_active", "is_approved"]),
        ]

    def __str__(self):
        return f"Comment by {self.user} ({self.id})"
