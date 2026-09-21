from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from genres.models import Genre


class Command(BaseCommand):
    help = "Fix genres imported from TMDB"

    def handle(self, *args, **options):

        merge_map = {
            "Animation": "انیمیشن",
            "Comedy": "کمدی",
            "Crime": "جنایی",
            "Documentary": "مستند",
            "Drama": "درام",
            "Family": "خانوادگی",
            "Mystery": "معمایی",
            "Romance": "عاشقانه",
            "Western": "وسترن",
        }

        tv_tmdb_ids = {
            "Action & Adventure": 10759,
            "Kids": 10762,
            "Reality": 10764,
            "Sci-Fi & Fantasy": 10765,
            "Soap": 10766,
            "Talk": 10767,
            "War & Politics": 10768,
        }

        with transaction.atomic():

            # -----------------------------
            # Merge duplicate genres
            # -----------------------------
            for en_name, fa_name in merge_map.items():

                try:
                    en = Genre.objects.get(name=en_name)
                    fa = Genre.objects.get(name=fa_name)
                except Genre.DoesNotExist:
                    self.stdout.write(f"Skip: {en_name}")
                    continue

                # Movies
                for movie in en.movies.all():
                    movie.genres.add(fa)

                # Series
                for series in en.series.all():
                    series.genres.add(fa)

                en.delete()

                self.stdout.write(
                    self.style.SUCCESS(f"Merged {en_name} -> {fa_name}")
                )

            # -----------------------------
            # Fix TV Genre IDs
            # -----------------------------
            for name, tmdb_id in tv_tmdb_ids.items():

                try:
                    genre = Genre.objects.get(name=name)
                except Genre.DoesNotExist:
                    continue

                genre.tmdb_id = tmdb_id
                genre.slug = slugify(f"{genre.name}-{tmdb_id}")
                genre.save(update_fields=["tmdb_id", "slug"])

                self.stdout.write(
                    self.style.SUCCESS(f"Updated {name}")
                )

            # -----------------------------
            # Rebuild slugs
            # -----------------------------
            for genre in Genre.objects.all():

                genre.slug = slugify(
                    f"{genre.name}-{genre.tmdb_id}"
                )

                genre.save(update_fields=["slug"])

        self.stdout.write(
            self.style.SUCCESS("Finished successfully.")
        )