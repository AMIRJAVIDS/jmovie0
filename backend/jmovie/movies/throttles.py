from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class MovieThrottle(UserRateThrottle):
    """
    Throttle for movie endpoints (authenticated users)
    """
    scope = "movies"


class MovieAnonThrottle(AnonRateThrottle):
    """
    Throttle for anonymous users
    """
    scope = "movies_anon"
