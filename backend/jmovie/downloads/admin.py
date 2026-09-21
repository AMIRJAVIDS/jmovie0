from django.contrib import admin
from django.contrib.contenttypes.models import ContentType

from .models import Download


@admin.register(Download)
class DownloadAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "content_object",
        "quality",
        "language",
        "subtitle",
        "is_vip",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_vip",
        "is_active",
        "content_type",
        "quality",
        "language",
        "subtitle",
        
    )

    search_fields = (
        "url",
        "quality",
        "language",
        "subtitle",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )

    fieldsets = (
        (
            "Target Content",
            {
                "fields": (
                    "content_type",
                    "object_id",
                )
            },
        ),
        (
            "Download Info",
            {
                "fields": (
                    "title",
                    "quality",
                    "language",
                    "subtitle",
                    "size",
                    "url",
                )
            },
        ),
        (
            "Access Control",
            {
                "fields": (
                    "is_vip",
                    "is_active",
                )
            },
        ),
        (
            "System",
            {
                "fields": (
                    "created_at",
                )
            },
        ),
    )
