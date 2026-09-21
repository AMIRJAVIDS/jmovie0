from rest_framework.throttling import ScopedRateThrottle


class AuthRateThrottle(ScopedRateThrottle):
    scope = "auth"


class CommentRateThrottle(ScopedRateThrottle):
    scope = "comments"


class DownloadRateThrottle(ScopedRateThrottle):
    scope = "downloads"
