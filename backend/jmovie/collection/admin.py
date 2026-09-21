from django.contrib import admin

from .models import (
    Collection,
    CollectionItem,
)


class CollectionItemInline(
    admin.TabularInline
):
    model = CollectionItem
    extra = 0


@admin.register(Collection)
class CollectionAdmin(
    admin.ModelAdmin
):

    list_display = (
        "title",
        "order",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "title",
    )

    prepopulated_fields = {
        "slug": (
            "title",
        )
    }

    inlines = [
        CollectionItemInline,
    ]