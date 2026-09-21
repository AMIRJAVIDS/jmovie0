from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    User,
    UserList,
    UserListItem,
    MovieUserStatus,
    SeriesUserStatus,
    EpisodeWatchStatus,
)


# ---------------------------
# User Admin
# ---------------------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "username",
        "is_vip",
        "is_staff",
        "is_active",
        "date_joined",
    )
    list_filter = (
        "is_vip",
        "is_staff",
        "is_active",
    )
    search_fields = (
        "email",
        "username",
    )
    ordering = ("-date_joined",)
    filter_horizontal = ("favorite_genres",)

    fieldsets = (
        (
            "Account",
            {
                "fields": (
                    "email",
                    "username",
                    "password",
                )
            },
        ),
        (
            "Profile",
            {
                "fields": (
                    "avatar",
                    "favorite_genres",
                    "is_vip",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


# ---------------------------
# User List Item Inline
# ---------------------------
class UserListItemInline(admin.TabularInline):
    model = UserListItem
    extra = 1
    readonly_fields = ("created_at",)


# ---------------------------
# User List Admin
# ---------------------------
@admin.register(UserList)
class UserListAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "is_public",
        "created_at",
    )
    list_filter = (
        "is_public",
        "created_at",
    )
    search_fields = (
        "title",
        "user__email",
    )
    ordering = ("-created_at",)
    inlines = [UserListItemInline]


# ---------------------------
# Movie User Status
# ---------------------------
@admin.register(MovieUserStatus)
class MovieUserStatusAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "movie",
        "status",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = (
        "user__email",
        "movie__title",
    )
    autocomplete_fields = ("user", "movie")
    ordering = ("-created_at",)


# ---------------------------
# Series User Status
# ---------------------------
@admin.register(SeriesUserStatus)
class SeriesUserStatusAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "series",
        "status",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = (
        "user__email",
        "series__title",
    )
    autocomplete_fields = ("user", "series")
    ordering = ("-created_at",)


# ---------------------------
# Episode Watch Status
# ---------------------------
@admin.register(EpisodeWatchStatus)
class EpisodeWatchStatusAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "episode",
        "watched_at",
    )
    search_fields = (
        "user__email",
        "episode__title",
    )
    autocomplete_fields = ("user", "episode")
    ordering = ("-watched_at",)
