from rest_framework import serializers
from .models import (
    # Your existing imports...
    PricingPackage, AdPlacement, Ad, UploadedFile,
    Booking, Analytics, Message, MessageReply,
    Notification, AuditLog,
    # ADD THESE NEW ONES:
    PlatformBenefit, FAQ, Testimonial, CaseStudy,
    PricingFeature, EnhancedPricingPackage, PackageFeature,
    PromotionalBanner, PlatformStatistic
)
from accounts.serializers import UserSerializer


class PricingPackageSerializer(serializers.ModelSerializer):
    """Serializer for pricing packages"""
    
    class Meta:
        model = PricingPackage
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdPlacementSerializer(serializers.ModelSerializer):
    """Serializer for ad placements"""
    
    class Meta:
        model = AdPlacement
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class UploadedFileSerializer(serializers.ModelSerializer):
    """Serializer for uploaded files"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UploadedFile
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'stored_filename', 'file_path',
            'file_size_kb', 'width', 'height', 'thumbnail_path',
            'virus_scan_status', 'virus_scan_date', 'created_at'
        ]


class AdSerializer(serializers.ModelSerializer):
    """Serializer for ads"""
    user = UserSerializer(read_only=True)
    files = UploadedFileSerializer(many=True, read_only=True)
    click_through_rate = serializers.ReadOnlyField()
    
    class Meta:
        model = Ad
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'reviewed_by', 'reviewed_at',
            'total_impressions', 'total_clicks', 'qr_code_url',
            'created_at', 'updated_at'
        ]
    
    def validate(self, attrs):
        # Ensure end_date is after start_date
        if attrs.get('start_date') and attrs.get('end_date'):
            if attrs['end_date'] < attrs['start_date']:
                raise serializers.ValidationError({
                    "end_date": "End date must be after start date."
                })
        return attrs


class AdListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for ad listings"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    company_name = serializers.CharField(source='user.company_name', read_only=True)
    
    class Meta:
        model = Ad
        fields = [
            'id', 'title', 'short_description', 'status',
            'start_date', 'end_date', 'total_clicks',
            'total_impressions', 'is_featured', 'user_name',
            'company_name', 'created_at'
        ]


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for bookings (calendar)"""
    user = UserSerializer(read_only=True)
    ad = AdListSerializer(read_only=True)
    placement = AdPlacementSerializer(read_only=True)
    
    # Writable fields for creation
    ad_id = serializers.IntegerField(write_only=True)
    placement_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'total_days', 'total_price',
            'final_price', 'created_at', 'updated_at'
        ]
    
    def validate(self, attrs):
        # Validate dates
        if attrs.get('start_date') and attrs.get('end_date'):
            if attrs['end_date'] < attrs['start_date']:
                raise serializers.ValidationError({
                    "end_date": "End date must be after start date."
                })
            
            # Check for booking conflicts
            placement_id = attrs.get('placement_id')
            start_date = attrs['start_date']
            end_date = attrs['end_date']
            
            conflicts = Booking.objects.filter(
                placement_id=placement_id,
                status__in=['confirmed', 'active'],
                start_date__lte=end_date,
                end_date__gte=start_date
            )
            
            # Exclude current booking if updating
            if self.instance:
                conflicts = conflicts.exclude(pk=self.instance.pk)
            
            if conflicts.exists():
                raise serializers.ValidationError({
                    "dates": "This placement is already booked for the selected dates."
                })
        
        return attrs
    
    def create(self, validated_data):
        # Extract IDs
        ad_id = validated_data.pop('ad_id')
        placement_id = validated_data.pop('placement_id')
        
        # Get objects
        ad = Ad.objects.get(id=ad_id)
        placement = AdPlacement.objects.get(id=placement_id)
        
        # Set price per day from placement
        validated_data['price_per_day'] = placement.base_price_per_day
        
        # Create booking
        booking = Booking.objects.create(
            ad=ad,
            placement=placement,
            **validated_data
        )
        
        return booking


class BookingCalendarSerializer(serializers.ModelSerializer):
    """Lightweight serializer for calendar view"""
    ad_title = serializers.CharField(source='ad.title', read_only=True)
    placement_name = serializers.CharField(source='placement.placement_name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'start_date', 'end_date', 'status',
            'ad_title', 'placement_name', 'user_name'
        ]


class AnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for analytics"""
    ad_title = serializers.CharField(source='ad.title', read_only=True)
    
    class Meta:
        model = Analytics
        fields = '__all__'
        read_only_fields = ['id', 'event_timestamp']


class MessageReplySerializer(serializers.ModelSerializer):
    """Serializer for message replies"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = MessageReply
        fields = '__all__'
        read_only_fields = ['id', 'user', 'is_admin_reply', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for messages"""
    user = UserSerializer(read_only=True)
    replies = MessageReplySerializer(many=True, read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class MessageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for message listings"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    reply_count = serializers.IntegerField(source='replies.count', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'subject', 'status', 'priority',
            'user_name', 'reply_count', 'created_at'
        ]


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications"""
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'related_ad', 'related_booking',
            'created_at'
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for audit logs"""
    user_name = serializers.CharField(source='user.username', read_only=True, allow_null=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


# Statistics Serializers
class AdStatisticsSerializer(serializers.Serializer):
    """Serializer for ad statistics"""
    total_ads = serializers.IntegerField()
    active_ads = serializers.IntegerField()
    pending_ads = serializers.IntegerField()
    total_impressions = serializers.IntegerField()
    total_clicks = serializers.IntegerField()
    average_ctr = serializers.FloatField()


class BookingStatisticsSerializer(serializers.Serializer):
    """Serializer for booking statistics"""
    total_bookings = serializers.IntegerField()
    active_bookings = serializers.IntegerField()
    completed_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    # ============================================================================
# MARKETING SERIALIZERS (ADD THESE AT THE BOTTOM)
# ============================================================================

class PlatformBenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformBenefit
        fields = ['id', 'title', 'icon', 'description', 'order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class FAQListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'category', 'category_display', 'question', 'answer']


class FAQSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = [
            'id', 'category', 'category_display', 'question', 'answer',
            'order', 'is_active', 'views_count', 'helpful_count',
            'not_helpful_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views_count', 'created_at', 'updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'advertiser_name', 'company_name', 'company_logo',
            'position', 'testimonial_text', 'rating',
            'results_achieved', 'is_featured', 'display_order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CaseStudyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudy
        fields = [
            'id', 'slug', 'title', 'company_name', 'industry',
            'featured_image', 'summary', 'is_featured',
            'published_date', 'views_count'
        ]


class CaseStudyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudy
        fields = [
            'id', 'slug', 'title', 'company_name', 'industry',
            'featured_image', 'summary', 'challenge', 'solution', 'results',
            'metric_1_label', 'metric_1_value',
            'metric_2_label', 'metric_2_value',
            'metric_3_label', 'metric_3_value',
            'testimonial_quote', 'testimonial_author',
            'testimonial_position', 'is_featured', 'published_date',
            'views_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views_count', 'created_at', 'updated_at']


class PricingFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingFeature
        fields = ['id', 'name', 'description', 'icon', 'is_highlight', 'order']


class PackageFeatureSerializer(serializers.ModelSerializer):
    feature_name = serializers.CharField(source='feature.name', read_only=True)
    
    class Meta:
        model = PackageFeature
        fields = ['id', 'feature', 'feature_name', 'is_included', 'custom_value', 'order']


class EnhancedPricingPackageSerializer(serializers.ModelSerializer):
    package_features = PackageFeatureSerializer(source='packagefeature_set', many=True, read_only=True)
    
    class Meta:
        model = EnhancedPricingPackage
        fields = [
            'id', 'name', 'slug', 'tagline', 'price', 'billing_period',
            'original_price', 'is_popular', 'is_featured', 'is_enterprise',
            'description', 'max_ads', 'max_impressions', 'max_bookings',
            'support_level', 'cta_text', 'cta_url',
            'is_active', 'display_order', 'package_features', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at']


class PromotionalBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionalBanner
        fields = [
            'id', 'title', 'message', 'banner_type',
            'cta_text', 'cta_url', 'background_color', 'is_dismissible',
            'is_active', 'start_date', 'end_date',
            'display_on_pages', 'priority', 'created_at'
        ]


class PlatformStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformStatistic
        fields = ['id', 'label', 'value', 'icon', 'description', 'is_active', 'display_order']