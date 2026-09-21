import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

from core.models import TimeStampedModel


# --------------------------------------------------
# Upload paths
# --------------------------------------------------
def person_profile_upload_path(instance, filename):
    """
    قبلاً همه‌ی تصاویر پروفایل در یک پوشه‌ی مشترک (people/profiles/) و با
    نام فایل اصلی ذخیره می‌شدند؛ یعنی دو آپلود با نام یکسان (مثلاً هنگام
    import از TMDB) روی هم overwrite می‌کردند. حالا هر فایل نام یکتا
    (uuid) می‌گیرد و در پوشه‌ی مخصوص همان person قرار می‌گیرد.
    """
    ext = filename.split(".")[-1].lower()
    return f"people/profiles/{instance.tmdb_id}/{uuid.uuid4().hex}.{ext}"


def person_gallery_upload_path(instance, filename):
    ext = filename.split(".")[-1].lower()
    return f"people/gallery/{instance.person.tmdb_id}/{uuid.uuid4().hex}.{ext}"


# --------------------------------------------------
# Person
# --------------------------------------------------
class Person(TimeStampedModel):
    tmdb_id = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text="IMDb / TMDB person ID"
    )

    name = models.CharField(max_length=255)
    original_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # unique=True: قبلاً False بود در حالی که lookup_field="slug" در ویو
    # استفاده می‌شد. دو person همنام باعث تولید slug تکراری می‌شدند و
    # درخواست به /people/<slug>/ با خطای 500 (MultipleObjectsReturned)
    # مواجه می‌شد. تابع save() پایین‌تر، در صورت تصادف، یک پسوند عددی
    # اضافه می‌کند تا یکتایی همیشه تضمین شود.
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True
    )

    biography = models.TextField(blank=True)

    birth_date = models.DateField(
        blank=True,
        null=True
    )

    death_date = models.DateField(
        blank=True,
        null=True
    )

    place_of_birth = models.CharField(
        max_length=255,
        blank=True
    )

    profile_image_url = models.URLField(blank=True, null=True)
    profile_image = models.ImageField(
        upload_to=person_profile_upload_path,
        blank=True,
        null=True
    )

    popularity = models.FloatField(
        blank=True,
        null=True,
        help_text="TMDB popularity score"
    )

    # created_at/updated_at حذف شدند چون TimeStampedModel از قبل این
    # فیلدها را فراهم می‌کند؛ تعریف دوباره‌شان فقط سردرگم‌کننده بود.

    class Meta:
        ordering = ["-popularity", "name"]
        indexes = [
            models.Index(fields=["tmdb_id"]),
            models.Index(fields=["slug"]),
            models.Index(fields=["-popularity"]),
        ]

    def clean(self):
        if self.birth_date and self.death_date and self.death_date < self.birth_date:
            raise ValidationError(
                {"death_date": "تاریخ فوت نمی‌تواند قبل از تاریخ تولد باشد."}
            )

    def _generate_unique_slug(self):
        base_slug = slugify(self.name) or "person"
        slug = base_slug
        counter = 1
        while Person.objects.exclude(pk=self.pk).filter(slug=slug).exists():
            counter += 1
            slug = f"{base_slug}-{counter}"
        return slug

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_unique_slug()
        self.clean()
        super().save(*args, **kwargs)

    @property
    def display_image(self):
        """
        اولویت با فایل آپلودشده‌ی محلی است؛ اگر وجود نداشت، از URL خارجی
        (TMDB) استفاده می‌شود. قبلاً هیچ منطق مشخصی برای انتخاب بین این دو
        فیلد وجود نداشت و این تصمیم به فرانت‌اند واگذار شده بود.
        """
        if self.profile_image:
            return self.profile_image.url
        return self.profile_image_url or None

    def __str__(self):
        return self.name


# --------------------------------------------------
# Person Image
# --------------------------------------------------
class PersonImage(TimeStampedModel):
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to=person_gallery_upload_path
    )

    is_primary = models.BooleanField(
        default=False,
        help_text="Primary profile image"
    )

    # created_at حذف شد؛ از TimeStampedModel می‌آید.

    class Meta:
        ordering = ["-is_primary", "-created_at"]
        constraints = [
            # قبلاً هیچ‌چیز جلوی وجود همزمان چند تصویر is_primary=True
            # برای یک person را نمی‌گرفت. این constraint در سطح دیتابیس
            # تضمین می‌کند که حداکثر یک تصویر primary به‌ازای هر person
            # وجود داشته باشد.
            models.UniqueConstraint(
                fields=["person"],
                condition=models.Q(is_primary=True),
                name="unique_primary_image_per_person",
            )
        ]

    def save(self, *args, **kwargs):
        # اگر این تصویر primary ست می‌شود، بقیه‌ی تصاویر همان person را
        # غیر-primary می‌کنیم تا با UniqueConstraint بالا تناقض پیش نیاید
        # و کاربر مجبور نباشد خودش دستی این کار را انجام دهد.
        if self.is_primary:
            PersonImage.objects.filter(
                person_id=self.person_id, is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.person.name} Image"