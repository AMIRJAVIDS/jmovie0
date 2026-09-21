from django.core.management.base import BaseCommand

from movies.models import Movie


class Command(BaseCommand):

    help = "Test import movies command"

    def add_arguments(self, parser):
        parser.add_argument(
            "file",
            type=str,
            help="Path to imdb ids file"
        )

    def handle(self, *args, **options):

        file_path = options["file"]

        with open(
            file_path,
            encoding="utf-8"
        ) as f:

            imdb_ids = [
                line.strip()
                for line in f
                if line.strip()
            ]

        self.stdout.write(
            self.style.SUCCESS(
                f"Found {len(imdb_ids)} imdb ids"
            )
        )

        movies = Movie.objects.filter(
            imdb_id__in=imdb_ids
        )

        count = movies.count()

        self.stdout.write(
            self.style.WARNING(
                f"Found {count} movies in database"
            )
        )

        deleted, details = movies.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"Deleted {deleted} objects"
            )
        )