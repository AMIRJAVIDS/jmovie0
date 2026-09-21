from rest_framework import viewsets, generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.throttling import AnonRateThrottle, ScopedRateThrottle
from django.contrib.auth import get_user_model

from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse

from .models import (
    UserList,
    UserListItem,
    MovieUserStatus,
    SeriesUserStatus,
    EpisodeWatchStatus,
)

from .serializers import (
    UserSerializer,
    UserUpdateSerializer,
    UserRegisterSerializer,
    UserListSerializer,
    UserListItemSerializer,
    MovieUserStatusSerializer,
    SeriesUserStatusSerializer,
    EpisodeWatchStatusSerializer,
)

from .permissions import IsOwner, IsListItemOwner

User = get_user_model()


# ==========================
# Auth - Register
# ==========================

@extend_schema(
    tags=["Accounts - Auth"],
    summary="User registration",
)
class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]
    # بدون throttle، این endpoint در معرض ثبت‌نام انبوه خودکار (bot) و
    # brute-force روی یکتایی ایمیل/username بود. scope باید در settings
    # تعریف شود، مثلاً:
    # REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {"register": "5/hour"}
    throttle_classes = [AnonRateThrottle, ScopedRateThrottle]
    throttle_scope = "register"

    @extend_schema(
        summary="ثبت‌نام کاربر جدید",
        description=(
            "ایجاد حساب کاربری جدید توسط کاربر نهایی. نیازی به لاگین ندارد. "
            "در صورت موفقیت، اطلاعات کاربر جدید را برمی‌گرداند."
        ),
        request=UserRegisterSerializer,
        responses={
            201: UserSerializer,
            400: OpenApiResponse(description="اطلاعات واردشده ناقص یا تکراری (مثلاً ایمیل یا نام کاربری تکراری)."),
        },
        tags=["User"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


# ==========================
# User Profile (User == Profile)
# ==========================

@extend_schema_view(
    retrieve=extend_schema(
        tags=["Accounts - Profile"],
        summary="Get current user profile",
    ),
    update=extend_schema(
        tags=["Accounts - Profile"],
        summary="Update user profile",
    ),
    partial_update=extend_schema(
        tags=["Accounts - Profile"],
        summary="Partially update user profile",
    ),
)
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # تغییر پسورد هم اینجا انجام می‌شود، پس throttle مجزا برای جلوگیری از
    # brute-force روی old_password لازم است.
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "profile_update"

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return UserUpdateSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user

    # متد update سفارشی قبلی حذف شد. مشکلاتش:
    #   1) print(serializer.errors) دیباگ در کد production باقی مانده بود
    #      و می‌توانست داده‌ی حساس کاربر را در stdout/لاگ سرور بریزد.
    #   2) serializer.is_valid() دو بار صدا زده می‌شد (یک‌بار بی‌فایده).
    #   3) partial=True به‌صورت hardcode ست شده بود، یعنی درخواست PUT هم
    #      رفتار PATCH می‌گرفت؛ در حالی که RetrieveUpdateAPIView به‌صورت
    #      پیش‌فرض partial بودن را از روی متد HTTP (PUT vs PATCH) تشخیص
    #      می‌دهد و این override اصلاً لازم نبود.
    # اگر نیاز واقعی این است که PUT هم همیشه partial رفتار کند (مثلاً چون
    # کلاینت فقط فیلدهای تغییریافته را می‌فرستد)، از get_serializer به‌جای
    # override کردن update استفاده کنید:
    #
    # def get_serializer(self, *args, **kwargs):
    #     kwargs["partial"] = True
    #     return super().get_serializer(*args, **kwargs)


# ==========================
# User Lists
# ==========================

@extend_schema_view(
    list=extend_schema(
        tags=["Accounts - Lists"],
        summary="List user lists",
    ),
    create=extend_schema(
        tags=["Accounts - Lists"],
        summary="Create new user list",
    ),
)
class UserListViewSet(viewsets.ModelViewSet):
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return UserList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema_view(
    list=extend_schema(
        tags=["Accounts - Lists"],
        summary="List items in a user list",
    ),
    create=extend_schema(
        tags=["Accounts - Lists"],
        summary="Add item to user list",
    ),
    destroy=extend_schema(
        tags=["Accounts - Lists"],
        summary="Remove item from user list",
    ),
)
class UserListItemViewSet(viewsets.ModelViewSet):
    """
    این ویوست به‌صورت nested زیر یک UserList مشخص در نظر گرفته شده است،
    یعنی URLconf باید چیزی شبیه این باشد (با drf-nested-routers یا مشابه):

        /lists/<list_pk>/items/

    اگر ساختار URL شما فرق دارد، فقط کافی است نام kwarg را در دو متد زیر
    مطابقت دهید. نکته‌ی امنیتی مهم: user_list از URL گرفته می‌شود، نه از
    بدنه‌ی درخواست، و علاوه بر آن مالکیت آن لیست هم چک می‌شود؛ در غیر این
    صورت کاربر می‌توانست آیتمی به لیستِ کاربر دیگری اضافه کند.
    """
    serializer_class = UserListItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsListItemOwner]

    def get_queryset(self):
        return UserListItem.objects.filter(
            user_list__user=self.request.user
        )

    def _get_owned_user_list(self):
        list_pk = self.kwargs.get("list_pk")
        try:
            return UserList.objects.get(pk=list_pk, user=self.request.user)
        except UserList.DoesNotExist:
            raise PermissionDenied("این لیست متعلق به شما نیست یا وجود ندارد.")

    def perform_create(self, serializer):
        user_list = self._get_owned_user_list()
        serializer.save(user_list=user_list)


# ==========================
# Movie User Status
# ==========================

@extend_schema_view(
    list=extend_schema(
        tags=["Accounts - Status"],
        summary="List movie user statuses",
    ),
    create=extend_schema(
        tags=["Accounts - Status"],
        summary="Create movie user status",
    ),
)
class MovieUserStatusViewSet(viewsets.ModelViewSet):
    serializer_class = MovieUserStatusSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return MovieUserStatus.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==========================
# Series User Status
# ==========================

@extend_schema_view(
    list=extend_schema(
        tags=["Accounts - Status"],
        summary="List series user statuses",
    ),
    create=extend_schema(
        tags=["Accounts - Status"],
        summary="Create series user status",
    ),
)
class SeriesUserStatusViewSet(viewsets.ModelViewSet):
    serializer_class = SeriesUserStatusSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return SeriesUserStatus.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==========================
# Episode Watch Status
# ==========================

@extend_schema_view(
    list=extend_schema(
        tags=["Accounts - Status"],
        summary="List episode watch statuses",
    ),
    create=extend_schema(
        tags=["Accounts - Status"],
        summary="Create episode watch status",
    ),
)
class EpisodeWatchStatusViewSet(viewsets.ModelViewSet):
    serializer_class = EpisodeWatchStatusSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return EpisodeWatchStatus.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)