from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AuthViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', AuthViewSet.as_view({'post': 'register'}), name='auth-register'),
    path('auth/login/', AuthViewSet.as_view({'post': 'login'}), name='auth-login'),
    path('auth/logout/', AuthViewSet.as_view({'post': 'logout'}), name='auth-logout'),
    path('auth/me/', AuthViewSet.as_view({'get': 'me'}), name='auth-me'),
    path('auth/change-password/', AuthViewSet.as_view({'post': 'change_password'}), name='auth-change-password'),
    path('auth/password-reset-request/', AuthViewSet.as_view({'post': 'password_reset_request'}), name='auth-password-reset-request'),
    path('auth/password-reset-confirm/', AuthViewSet.as_view({'post': 'password_reset_confirm'}), name='auth-password-reset-confirm'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # User endpoints
    path('', include(router.urls)),
]