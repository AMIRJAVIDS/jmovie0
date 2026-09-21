from rest_framework import serializers


from genres.serializers import GenreSerializer
from downloads.serializers import DownloadSerializer
from comments.serializers import CommentSerializer
from django.contrib.auth import get_user_model

# models
from movies.models import Movie
from series.models import Series
from genres.models import Genre
from downloads.models import Download
from comments.models import Comment
User = get_user_model()


# ==========================
# Admin - movies
# ==========================

class AdminMovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        source="genres",
        required=False,
    )
    
    downloads = serializers.PrimaryKeyRelatedField(
        queryset=Download.objects.all(),
        many=True,
        required=False
    )
    comments = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(),
        many=True,
        required=False
    )
    imdb_rating = serializers.DecimalField(
        max_digits=3, 
        decimal_places=1, 
        required=False, 
        allow_null=True
    )

    runtime = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    views = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    release_date = serializers.DateField(required=False, allow_null=True)
    poster = serializers.ImageField(required=False, allow_null=True)
    backdrop = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Movie
        fields = "__all__"
        

    def create(self, validated_data):
        genres = validated_data.pop("genres", None)
        downloads = validated_data.pop("downloads", None)
        comments = validated_data.pop("comments", None)

        movie = Movie.objects.create(**validated_data)

        if genres is not None:
            movie.genres.set(genres)

        if downloads is not None:
            movie.downloads.set(downloads)

        if comments is not None:
            movie.comments.set(comments)

        return movie

    def update(self, instance, validated_data):
        genres = validated_data.pop("genres", None)
        downloads = validated_data.pop("downloads", None)
        comments = validated_data.pop("comments", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if genres is not None:
            instance.genres.set(genres)

        if downloads is not None:
            instance.downloads.set(downloads)

        if comments is not None:
            instance.comments.set(comments)

        return instance





# ==========================
# Admin - series
# ==========================


class AdminSeriesSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        source="genres",
        required=False,
    )
    
    imdb_rating = serializers.DecimalField(
        max_digits=3,
        decimal_places=1,
        required=False,
        allow_null=True
    )
    runtime = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    views = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    poster = serializers.ImageField(required=False, allow_null=True)
    backdrop = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Series
        fields = "__all__"

    def create(self, validated_data):
        genres = validated_data.pop("genres", [])
        series = Series.objects.create(**validated_data)

        if genres:
            series.genres.set(genres)

        return series

    def update(self, instance, validated_data):
        genres = validated_data.pop("genres", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if genres is not None:
            instance.genres.set(genres)

        return instance
    
    
    

# ==========================
# Admin - Users
# ==========================



class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "is_active",
            "is_staff",
            "is_vip",
            "date_joined",
            "last_login",
        ]
        read_only_fields = [
            "id",
            "date_joined",
            "last_login",
            "is_superuser",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_password("12345678")

        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


# ==========================
# Admin - genres
# ==========================

class AdminGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = [
            "id",
            "name",
            "slug",
        ]
        read_only_fields = ["id"]
