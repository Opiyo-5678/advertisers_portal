from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, PasswordResetToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'subscription_tier', 'is_active', 'created_at']
    list_filter = ['role', 'subscription_tier', 'is_active', 'is_email_verified']
    search_fields = ['username', 'email', 'company_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Business Information', {
            'fields': ('phone', 'company_name', 'business_type', 'tax_id')
        }),
        ('Account Details', {
            'fields': ('role', 'is_email_verified', 'email_verification_token')
        }),
        ('Subscription', {
            'fields': ('subscription_tier', 'subscription_start_date', 'subscription_end_date', 'credits_balance')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'country', 'receive_email_notifications']
    search_fields = ['user__username', 'user__email', 'city']
    list_filter = ['country', 'receive_email_notifications']


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'expires_at', 'used', 'created_at']
    list_filter = ['used']
    search_fields = ['user__email', 'token']