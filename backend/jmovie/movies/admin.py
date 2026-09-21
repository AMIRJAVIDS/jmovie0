from django.contrib import admin

from .models import Movie, MovieCast, MovieGalleryImage


class MovieGalleryInline(admin.TabularInline):
    model = MovieGalleryImage
    extra = 1


# ---------------------------
# Movie Cast Inline
# ---------------------------
class MovieCastInline(admin.TabularInline):
    model = MovieCast
    extra = 1
    autocomplete_fields = ["person"]
    fields = ("person", "role", "character_name")
    show_change_link = True


# ---------------------------
# Movie Admin
# ---------------------------
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "imdb_id",
        "release_date",
        # "imdb_rating",
        # "views",
        "is_active",
        "created_at",
        "updated_at",
    )
    list_filter = (
        "is_active",
        "release_date",
        "genres",
        "created_at",
    )
    search_fields = (
        "title",
        "original_title",
        "imdb_id",
    )
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ["genres"]
    ordering = ("-release_date", "-created_at")
    readonly_fields = ("views", "created_at", "updated_at")

    inlines = [
        MovieCastInline, 
        MovieGalleryInline
    ]

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "imdb_id",
                    "title",
                    "original_title",
                    "slug",
                    "description",
                )
            },
        ),
        (
            "Details",
            {
                "fields": (
                    "release_date",
                    "runtime",
                    "genres",
                )
            },
        ),
        (
            "IMDb Data",
            {
                "fields": (
                    "imdb_rating",
                    "imdb_votes",
                )
            },
        ),
        (
            "Media",
            {
                "fields": (
                    "poster",
                    "backdrop",
                )
            },
        ),
        (
            "Status & Stats",
            {
                "fields": (
                    "is_active",
                    "views",
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
