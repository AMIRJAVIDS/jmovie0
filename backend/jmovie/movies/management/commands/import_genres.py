from django.core.management.base import BaseCommand

from movies.services.tmdb import TMDBClient
from genres.models import Genre


class Command(BaseCommand):

    def handle(self, *args, **options):

        client = TMDBClient()

        genres = client.get_genres(language="en-US")

        self.stdout.write(
            f"Found {len(genres)} genres"
        )

        for item in genres:

            genre, created = Genre.objects.update_or_create(
                tmdb_id=item["id"],
                defaults={
                    "name": item["name"],
                }
            )

            if created:
                self.stdout.write(
                    f"Created: {genre.name}"
                )
            else:
                self.stdout.write(
                    f"Updated: {genre.name}"
                )