from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()


from .models import Comment

class CommentUserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "avatar"]

    def get_avatar(self, obj):
        if not obj.avatar:
            return None
        request = self.context.get("request")
        url = obj.avatar.url
        return request.build_absolute_uri(url) if request else url


class CommentSerializer(serializers.ModelSerializer):
    user = CommentUserSerializer(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id",
            "user",
            "text",
            "parent",
            "replies",
            "created_at",
        )
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "replies",
        )

    def get_replies(self, obj):
        qs = obj.replies.filter(is_active=True, is_approved=True)
        return CommentSerializer(qs, many=True, context=self.context).data



class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            "text",
            "parent",
            "content_type",
            "object_id",
        )

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["user"] = request.user
        return super().create(validated_data)
