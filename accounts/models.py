from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User Model for Advertisers and Admins
    """
    ROLE_CHOICES = [
        ('advertiser', 'Advertiser'),
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
    ]
    
    SUBSCRIPTION_CHOICES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    ]
    
    # Override email to be unique and required
    email = models.EmailField(unique=True)
    
    # Phone
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Business Information
    company_name = models.CharField(max_length=255, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Account Status
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='advertiser')
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    
    # Subscription
    subscription_tier = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES, default='free')
    subscription_start_date = models.DateField(blank=True, null=True)
    subscription_end_date = models.DateField(blank=True, null=True)
    
    # Credits System
    credits_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Timestamps
    last_login = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class UserProfile(models.Model):
    """
    Extended user profile information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Address
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state_province = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='Kenya')
    
    # Social Media
    website_url = models.URLField(max_length=255, blank=True, null=True)
    facebook_url = models.URLField(max_length=255, blank=True, null=True)
    instagram_url = models.URLField(max_length=255, blank=True, null=True)
    twitter_url = models.URLField(max_length=255, blank=True, null=True)
    linkedin_url = models.URLField(max_length=255, blank=True, null=True)
    
    # Preferences
    receive_email_notifications = models.BooleanField(default=True)
    receive_sms_notifications = models.BooleanField(default=False)
    timezone = models.CharField(max_length=50, default='Africa/Nairobi')
    
    # Profile Image
    profile_image_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile of {self.user.username}"


class PasswordResetToken(models.Model):
    """
    Password reset tokens
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'password_reset_tokens'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Reset token for {self.user.email}"
    
    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at
