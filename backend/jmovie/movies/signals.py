from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.cache_keys import movie_detail_cache_key
from movies.models import Movie


@receiver([post_save, post_delete], sender=Movie)
def invalidate_movie_cache(sender, instance, **kwargs):
    cache.delete(movie_detail_cache_key(instance.id, True))
    cache.delete(movie_detail_cache_key(instance.id, False))
