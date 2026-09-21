from rest_framework import serializers
from .models import Download


class DownloadSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    
    def get_url(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return obj.url

        return None
    
    class Meta:
        model = Download
        fields = "__all__"


# class DownloadCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Download
#         fields = (
#             "content_type",
#             "object_id",
#             "title",
#             "quality",
#             "language",
#             "size",
#             "url",
#             "is_vip",
#         )
