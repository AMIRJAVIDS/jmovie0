import json
import random

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from backend.jmovie.series.models import Series
from backend.jmovie.comments.models import Comment

User = get_user_model()


class Command(BaseCommand):
    help = "Import AI comments for series"

    def add_arguments(self, parser):
        parser.add_argument("file", type=str)

    def handle(self, *args, **options):

        users = list(
            User.objects.filter(
                id__gte=1,
                id__lte=21
            )
        )

        with open(
            options["file"],
            "r",
            encoding="utf-8"
        ) as f:
            data = json.load(f)

        for item in data:

            try:
                series = Series.objects.get(
                    imdb_id=item["imdb_id"]
                )
            except Series.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f"Series not found: {item['imdb_id']}"
                    )
                )
                continue

            if series.comments.exists():
                self.stdout.write(
                    self.style.WARNING(
                        f"Skip {series.title}"
                    )
                )
                continue

            selected_users = random.sample(
                users,
                min(
                    10,
                    len(users)
                )
            )

            for user, text in zip(
                selected_users,
                item["comments"]
            ):

                Comment.objects.create(
                    content_object=series,
                    user=user,
                    text=text,
                    is_active=True,
                    is_approved=True,
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"{series.title}: imported"
                )
            )