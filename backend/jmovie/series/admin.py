from django.contrib import admin

from .models import Series, Season, Episode, SeriesCast


# --------------------------------------------------
# Episode Inline
# --------------------------------------------------
class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 0
    fields = (
        "episode_number",
        "title",
        "runtime",
        "air_date",
    )
    ordering = ("episode_number",)
    show_change_link = True


# --------------------------------------------------
# Season Inline
# --------------------------------------------------
class SeasonInline(admin.StackedInline):
    model = Season
    extra = 0
    fields = (
        "season_number",
        "title",
        "description",
        "release_date",
        "poster",
    )
    show_change_link = True


# --------------------------------------------------
# Series Cast Inline
# --------------------------------------------------
class SeriesCastInline(admin.TabularInline):
    model = SeriesCast
    extra = 0
    autocomplete_fields = ("person",)
    fields = (
        "person",
        "role",
        "character_name",
    )


# --------------------------------------------------
# Season Admin
# --------------------------------------------------
@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = (
        "series",
        "season_number",
        "release_date",
    )
    list_filter = (
        "series",
    )
    search_fields = (
        "series__title",
        "season_number",
    )
    ordering = ("series", "season_number")
    inlines = [EpisodeInline]


# --------------------------------------------------
# Episode Admin
# --------------------------------------------------
@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "season",
        "episode_number",
        "air_date",
        "runtime",
    )
    list_filter = (
        "season__series",
        "season",
    )
    search_fields = (
        "title",
        "season__series__title",
    )
    ordering = ("season", "episode_number")


# --------------------------------------------------
# Series Admin
# --------------------------------------------------
@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "imdb_id",
        "start_date",
        "end_date",
        "is_ended",
        "imdb_rating",
        "views",
    )

    list_filter = (
        "is_ended",
        "genres",
    )

    search_fields = (
        "title",
        "original_title",
        "imdb_id",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    autocomplete_fields = (
        "genres",
    )

    readonly_fields = (
        "views",
        "created_at",
        "updated_at",
    )

    inlines = (
        SeasonInline,
        SeriesCastInline,
    )

    fieldsets = (
        ("Basic Info", {
            "fields": (
                "imdb_id",
                "tmdb_id",
                "title",
                "original_title",
                "slug",
                "description",
            )
        }),
        ("Dates", {
            "fields": (
                "start_date",
                "end_date",
                "is_ended",
            )
        }),
        ("Media", {
            "fields": (
                "poster",
                "backdrop",
            )
        }),
        ("Ratings & Stats", {
            "fields": (
                "imdb_rating",
                "imdb_votes",
                "views",
            )
        }),
        ("Genres", {
            "fields": (
                "genres",
            )
        }),
        ("System", {
            "fields": (
                "created_at",
                "updated_at",
            )
        }),
    )


# --------------------------------------------------
# Series Cast Admin
# --------------------------------------------------
@admin.register(SeriesCast)
class SeriesCastAdmin(admin.ModelAdmin):
    list_display = (
        "series",
        "person",
        "role",
        "character_name",
    )

    list_filter = (
        "role",
        "series",
    )

    search_fields = (
        "series__title",
        "person__name",
        "character_name",
    )

    autocomplete_fields = (
        "series",
        "person",
    )
