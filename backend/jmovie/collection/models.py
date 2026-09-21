from django.db import models
from django.utils.text import slugify

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from core.models import TimeStampedModel


# ---------------------------------------
# Collection
# ---------------------------------------
class Collection(TimeStampedModel):
    tmdb_id = models.PositiveIntegerField(
        unique=True,
        null=True,
        blank=True,
    )

    title = models.CharField(
        max_length=255,
    )

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    poster = models.ImageField(
        upload_to="collections/posters/",
        blank=True,
        null=True
    )

    poster_url = models.URLField(
        blank=True,
        null=True
    )

    backdrop = models.ImageField(
        upload_to="collections/backdrops/",
        blank=True,
        null=True
    )

    backdrop_url = models.URLField(
        blank=True,
        null=True
    )

    order = models.PositiveIntegerField(
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    class Meta:
        ordering = (
            "order",
            "title",
        )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(
                self.title
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ---------------------------------------
# Collection Item
# ---------------------------------------
class CollectionItem(TimeStampedModel):

    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name="items"
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to={
            "app_label": "movies",
            "model__in": ["movie", "series"],
        },
    )

    object_id = models.PositiveBigIntegerField()

    content_object = GenericForeignKey(
        "content_type",
        "object_id"
    )

    order = models.PositiveIntegerField(
        default=0
    )

    class Meta:

        ordering = (
            "order",
            "id",
        )

        # unique_together = (
        #     "collection",
        #     "content_type",
        #     "object_id",
        # )
        
        constraints = [
            models.UniqueConstraint(
                fields=["collection", "content_type", "object_id"],
                name="unique_item_per_collection",
            ),
        ]

        indexes = [
            models.Index(
                fields=["content_type", "object_id"],
                name="collection_item_object_idx",
            ),
            models.Index(
                fields=["collection", "order", "id"],
                name="collection_item_order_idx",
            ),
        ]
    
    

    def __str__(self):
        obj = self.content_object
        object_label = str(obj) if obj is not None else f"Deleted object #{self.object_id}"
        return f"{self.collection} -> {object_label}"