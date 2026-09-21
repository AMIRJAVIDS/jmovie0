from django.contrib import admin
from .models import Genre


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "is_active",
        "created_at",
    )

    list_editable = (
        "is_active",
    )

    search_fields = (
        "name",
        "slug",
    )

    list_filter = (
        "is_active",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }

    ordering = ("name",)

    readonly_fields = (
        "created_at",
    )

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "slug",
                    "description",
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
