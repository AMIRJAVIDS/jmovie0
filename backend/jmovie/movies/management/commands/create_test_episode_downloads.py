from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType

from backend.jmovie.movies.models import Movie
from backend.jmovie.downloads.models import Download


class Command(BaseCommand):
    help = "Create test download links for all episodes"

    def handle(self, *args, **kwargs):

        movie_ct = ContentType.objects.get_for_model(Movie)

        qualities = [
            ("480p", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcdKnLAC3h8umBZYFDgixXC8-hBkkUoTRR5ukGzhguRA&s=10"),
            ("720p", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcdKnLAC3h8umBZYFDgixXC8-hBkkUoTRR5ukGzhguRA&s=10"),
            ("1080p", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcdKnLAC3h8umBZYFDgixXC8-hBkkUoTRR5ukGzhguRA&s=10"),
        ]

        created_count = 0

        for movie in Movie.objects.all():

            for quality, url in qualities:

                Download.objects.update(
                    subtitle=True,
                    is_vip=True
                )

                created_count += 1

            self.stdout.write(
                f"Added downloads for S{Movie.original_title}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Total created: {created_count}"
            )
        )