from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response

from movies.models import Movie
from series.models import Series
from people.models import Person   # ← مسیر اپ بازیگرها رو تنظیم کن

from movies.serializers import MovieListSerializer    # ← اسم سریالایزر لیست فیلم
from series.serializers import SeriesListSerializer
from people.serializers import PersonSerializer


class GlobalSearchView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "").strip()

        if not q:
            return Response({"movies": [], "series": [], "people": []})

        movies = Movie.objects.filter(
            Q(title__icontains=q)
            | Q(original_title__icontains=q)
            | Q(imdb_id__icontains=q)
        )[:10]

        series = Series.objects.filter(
            Q(title__icontains=q)
            | Q(original_title__icontains=q)
            | Q(imdb_id__icontains=q)
        )[:10]

        people = Person.objects.filter(
            Q(name__icontains=q)
            | Q(original_name__icontains=q)   # اگه این فیلد رو داری بازش کن
        )[:10]

        return Response({
            "movies": MovieListSerializer(movies, many=True, context={"request": request}).data,
            "series": SeriesListSerializer(series, many=True, context={"request": request}).data,
            "people": PersonSerializer(people, many=True, context={"request": request}).data,
        })
        

class MovieSearchView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "").strip()

        if not q:
            return Response([])

        movies = Movie.objects.filter(
            Q(title__icontains=q) |
            Q(original_title__icontains=q) |
            Q(imdb_id__icontains=q)
        )

        return Response(
            MovieListSerializer(
                movies,
                many=True,
                context={"request": request}
            ).data
        )


class SeriesSearchView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "").strip()

        if not q:
            return Response([])

        series = Series.objects.filter(
            Q(title__icontains=q) |
            Q(original_title__icontains=q) |
            Q(imdb_id__icontains=q)
        )

        return Response(
            SeriesListSerializer(
                series,
                many=True,
                context={"request": request}
            ).data
        )
