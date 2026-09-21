from rest_framework import serializers

from .models import Person, PersonImage
from movies.models import Movie, MovieCast


# حداکثر تعداد فیلمی که در پروفایل یک بازیگر برمی‌گردانیم. بدون این حد،
# فیلموگرافی بازیگرهای پرکار (صدها آیتم) بدون pagination در یک ریسپانس
# retrieve ریخته می‌شد که هم پرفورمنس را پایین می‌آورد هم می‌توانست به‌عنوان
# یک بردار ساده‌ی DoS (درخواست مکرر به یک پروفایل سنگین) سوءاستفاده شود.
MAX_FILMOGRAPHY_ITEMS = 40


class PersonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonImage
        fields = (
            "id",
            "image",
            "is_primary",
        )


class PersonSerializer(serializers.ModelSerializer):
    # قبلاً "source" ست نشده بود؛ چون related_name واقعی روی مدل "images"
    # است نه "gallery"، به‌محض فعال شدن این فیلد (خارج کردن از کامنت) با
    # AttributeError مواجه می‌شد.
    gallery = PersonImageSerializer(many=True, read_only=True, source="images")

    # profile_image از فایل مدل خوانده می‌شود؛ برای انتخاب هوشمند بین فایل
    # محلی و URL خارجی TMDB از property مدل استفاده می‌کنیم.
    display_image = serializers.ReadOnlyField()

    movies = serializers.SerializerMethodField()
    # series = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = (
            "id",
            "tmdb_id",
            "name",
            "original_name",
            "slug",
            "biography",
            "birth_date",
            "death_date",
            "place_of_birth",
            "profile_image_url",
            "display_image",
            "gallery",
            "popularity",
            "movies",
            # "series",
        )

    def get_movies(self, obj):
        # چون یک بازیگر ممکن است بیش از یک نقش (رکورد MovieCast) در همان
        # فیلم داشته باشد، قبلاً همان فیلم چندبار در خروجی تکرار می‌شد.
        # با distinct روی movie_id این تکرار حذف می‌شود.
        movie_ids = (
            MovieCast.objects.filter(person=obj, role=MovieCast.ROLE_ACTOR)
            .values_list("movie_id", flat=True)
            .distinct()
        )

        movies = Movie.objects.filter(id__in=movie_ids).order_by("-release_date")[
            :MAX_FILMOGRAPHY_ITEMS
        ]

        from movies.serializers import MovieListSerializer
        return MovieListSerializer(
            movies,
            many=True,
            context=self.context,
        ).data

    # def get_series(self, obj):
    #     series_ids = (
    #         SeriesCast.objects.filter(person=obj, role=SeriesCast.ROLE_ACTOR)
    #         .values_list("series_id", flat=True)
    #         .distinct()
    #     )
    #     series = Series.objects.filter(id__in=series_ids)[:MAX_FILMOGRAPHY_ITEMS]
    #
    #     from series.serializers import SeriesListSerializer
    #     return SeriesListSerializer(
    #         series,
    #         many=True,
    #         context=self.context,
    #     ).data