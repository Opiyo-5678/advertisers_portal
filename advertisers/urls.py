from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # Existing ViewSets
    PricingPackageViewSet,
    AdPlacementViewSet,
    AdViewSet,
    UploadedFileViewSet,
    BookingViewSet,
    MessageViewSet,
    NotificationViewSet,
    # New Marketing ViewSets
    PlatformBenefitViewSet,
    FAQViewSet,
    TestimonialViewSet,
    CaseStudyViewSet,
    PricingFeatureViewSet,
    EnhancedPricingPackageViewSet,
    PromotionalBannerViewSet,
    PlatformStatisticViewSet,
    MarketingOverviewViewSet
)

router = DefaultRouter()

# Existing routes
router.register(r'pricing-packages', PricingPackageViewSet, basename='pricing-package')
router.register(r'ad-placements', AdPlacementViewSet, basename='ad-placement')
router.register(r'ads', AdViewSet, basename='ad')
router.register(r'files', UploadedFileViewSet, basename='file')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'notifications', NotificationViewSet, basename='notification')

# New marketing routes
router.register(r'marketing/benefits', PlatformBenefitViewSet, basename='benefit')
router.register(r'marketing/faqs', FAQViewSet, basename='faq')
router.register(r'marketing/testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'marketing/case-studies', CaseStudyViewSet, basename='casestudy')
router.register(r'marketing/pricing-features', PricingFeatureViewSet, basename='pricing-feature')
router.register(r'marketing/enhanced-pricing', EnhancedPricingPackageViewSet, basename='enhanced-pricing')
router.register(r'marketing/banners', PromotionalBannerViewSet, basename='banner')
router.register(r'marketing/statistics', PlatformStatisticViewSet, basename='statistic')
router.register(r'marketing/overview', MarketingOverviewViewSet, basename='overview')

urlpatterns = [
    path('', include(router.urls)),
]