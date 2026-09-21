from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "content_object",
        "short_text",
        "is_active",
        "is_approved",
        "created_at",
    )

    list_filter = (
        "is_active",
        "is_approved",
        "content_type",
    )

    search_fields = (
        "text",
        "user__email",
        "user__username",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )

    actions = (
        "approve_comments",
        "deactivate_comments",
    )

    def short_text(self, obj):
        return obj.text[:50]

    short_text.short_description = "Comment"

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)

    approve_comments.short_description = "Approve selected comments"

    def deactivate_comments(self, request, queryset):
        queryset.update(is_active=False)

    deactivate_comments.short_description = "Deactivate selected comments"
