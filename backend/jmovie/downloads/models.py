from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType


class Download(models.Model):
    # Generic relation to Movie / Series / Season / Episode
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="downloads"
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional title shown to users"
    )

    quality = models.CharField(
        max_length=50,
        help_text="e.g. 1080p, 720p, BluRay"
    )

    language = models.CharField(
        max_length=50,
        default="original"
    )
    
    subtitle = models.BooleanField(default=False)

    size = models.CharField(
        max_length=20,
        blank=True
    )

    url = models.URLField()

    is_vip = models.BooleanField(
        default=False,
        help_text="Only VIP users can download"
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["is_active"]),
            models.Index(fields=["is_vip"]),
        ]

    def __str__(self):
        return f"{self.quality} - {self.language}"
