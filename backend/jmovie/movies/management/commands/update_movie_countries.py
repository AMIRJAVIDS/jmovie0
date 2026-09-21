from concurrent.futures import ThreadPoolExecutor, as_completed

from django.core.management.base import BaseCommand

from movies.models import Movie
from movies.services.tmdb import TMDBClient


MAX_WORKERS = 8


class Command(BaseCommand):
    help = "Update movie countries from TMDB"

    def handle(self, *args, **kwargs):

        movies = list(
            Movie.objects.exclude(
                tmdb_id__isnull=True
            )
        )

        total = len(movies)

        self.stdout.write(
            self.style.SUCCESS(
                f"Found {total} movies"
            )
        )

        client = TMDBClient()

        def worker(movie):

            try:

                data = client.movie_details(
                    movie.tmdb_id,
                    language="en-US"
                )

                countries = data.get("production_countries", [])

                movie.country = (
                    countries[0]["name"]
                    if countries
                    else ""
                )

                movie.country = countries

                return movie

            except Exception as e:

                self.stdout.write(
                    self.style.ERROR(
                        f"{movie.imdb_id}: {e}"
                    )
                )

                return None

        updated_movies = []

        with ThreadPoolExecutor(
            max_workers=MAX_WORKERS
        ) as executor:

            futures = [
                executor.submit(worker, movie)
                for movie in movies
            ]

            for index, future in enumerate(
                as_completed(futures),
                start=1
            ):

                movie = future.result()

                if movie:
                    updated_movies.append(movie)

                if index % 50 == 0 or index == total:
                    self.stdout.write(
                        f"{index}/{total}"
                    )

        Movie.objects.bulk_update(
            updated_movies,
            ["country"],
            batch_size=500,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Updated {len(updated_movies)} movies."
            )
        )