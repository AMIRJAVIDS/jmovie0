CACHE_VERSION = "v1"


def movie_detail_cache_key(slug, is_vip):
    return f"{CACHE_VERSION}:movie:detail:{slug}:vip:{int(is_vip)}"


def series_detail_cache_key(slug, is_vip):
    return f"{CACHE_VERSION}:series:detail:{slug}:vip:{int(is_vip)}"
