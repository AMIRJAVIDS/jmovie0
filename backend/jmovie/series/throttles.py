from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class SeriesThrottle(UserRateThrottle):
    scope = "series"


class SeriesAnonThrottle(AnonRateThrottle):
    scope = "series_anon"
