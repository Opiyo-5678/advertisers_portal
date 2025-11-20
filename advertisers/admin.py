from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from .models import (
    # Existing models
    PricingPackage, AdPlacement, Ad, UploadedFile, Booking,
    Analytics, Message, MessageReply, Notification, AuditLog,
    # New marketing models
    PlatformBenefit, FAQ, Testimonial, CaseStudy,
    PricingFeature, EnhancedPricingPackage, PackageFeature,
    PromotionalBanner, PlatformStatistic, Venue, Event
)


# ============================================================================
# EXISTING MODEL ADMINS
# ============================================================================

@admin.register(PricingPackage)
class PricingPackageAdmin(admin.ModelAdmin):
    list_display = ['package_name', 'package_type', 'price_monthly', 'is_active', 'display_order']
    list_editable = ['is_active', 'display_order']
    list_filter = ['package_type', 'is_active']
    search_fields = ['package_name', 'description']


@admin.register(AdPlacement)
class AdPlacementAdmin(admin.ModelAdmin):
    list_display = ['placement_name', 'placement_code', 'base_price_per_day', 'is_active', 'is_premium']
    list_editable = ['is_active', 'is_premium']
    list_filter = ['is_active', 'is_premium']
    search_fields = ['placement_name', 'placement_code']


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'status', 'is_featured', 'start_date', 'end_date', 'total_impressions', 'total_clicks']
    list_filter = ['status', 'is_featured', 'created_at']
    search_fields = ['title', 'user__username', 'user__email']
    readonly_fields = ['total_impressions', 'total_clicks', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'user', 'file_type', 'file_size_kb', 'virus_scan_status', 'created_at']
    list_filter = ['virus_scan_status', 'file_type', 'created_at']
    search_fields = ['original_filename', 'user__username']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['ad', 'placement', 'user', 'start_date', 'end_date', 'status', 'final_price']
    list_filter = ['status', 'start_date', 'placement']
    search_fields = ['ad__title', 'user__username']
    date_hierarchy = 'start_date'


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ['ad', 'event_type', 'device_type', 'country', 'event_timestamp']
    list_filter = ['event_type', 'device_type', 'country', 'event_timestamp']
    search_fields = ['ad__title']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['subject', 'user', 'status', 'priority', 'assigned_to', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['subject', 'message', 'user__username']


@admin.register(MessageReply)
class MessageReplyAdmin(admin.ModelAdmin):
    list_display = ['message', 'user', 'is_admin_reply', 'created_at']
    list_filter = ['is_admin_reply', 'created_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['is_read', 'notification_type', 'created_at']
    search_fields = ['title', 'message', 'user__username']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'entity_type', 'entity_id', 'created_at']
    list_filter = ['action', 'entity_type', 'created_at']
    search_fields = ['action', 'description', 'user__username']


# ============================================================================
# NEW MARKETING MODEL ADMINS
# ============================================================================

@admin.register(PlatformBenefit)
class PlatformBenefitAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon', 'order', 'is_active', 'created_at']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['order', 'title']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_active', 'views_count']
    list_editable = ['order', 'is_active']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['question', 'answer']
    ordering = ['category', 'order']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['advertiser_name', 'company_name', 'rating', 'is_featured', 'display_order', 'is_active']
    list_editable = ['is_featured', 'display_order', 'is_active']
    list_filter = ['rating', 'is_featured', 'is_active', 'created_at']
    search_fields = ['advertiser_name', 'company_name', 'testimonial_text']


@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ['title', 'company_name', 'industry', 'is_featured', 'is_published', 'views_count']
    list_editable = ['is_featured', 'is_published']
    list_filter = ['industry', 'is_featured', 'is_published', 'published_date']
    search_fields = ['title', 'company_name', 'summary']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(PricingFeature)
class PricingFeatureAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'is_highlight', 'order']
    list_editable = ['order', 'is_highlight']
    search_fields = ['name', 'description']


class PackageFeatureInline(admin.TabularInline):
    model = PackageFeature
    extra = 1
    fields = ['feature', 'is_included', 'custom_value', 'order']


@admin.register(EnhancedPricingPackage)
class EnhancedPricingPackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'billing_period', 'is_popular', 'is_featured', 'is_active']
    list_editable = ['is_popular', 'is_featured', 'is_active']
    list_filter = ['billing_period', 'is_popular', 'is_featured', 'is_active']
    search_fields = ['name', 'tagline', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [PackageFeatureInline]


@admin.register(PromotionalBanner)
class PromotionalBannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'banner_type', 'is_active', 'priority', 'start_date', 'end_date']
    list_editable = ['is_active', 'priority']
    list_filter = ['banner_type', 'is_active', 'created_at']
    search_fields = ['title', 'message']


@admin.register(PlatformStatistic)
class PlatformStatisticAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'icon', 'is_active', 'display_order']
    list_editable = ['display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['label', 'value', 'description']


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'venue_type', 'is_active', 'created_at']
    list_filter = ['venue_type', 'city', 'is_active']
    search_fields = ['name', 'city', 'address']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'venue_name', 'city', 'event_date', 'status', 'submitted_by']
    list_filter = ['status', 'category', 'city', 'event_date']
    search_fields = ['title', 'venue_name', 'city', 'description']
    readonly_fields = ['submitted_by', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Event Details', {
            'fields': ('category', 'title', 'venue_name', 'city', 'event_date', 'event_time', 'end_date')
        }),
        ('Content', {
            'fields': ('description', 'image', 'ticket_link')
        }),
        ('Submission', {
            'fields': ('submitted_by', 'status', 'rejection_reason')
        }),
        ('Review', {
            'fields': ('reviewed_by', 'reviewed_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['approve_events', 'reject_events']
    
    def approve_events(self, request, queryset):
        queryset.update(status='published', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f'{queryset.count()} events approved')
    approve_events.short_description = 'Approve selected events'
    
    def reject_events(self, request, queryset):
        queryset.update(status='rejected', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f'{queryset.count()} events rejected')
    reject_events.short_description = 'Reject selected events'