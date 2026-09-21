import json

from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType

from movies.models import Movie
from downloads.models import Download


class Command(BaseCommand):
    help = "Import movie downloads from json"

    def add_arguments(self, parser):
        parser.add_argument(
            "json_file",
            type=str,
            help="Path to json file"
        )

    def handle(self, *args, **options):

        json_file = options["json_file"]

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        movie_ct = ContentType.objects.get_for_model(Movie)

        created = 0
        skipped = 0
        not_found = 0

        for item in data["movies"]:

            imdb_id = item["imdb_id"]

            try:
                movie = Movie.objects.get(imdb_id=imdb_id)

            except Movie.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(
                        f"Movie not found: {imdb_id}"
                    )
                )
                not_found += 1
                continue

            for download in item["downloads"]:

                download_type = download["type"]

                language = (
                    "dubbed"
                    if download_type.lower() == "dubbed"
                    else "original"
                )

                subtitle = (
                    download_type.lower() == "softsub"
                )

                obj, is_created = Download.objects.get_or_create(
                    content_type=movie_ct,
                    object_id=movie.id,
                    url=download["url"],
                    defaults={
                        "title": movie.title,
                        "quality": download["quality"],
                        "language": language,
                        "subtitle": subtitle,
                        "size": download["size"],
                        "is_active": True,
                        "is_vip": False,
                    },
                )

                if is_created:
                    created += 1
                else:
                    skipped += 1

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(f"Created : {created}")
        )
        self.stdout.write(
            self.style.WARNING(f"Skipped : {skipped}")
        )
        self.stdout.write(
            self.style.WARNING(f"Movies not found : {not_found}")
        )