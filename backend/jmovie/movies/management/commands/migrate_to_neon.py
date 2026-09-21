from collections import defaultdict

from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import connections, transaction
from django.db.models import ForeignKey, ManyToManyField
from django.contrib.contenttypes.models import ContentType


CHUNK_SIZE = 5000


class Command(BaseCommand):
    help = "Copy SQLite database to PostgreSQL (Neon)"

    SQLITE = "default"
    POSTGRES = "neon"

    ####################################################################
    # Models order
    ####################################################################

    MODEL_ORDER = [

        ("contenttypes", "ContentType"),

        ("accounts", "User"),

        ("genres", "Genre"),

        ("people", "Person"),

        ("movies", "Movie"),
        ("series", "Series"),

        ("series", "Season"),
        ("series", "Episode"),

        ("movies", "MovieCast"),
        ("series", "SeriesCast"),

        ("movies", "MovieGalleryImage"),
        ("series", "SeriesGalleryImage"),

        ("people", "PersonImage"),

        ("downloads", "Download"),

        ("comments", "Comment"),
    ]

    ####################################################################
    # Handle
    ####################################################################

    def handle(self, *args, **options):

        self.stdout.write("")
        self.stdout.write("=" * 70)
        self.stdout.write(self.style.SUCCESS("SQLite  --->  PostgreSQL"))
        self.stdout.write("=" * 70)
        self.stdout.write("")

        self.copy_models()

        self.copy_many_to_many()

        self.reset_sequences()

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("Migration completed successfully.")
        )

    ####################################################################
    # Copy models
    ####################################################################

    def copy_models(self):

        for app_label, model_name in self.MODEL_ORDER:

            model = apps.get_model(
                app_label,
                model_name
            )

            self.copy_model(model)

    ####################################################################
    # Copy one model
    ####################################################################

    def copy_model(self, model):

        total = model.objects.using(
            self.SQLITE
        ).count()

        if total == 0:

            self.stdout.write(
                f"{model.__name__:<30} 0"
            )

            return

        self.stdout.write(
            f"{model.__name__:<30} {total}"
        )

        created = 0

        batch = []

        queryset = model.objects.using(
            self.SQLITE
        ).all().iterator(
            chunk_size=CHUNK_SIZE
        )

        for obj in queryset:

            batch.append(
                self.clone_instance(obj)
            )

            if len(batch) >= CHUNK_SIZE:

                self.bulk_insert(
                    model,
                    batch
                )

                created += len(batch)

                self.progress(
                    model.__name__,
                    created,
                    total
                )

                batch.clear()

        if batch:

            self.bulk_insert(
                model,
                batch
            )

            created += len(batch)

            self.progress(
                model.__name__,
                created,
                total
            )

        self.stdout.write("")
    ####################################################################
    # Clone object
    ####################################################################

    def clone_instance(self, obj):

        model = obj.__class__

        new = model()

        for field in model._meta.concrete_fields:

            # AutoField / BigAutoField
            if field.primary_key:
                setattr(
                    new,
                    field.attname,
                    getattr(obj, field.attname)
                )
                continue

            # ForeignKey
            if isinstance(field, ForeignKey):

                setattr(
                    new,
                    field.attname,
                    getattr(obj, field.attname)
                )

                continue

            setattr(
                new,
                field.attname,
                getattr(obj, field.attname)
            )

        return new

    ####################################################################
    # Bulk insert
    ####################################################################

    def bulk_insert(
        self,
        model,
        objects
    ):

        with transaction.atomic(
            using=self.POSTGRES
        ):

            model.objects.using(
                self.POSTGRES
            ).bulk_create(
                objects,
                batch_size=CHUNK_SIZE,
                ignore_conflicts=True,
            )

    ####################################################################
    # Progress
    ####################################################################

    def progress(
        self,
        name,
        current,
        total
    ):

        percent = (
            current / total
        ) * 100

        self.stdout.write(
            f"\r{name:<30}"
            f"{current}/{total}"
            f" ({percent:.1f}%)",
            ending=""
        )

    ####################################################################
    # Many To Many
    ####################################################################

    def copy_many_to_many(self):

        self.stdout.write("")
        self.stdout.write("=" * 70)
        self.stdout.write("Copy ManyToMany")
        self.stdout.write("=" * 70)

        self.copy_m2m_model(
            "movies",
            "Movie",
            "genres"
        )

        self.copy_m2m_model(
            "series",
            "Series",
            "genres"
        )

    ####################################################################
    # One M2M
    ####################################################################

    def copy_m2m_model(
        self,
        app_label,
        model_name,
        field_name
    ):

        model = apps.get_model(
            app_label,
            model_name
        )

        field = model._meta.get_field(
            field_name
        )

        through = field.remote_field.through

        self.stdout.write(
            f"{through.__name__}"
        )

        rows = list(

            through.objects.using(
                self.SQLITE
            ).all()

        )

        if not rows:

            return

        copies = []

        for row in rows:

            new = through()

            for f in through._meta.concrete_fields:

                setattr(
                    new,
                    f.attname,
                    getattr(
                        row,
                        f.attname
                    )
                )

            copies.append(
                new
            )

        through.objects.using(
            self.POSTGRES
        ).bulk_create(

            copies,

            ignore_conflicts=True,

            batch_size=CHUNK_SIZE

        )

        self.stdout.write(
            self.style.SUCCESS(
                f"{len(copies)} rows"
            )
        )
    ####################################################################
    # Reset PostgreSQL sequences
    ####################################################################

    def reset_sequences(self):

        self.stdout.write("")
        self.stdout.write("=" * 70)
        self.stdout.write("Reset PostgreSQL sequences")
        self.stdout.write("=" * 70)

        connection = connections[self.POSTGRES]

        with connection.cursor() as cursor:

            for model in apps.get_models():

                table = model._meta.db_table

                pk = model._meta.pk

                if not pk:
                    continue

                if pk.get_internal_type() not in (
                    "AutoField",
                    "BigAutoField",
                    "SmallAutoField",
                ):
                    continue

                cursor.execute(
                    """
                    SELECT pg_get_serial_sequence(%s, %s)
                    """,
                    [
                        table,
                        pk.column
                    ]
                )

                result = cursor.fetchone()

                if not result:
                    continue

                sequence = result[0]

                if not sequence:
                    continue

                cursor.execute(
                    f"""
                    SELECT
                        setval(
                            '{sequence}',
                            COALESCE(
                                (
                                    SELECT MAX({pk.column})
                                    FROM {table}
                                ),
                                1
                            ),
                            true
                        );
                    """
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"{table}"
                    )
                )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "Sequences updated."
            )
        )

    ####################################################################
    # Database statistics
    ####################################################################

    def print_statistics(self):

        self.stdout.write("")
        self.stdout.write("=" * 70)
        self.stdout.write("Statistics")
        self.stdout.write("=" * 70)

        for app_label, model_name in self.MODEL_ORDER:

            model = apps.get_model(
                app_label,
                model_name
            )

            sqlite_count = model.objects.using(
                self.SQLITE
            ).count()

            postgres_count = model.objects.using(
                self.POSTGRES
            ).count()

            self.stdout.write(
                f"{model.__name__:<30}"
                f"{sqlite_count:<10}"
                f"{postgres_count:<10}"
            )

        self.stdout.write("")

    ####################################################################
    # Verify migration
    ####################################################################

    def verify(self):

        failed = []

        for app_label, model_name in self.MODEL_ORDER:

            model = apps.get_model(
                app_label,
                model_name
            )

            sqlite_count = model.objects.using(
                self.SQLITE
            ).count()

            postgres_count = model.objects.using(
                self.POSTGRES
            ).count()

            if sqlite_count != postgres_count:

                failed.append(
                    (
                        model.__name__,
                        sqlite_count,
                        postgres_count,
                    )
                )

        if failed:

            self.stdout.write("")
            self.stdout.write(
                self.style.ERROR(
                    "Verification failed"
                )
            )

            for item in failed:

                self.stdout.write(
                    f"{item[0]} : "
                    f"{item[1]} != {item[2]}"
                )

        else:

            self.stdout.write("")
            self.stdout.write(
                self.style.SUCCESS(
                    "Verification successful."
                )
            )