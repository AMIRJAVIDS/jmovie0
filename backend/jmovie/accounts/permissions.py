from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwner(BasePermission):
    """
    Allow access only to object owner.
    Assumes object has a `user` attribute.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsOwnerOrReadOnly(BasePermission):
    """
    Read for everyone فقط اگر آبجکت public باشد یا خود owner باشد.
    Write فقط برای owner.

    قبلاً هر GET بدون هیچ چکی مجاز بود، یعنی لیست‌های خصوصی
    (is_public=False) هم قابل مشاهده بودند. این نسخه فیلد
    is_public را رعایت می‌کند.
    """

    def has_object_permission(self, request, view, obj):
        is_owner = obj.user == request.user

        if request.method in SAFE_METHODS:
            return getattr(obj, "is_public", False) or is_owner

        return is_owner


class IsListItemOwner(BasePermission):
    """
    برای مدل‌هایی مثل UserListItem که خودشان فیلد user ندارند
    و مالکیت از طریق user_list.user مشخص می‌شود.
    استفاده از IsOwner روی این مدل باعث AttributeError می‌شد.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user_list.user == request.user