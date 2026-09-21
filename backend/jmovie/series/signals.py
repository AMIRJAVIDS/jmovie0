from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.cache_keys import series_detail_cache_key
from series.models import Series


@receiver([post_save, post_delete], sender=Series)
def invalidate_series_cache(sender, instance, **kwargs):
    cache.delete(series_detail_cache_key(instance.id, True))
    cache.delete(series_detail_cache_key(instance.id, False))
