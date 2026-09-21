from rest_framework import serializers

from .models import Movie, MovieCast, MovieGalleryImage
from genres.serializers import GenreMinimalSerializer
from people.serializers import PersonSerializer
from downloads.serializers import DownloadSerializer
from comments.serializers import CommentSerializer


class MovieGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieGalleryImage
        fields = ["id", "image","image_url", "caption", "order"]


class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreMinimalSerializer(many=True)
    
    filter

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "original_title",
            "year",
            "description",
            "runtime",
            "imdb_rating",
            "slug",
            # "poster",
            "poster_url",
            "backdrop_url",
            "genres",
            "country",
            "release_date",
        ]


class MovieCastSerializer(serializers.ModelSerializer):
    person = PersonSerializer()

    class Meta:
        model = MovieCast
        fields = [
            "person",
            "role",
            "character_name",
            # "order",
        ]


class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreMinimalSerializer(many=True)
    # cast = MovieCastSerializer(many=True)
    cast = MovieCastSerializer(
        source="movie_cast",
        many=True,
        read_only=True,
    )
    downloads = DownloadSerializer(many=True, read_only=True)
    gallery = MovieGalleryImageSerializer(many=True, read_only=True)
    

    class Meta:
        model = Movie
        fields = "__all__"
        
        
