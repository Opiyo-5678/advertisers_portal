from rest_framework import serializers
from .models import Payment
from accounts.serializers import UserSerializer
from advertisers.serializers import BookingSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payments"""
    user = UserSerializer(read_only=True)
    booking = BookingSerializer(read_only=True)
    
    # Writable field for creation
    booking_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'transaction_id', 'invoice_number',
            'invoice_url', 'gateway_response', 'created_at', 'updated_at'
        ]
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value


class PaymentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for payment listings"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'invoice_number', 'amount', 'currency',
            'payment_method', 'payment_status', 'user_name',
            'created_at'
        ]


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for creating payment"""
    booking_id = serializers.IntegerField(required=False, allow_null=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES)
    description = serializers.CharField(required=False, allow_blank=True)
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value