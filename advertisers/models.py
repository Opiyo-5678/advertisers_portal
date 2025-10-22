from django.db import models
from django.conf import settings
from django.utils.text import slugify
from ckeditor.fields import RichTextField


# ============================================================================
# EXISTING MODELS (Your Current Structure)
# ============================================================================

class PricingPackage(models.Model):
    """
    Subscription pricing packages
    """
    PACKAGE_TYPES = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    ]
    
    package_name = models.CharField(max_length=100)
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES)
    
    # Pricing
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_quarterly = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Features
    max_active_ads = models.IntegerField(default=5)
    max_file_uploads = models.IntegerField(default=20)
    analytics_access = models.BooleanField(default=False)
    priority_support = models.BooleanField(default=False)
    featured_placement = models.BooleanField(default=False)
    
    # Display
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pricing_packages'
        ordering = ['display_order', 'price_monthly']
    
    def __str__(self):
        return f"{self.package_name} - ${self.price_monthly}/month"


class AdPlacement(models.Model):
    """
    Where ads can be displayed (homepage, sidebar, etc.)
    """
    placement_name = models.CharField(max_length=100)
    placement_code = models.CharField(max_length=50, unique=True)
    
    # Pricing
    base_price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Specifications
    description = models.TextField(blank=True, null=True)
    dimensions = models.CharField(max_length=50, blank=True, null=True)  # e.g., '1200x400'
    max_file_size_mb = models.IntegerField(default=5)
    
    # Availability
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    max_concurrent_ads = models.IntegerField(default=1)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ad_placements'
        ordering = ['placement_name']
    
    def __str__(self):
        return f"{self.placement_name} (${self.base_price_per_day}/day)"


class Ad(models.Model):
    """
    Main advertisement content
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_review', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('live', 'Live'),
        ('expired', 'Expired'),
        ('paused', 'Paused'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ads')
    
    # Content
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=250, blank=True, null=True)
    full_description = models.TextField(blank=True, null=True)
    call_to_action = models.CharField(max_length=100, blank=True, null=True)
    terms_conditions = models.TextField(blank=True, null=True)
    
    # Links
    website_url = models.URLField(max_length=500, blank=True, null=True)
    catalog_url = models.URLField(max_length=500, blank=True, null=True)
    whatsapp_link = models.CharField(max_length=255, blank=True, null=True)
    
    # QR Code
    qr_code_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Admin Review
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='reviewed_ads'
    )
    reviewed_at = models.DateTimeField(blank=True, null=True)
    
    # Publishing Dates
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    # Analytics Counters
    total_impressions = models.IntegerField(default=0)
    total_clicks = models.IntegerField(default=0)
    
    # Metadata
    is_featured = models.BooleanField(default=False)
    priority_order = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ads'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.status}"
    
    @property
    def click_through_rate(self):
        """Calculate CTR"""
        if self.total_impressions > 0:
            return (self.total_clicks / self.total_impressions) * 100
        return 0


class UploadedFile(models.Model):
    """
    Images, logos, PDFs uploaded by advertisers
    """
    SCAN_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('clean', 'Clean'),
        ('infected', 'Infected'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_files')
    ad = models.ForeignKey(Ad, on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    
    # File Information
    original_filename = models.CharField(max_length=255)
    stored_filename = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_type = models.CharField(max_length=50)  # 'image/png', 'image/jpeg', etc.
    file_size_kb = models.IntegerField()
    
    # Image Specifics
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    thumbnail_path = models.CharField(max_length=500, blank=True, null=True)
    
    # Security
    virus_scan_status = models.CharField(max_length=20, choices=SCAN_STATUS_CHOICES, default='pending')
    virus_scan_date = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    is_primary = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'uploaded_files'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.original_filename} ({self.virus_scan_status})"


class Booking(models.Model):
    """
    Calendar bookings for ad placements (CALENDAR FUNCTIONALITY HERE)
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='bookings')
    placement = models.ForeignKey(AdPlacement, on_delete=models.CASCADE, related_name='bookings')
    
    # Calendar Dates
    start_date = models.DateField()
    end_date = models.DateField()
    total_days = models.IntegerField()
    
    # Pricing
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    cancellation_reason = models.TextField(blank=True, null=True)
    
    # Notifications Sent
    reminder_sent = models.BooleanField(default=False)
    start_notification_sent = models.BooleanField(default=False)
    end_notification_sent = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.ad.title} - {self.placement.placement_name} ({self.start_date} to {self.end_date})"
    
    def save(self, *args, **kwargs):
        # Calculate total days if not set
        if self.start_date and self.end_date and not self.total_days:
            self.total_days = (self.end_date - self.start_date).days + 1
        
        # Calculate prices if not set
        if not self.total_price:
            self.total_price = self.price_per_day * self.total_days
        
        if not self.final_price:
            discount_amount = (self.total_price * self.discount_percentage) / 100
            self.final_price = self.total_price - discount_amount
        
        super().save(*args, **kwargs)


class Analytics(models.Model):
    """
    Click and impression tracking for ads
    """
    EVENT_TYPES = [
        ('impression', 'Impression'),
        ('click', 'Click'),
    ]
    
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='analytics')
    
    # Event Type
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    
    # Visitor Information
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)  # mobile, tablet, desktop
    browser = models.CharField(max_length=50, blank=True, null=True)
    
    # Location
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Referrer
    referrer_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Timestamp
    event_timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics'
        ordering = ['-event_timestamp']
        indexes = [
            models.Index(fields=['ad', 'event_type']),
            models.Index(fields=['event_timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.ad.title} at {self.event_timestamp}"


class Message(models.Model):
    """
    Support messages and communication
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages')
    
    # Message Content
    subject = models.CharField(max_length=255)
    message = models.TextField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # Assignment
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_messages'
    )
    
    # Related Entities
    related_ad = models.ForeignKey(Ad, on_delete=models.SET_NULL, null=True, blank=True)
    related_booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'messages'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.status}"


class MessageReply(models.Model):
    """
    Replies to support messages (conversation thread)
    """
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    reply_text = models.TextField()
    is_admin_reply = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_replies'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Reply to {self.message.subject} by {self.user.username}"


class Notification(models.Model):
    """
    System notifications for users
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    
    # Notification Content
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, blank=True, null=True)
    
    # Related Entities
    related_ad = models.ForeignKey(Ad, on_delete=models.SET_NULL, null=True, blank=True)
    related_booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    
    # Delivery
    sent_via_email = models.BooleanField(default=False)
    sent_via_sms = models.BooleanField(default=False)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {'Read' if self.is_read else 'Unread'}"


class AuditLog(models.Model):
    """
    Audit trail for important actions
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # Action Details
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50, blank=True, null=True)
    entity_id = models.IntegerField(blank=True, null=True)
    
    # Details
    old_values = models.JSONField(blank=True, null=True)
    new_values = models.JSONField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    # Request Info
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_log'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action']),
            models.Index(fields=['entity_type', 'entity_id']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.user.username if self.user else 'System'} at {self.created_at}"


# ============================================================================
# NEW MARKETING MODELS (Requirement #5)
# ============================================================================

class PlatformBenefit(models.Model):
    """
    Key benefits of advertising on the platform
    Displayed on marketing/landing pages
    """
    title = models.CharField(max_length=200)
    icon = models.CharField(
        max_length=100,
        help_text="Icon name (e.g., 'target', 'chart', 'users')",
        blank=True
    )
    description = models.TextField()
    order = models.IntegerField(default=0, help_text="Display order (lower first)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'platform_benefits'
        ordering = ['order', 'title']
        verbose_name = "Platform Benefit"
        verbose_name_plural = "Platform Benefits"
    
    def __str__(self):
        return self.title


class FAQ(models.Model):
    """
    Frequently Asked Questions for advertisers
    """
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('pricing', 'Pricing & Payments'),
        ('ads', 'Ad Creation'),
        ('booking', 'Booking & Calendar'),
        ('technical', 'Technical'),
        ('account', 'Account Management'),
    ]
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    question = models.CharField(max_length=500)
    answer = RichTextField()
    order = models.IntegerField(default=0, help_text="Display order within category")
    is_active = models.BooleanField(default=True)
    views_count = models.IntegerField(default=0)
    helpful_count = models.IntegerField(default=0)
    not_helpful_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'faqs'
        ordering = ['category', 'order', 'question']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
    
    def __str__(self):
        return f"[{self.get_category_display()}] {self.question}"


class Testimonial(models.Model):
    """
    Success stories and testimonials from advertisers
    """
    advertiser_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    position = models.CharField(max_length=200, help_text="e.g., Marketing Director")
    testimonial_text = models.TextField()
    rating = models.IntegerField(
        default=5,
        choices=[(i, f"{i} Stars") for i in range(1, 6)]
    )
    results_achieved = models.TextField(
        blank=True,
        help_text="Key metrics/results (e.g., '300% ROI, 50k impressions')"
    )
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'testimonials'
        ordering = ['-is_featured', 'display_order', '-created_at']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
    
    def __str__(self):
        return f"{self.advertiser_name} - {self.company_name}"


class CaseStudy(models.Model):
    """
    Detailed success stories with metrics and analysis
    """
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    featured_image = models.ImageField(upload_to='case_studies/', blank=True, null=True)
    summary = models.TextField(help_text="Brief summary (1-2 sentences)")
    challenge = RichTextField(help_text="What problem did they need to solve?")
    solution = RichTextField(help_text="How did our platform help?")
    results = RichTextField(help_text="What outcomes did they achieve?")
    
    # Key metrics
    metric_1_label = models.CharField(max_length=100, blank=True, help_text="e.g., 'Increase in Sales'")
    metric_1_value = models.CharField(max_length=50, blank=True, help_text="e.g., '250%'")
    metric_2_label = models.CharField(max_length=100, blank=True)
    metric_2_value = models.CharField(max_length=50, blank=True)
    metric_3_label = models.CharField(max_length=100, blank=True)
    metric_3_value = models.CharField(max_length=50, blank=True)
    
    testimonial_quote = models.TextField(blank=True)
    testimonial_author = models.CharField(max_length=200, blank=True)
    testimonial_position = models.CharField(max_length=200, blank=True)
    
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    published_date = models.DateField(blank=True, null=True)
    views_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'case_studies'
        ordering = ['-is_featured', '-published_date', '-created_at']
        verbose_name = "Case Study"
        verbose_name_plural = "Case Studies"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} - {self.company_name}"


class PricingFeature(models.Model):
    """
    Individual features that can be assigned to pricing packages
    """
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    is_highlight = models.BooleanField(
        default=False,
        help_text="Highlight this feature in pricing tables"
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pricing_features'
        ordering = ['order', 'name']
        verbose_name = "Pricing Feature"
        verbose_name_plural = "Pricing Features"
    
    def __str__(self):
        return self.name


class EnhancedPricingPackage(models.Model):
    """
    Enhanced pricing package with additional marketing fields
    Can work alongside your existing PricingPackage model
    """
    # Basic info
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    tagline = models.CharField(
        max_length=300,
        blank=True,
        help_text="e.g., 'Perfect for startups'"
    )
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    billing_period = models.CharField(
        max_length=50,
        choices=[
            ('day', 'Per Day'),
            ('week', 'Per Week'),
            ('month', 'Per Month'),
            ('quarter', 'Per Quarter'),
            ('year', 'Per Year'),
            ('custom', 'Custom'),
        ],
        default='month'
    )
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Show discount (strikethrough price)"
    )
    
    # Marketing flags
    is_popular = models.BooleanField(default=False, help_text="Show 'Most Popular' badge")
    is_featured = models.BooleanField(default=False, help_text="Highlight in pricing table")
    is_enterprise = models.BooleanField(default=False, help_text="'Contact Us' pricing")
    
    # Features
    features = models.ManyToManyField(
        PricingFeature,
        through='PackageFeature',
        related_name='packages'
    )
    description = RichTextField(blank=True)
    
    # Limits
    max_ads = models.IntegerField(default=1, help_text="Number of ads allowed")
    max_impressions = models.IntegerField(
        default=10000,
        help_text="Monthly impression limit"
    )
    max_bookings = models.IntegerField(default=1, help_text="Concurrent bookings")
    support_level = models.CharField(
        max_length=50,
        choices=[
            ('email', 'Email Support'),
            ('priority', 'Priority Support'),
            ('dedicated', 'Dedicated Account Manager'),
        ],
        default='email'
    )
    
    # CTA
    cta_text = models.CharField(
        max_length=100,
        default="Get Started",
        help_text="Button text"
    )
    cta_url = models.CharField(
        max_length=500,
        blank=True,
        help_text="Custom URL or leave blank for default signup"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enhanced_pricing_packages'
        ordering = ['display_order', 'price']
        verbose_name = "Enhanced Pricing Package"
        verbose_name_plural = "Enhanced Pricing Packages"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - ${self.price}/{self.billing_period}"
    
    @property
    def has_discount(self):
        return self.original_price and self.original_price > self.price
    
    @property
    def discount_percentage(self):
        if self.has_discount:
            return round(((self.original_price - self.price) / self.original_price) * 100)
        return 0


class PackageFeature(models.Model):
    """
    Through model for package-feature relationship with additional data
    """
    package = models.ForeignKey(EnhancedPricingPackage, on_delete=models.CASCADE)
    feature = models.ForeignKey(PricingFeature, on_delete=models.CASCADE)
    is_included = models.BooleanField(default=True)
    custom_value = models.CharField(
        max_length=100,
        blank=True,
        help_text="e.g., '5 users' instead of just checkmark"
    )
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'package_features'
        ordering = ['order', 'feature__order']
        unique_together = ['package', 'feature']
    
    def __str__(self):
        status = "✓" if self.is_included else "✗"
        value = f" ({self.custom_value})" if self.custom_value else ""
        return f"{self.package.name}: {status} {self.feature.name}{value}"


class PromotionalBanner(models.Model):
    """
    Promotional banners for special offers, announcements
    """
    title = models.CharField(max_length=200)
    message = RichTextField()
    banner_type = models.CharField(
        max_length=50,
        choices=[
            ('info', 'Information'),
            ('success', 'Success/Promotion'),
            ('warning', 'Warning'),
            ('announcement', 'Announcement'),
        ],
        default='info'
    )
    cta_text = models.CharField(max_length=100, blank=True)
    cta_url = models.CharField(max_length=500, blank=True)
    background_color = models.CharField(
        max_length=7,
        default='#0066cc',
        help_text="Hex color code"
    )
    is_dismissible = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    display_on_pages = models.CharField(
        max_length=500,
        default='all',
        help_text="Comma-separated page names or 'all'"
    )
    priority = models.IntegerField(default=0, help_text="Higher = shown first")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'promotional_banners'
        ordering = ['-priority', '-created_at']
        verbose_name = "Promotional Banner"
        verbose_name_plural = "Promotional Banners"
    
    def __str__(self):
        return f"{self.title} ({self.get_banner_type_display()})"


class PlatformStatistic(models.Model):
    """
    Platform-wide statistics to display on marketing pages
    """
    label = models.CharField(max_length=200, help_text="e.g., 'Active Advertisers'")
    value = models.CharField(max_length=100, help_text="e.g., '500+' or '2M'")
    icon = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=300, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'platform_statistics'
        ordering = ['display_order', 'label']
        verbose_name = "Platform Statistic"
        verbose_name_plural = "Platform Statistics"
    
    def __str__(self):
        return f"{self.label}: {self.value}"