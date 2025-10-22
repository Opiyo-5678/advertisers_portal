from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic import RedirectView  # Add this import

# Swagger/OpenAPI Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Advertiser Portal API",
        default_version='v1',
        description="Complete API documentation for the Advertiser Portal",
        terms_of_service="https://www.yourapp.com/terms/",
        contact=openapi.Contact(email="contact@advertiserportal.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Root URL - Redirect to API Documentation
    path('', RedirectView.as_view(url='/api/docs/', permanent=False), name='index'),
    
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API Documentation (Swagger)
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API Endpoints
    path('api/accounts/', include('accounts.urls')),
    path('api/advertisers/', include('advertisers.urls')),
    path('api/payments/', include('payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)