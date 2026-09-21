from django.contrib import admin
from django.utils.html import format_html

from .models import Person, PersonImage


# --------------------------------------------------
# Inline: Person Images
# --------------------------------------------------
class PersonImageInline(admin.TabularInline):
    model = PersonImage
    extra = 1
    fields = ("image", "is_primary")
    readonly_fields = ()
    show_change_link = True


# --------------------------------------------------
# Person Admin
# --------------------------------------------------
@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = (
        "profile_image_preview",
        "profile_image_url",
        "name",
        "original_name",
        "tmdb_id",
        "birth_date",
        "popularity",
    )

    list_display_links = ("name",)

    search_fields = (
        "name",
        "original_name",
        "tmdb_id",
    )

    list_filter = (
        "birth_date",
    )

    ordering = ("-popularity", "name", "created_at", "updated_at",)

    readonly_fields = (
        # "slug",
        "created_at",
        "updated_at",
        "profile_image_preview",
    )

    autocomplete_fields = ()

    inlines = (PersonImageInline,)

    fieldsets = (
        (
            "Basic Info",
            {
                "fields": (
                    "name",
                    "original_name",
                    "slug",
                    "tmdb_id",
                    "profile_image",
                    "profile_image_url",
                    "profile_image_preview",
                )
            },
        ),
        (
            "Biography",
            {
                "fields": (
                    "biography",
                    "birth_date",
                    "death_date",
                    "place_of_birth",
                )
            },
        ),
        (
            "Stats",
            {
                "fields": (
                    "popularity",
                )
            },
        ),
        (
            "System",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    # --------------------------------------------------
    # Profile Image Preview
    # --------------------------------------------------
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" style="height: 60px; border-radius: 6px;" />',
                obj.profile_image.url
            )
        return "—"

    profile_image_preview.short_description = "Profile"
