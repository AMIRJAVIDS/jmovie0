from concurrent.futures import ThreadPoolExecutor, as_completed

from django.core.management.base import BaseCommand
from django.db import transaction

from series.models import Series, Episode
from movies.services.tmdb import TMDBClient


MAX_WORKERS = 8


class Command(BaseCommand):
    help = "Update all series episodes (fast)"


    def handle(self, *args, **kwargs):

        tmdb = TMDBClient()

        series_list = (
            Series.objects
            .exclude(tmdb_id__isnull=True)
            .prefetch_related(
                "seasons",
                "seasons__episodes",
            )
        )

        total = series_list.count()

        self.stdout.write(
            self.style.SUCCESS(
                f"Found {total} series"
            )
        )

        success = 0
        failed = 0

        with ThreadPoolExecutor(
            max_workers=MAX_WORKERS
        ) as executor:

            futures = {
                executor.submit(
                    self.process_series,
                    tmdb,
                    series
                ): series
                for series in series_list
            }

            for index, future in enumerate(
                as_completed(futures),
                start=1
            ):

                series = futures[future]

                try:

                    future.result()

                    success += 1

                except Exception as e:

                    failed += 1

                    self.stdout.write(
                        self.style.ERROR(
                            f"{series.title}: {e}"
                        )
                    )

                if index % 20 == 0 or index == total:

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"{index}/{total} | Success: {success} | Failed: {failed}"
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nFinished\nSuccess: {success}\nFailed: {failed}"
            )
        )


    def process_series(
        self,
        tmdb,
        series,
    ):

        for season in series.seasons.all():

            fa_data = tmdb.season_details(
                series.tmdb_id,
                season.season_number,
                language="fa-IR"
            )

            en_data = tmdb.season_details(
                series.tmdb_id,
                season.season_number,
                language="en-US"
            )

            fa_episodes = {
                ep["episode_number"]: ep
                for ep in fa_data.get(
                    "episodes",
                    []
                )
            }

            en_episodes = {
                ep["episode_number"]: ep
                for ep in en_data.get(
                    "episodes",
                    []
                )
            }

            existing = {
                ep.episode_number: ep
                for ep in season.episodes.all()
            }

            to_update = []

            for number, en_ep in en_episodes.items():

                episode = existing.get(number)

                if not episode:
                    continue

                fa_ep = fa_episodes.get(
                    number,
                    {}
                )

                episode.title = (
                    fa_ep.get("name")
                    or en_ep.get("name")
                )

                episode.description = (
                    fa_ep.get("overview")
                    or en_ep.get("overview")
                )

                episode.runtime = (
                    en_ep.get("runtime")
                    or None
                )

                episode.air_date = (
                    en_ep.get("air_date")
                    or None
                )

                to_update.append(
                    episode
                )

            if to_update:

                with transaction.atomic():

                    Episode.objects.bulk_update(
                        to_update,
                        [
                            "title",
                            "description",
                            "runtime",
                            "air_date",
                        ],
                        batch_size=500,
                    )