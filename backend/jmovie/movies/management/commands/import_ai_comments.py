import json
import random

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from backend.jmovie.movies.models import Movie
from backend.jmovie.comments.models import Comment


User = get_user_model()


class Command(BaseCommand):
    help = "Import AI comments"

    def add_arguments(self, parser):
        parser.add_argument("file", type=str)

    def handle(self, *args, **options):

        users = list(
            User.objects.filter(
                id__gte=1,
                id__lte=21
            )
        )

        if len(users) < 10:
            self.stdout.write(
                self.style.ERROR(
                    "At least 10 users are required."
                )
            )
            return

        with open(
            options["file"],
            "r",
            encoding="utf-8"
        ) as f:
            data = json.load(f)

        for item in data:

            imdb_id = item["imdb_id"]

            try:
                movie = Movie.objects.get(
                    imdb_id=imdb_id
                )
            except Movie.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f"Movie not found: {imdb_id}"
                    )
                )
                continue

            # جلوگیری از ایمپورت دوباره
            if movie.comments.exists():
                self.stdout.write(
                    self.style.WARNING(
                        f"Skip {movie.title}"
                    )
                )
                continue

            selected_users = random.sample(
                users,
                min(
                    len(item["comments"]),
                    len(users)
                )
            )

            for user, text in zip(
                selected_users,
                item["comments"]
            ):

                Comment.objects.create(
                    content_object=movie,
                    user=user,
                    text=text,
                    is_active=True,
                    is_approved=True,
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"{movie.title}: "
                    f"{len(item['comments'])} comments"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Import completed."
            )
        )