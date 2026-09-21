from django.db.models import Q

from movies.models import Movie
from series.models import Series


def search_local_movies(query: str):
    """
    Search movies and series in JMovie database.
    """

    query = query.strip()

    if not query:
        return {
            "movies": [],
            "series": [],
        }

    # Search movies
    movies = Movie.objects.filter(
        Q(title__icontains=query)
        | Q(original_title__icontains=query)
        | Q(imdb_id__icontains=query)
    ).filter(
        is_active=True
    )[:10]

    # Search series
    # Series model does not have is_active field.
    series = Series.objects.filter(
        Q(title__icontains=query)
        | Q(original_title__icontains=query)
        | Q(imdb_id__icontains=query)
    )[:10]

    return {
        "movies": [
            {
                "id": movie.id,
                "imdb_id": movie.imdb_id,
                "title": movie.title,
                "original_title": movie.original_title,
                "year": movie.year,
                "rating": (
                    float(movie.imdb_rating)
                    if movie.imdb_rating is not None
                    else None
                ),
                "slug": movie.slug,
                "media_type": "movie",
                "url": f"/movie/{movie.slug}",
            }
            for movie in movies
        ],

        "series": [
            {
                "id": series.id,
                "imdb_id": series.imdb_id,
                "title": series.title,
                "original_title": series.original_title,
                "year": series.year,
                "rating": (
                    float(series.imdb_rating)
                    if series.imdb_rating is not None
                    else None
                ),
                "slug": series.slug,
                "media_type": "series",
                "url": f"/series/{series.slug}",
            }
            for series in series
        ],
    }