from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'user', 'amount', 'currency', 'payment_method', 'payment_status', 'created_at']
    list_filter = ['payment_status', 'payment_method', 'currency', 'created_at']
    search_fields = ['invoice_number', 'transaction_id', 'user__username', 'user__email']
    date_hierarchy = 'created_at'
    readonly_fields = ['invoice_number', 'transaction_id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('user', 'booking', 'amount', 'currency', 'payment_method')
        }),
        ('Transaction Details', {
            'fields': ('transaction_id', 'payment_status', 'invoice_number', 'invoice_url')
        }),
        ('Additional Info', {
            'fields': ('description', 'gateway_response')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
