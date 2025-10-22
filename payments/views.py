from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Payment
from .serializers import PaymentSerializer, PaymentListSerializer, PaymentCreateSerializer
from advertisers.models import Booking


class PaymentViewSet(viewsets.ModelViewSet):
    """
    Payment management
    """
    queryset = Payment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['payment_status', 'payment_method']
    ordering_fields = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        elif self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        # Users see only their own payments
        if not self.request.user.is_staff:
            return Payment.objects.filter(user=self.request.user)
        return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        """Create a new payment"""
        serializer = PaymentCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get booking if provided
            booking = None
            if serializer.validated_data.get('booking_id'):
                try:
                    booking = Booking.objects.get(
                        id=serializer.validated_data['booking_id'],
                        user=request.user
                    )
                except Booking.DoesNotExist:
                    return Response({
                        'error': 'Booking not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            # Create payment
            payment = Payment.objects.create(
                user=request.user,
                booking=booking,
                amount=serializer.validated_data['amount'],
                payment_method=serializer.validated_data['payment_method'],
                description=serializer.validated_data.get('description', '')
            )
            
            # TODO: Integrate with payment gateway (Stripe, PayPal, M-Pesa)
            # process_payment(payment)
            
            # For now, mark as completed (remove this in production)
            payment.payment_status = 'completed'
            payment.transaction_id = f"TXN-{payment.id}-TEST"
            payment.save()
            
            # Update booking status if payment is for a booking
            if booking:
                booking.status = 'confirmed'
                booking.save()
            
            return Response(
                PaymentSerializer(payment).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_statistics(self, request):
        """Get payment statistics for user"""
        user_payments = Payment.objects.filter(user=request.user)
        
        total_payments = user_payments.count()
        completed_payments = user_payments.filter(payment_status='completed').count()
        pending_payments = user_payments.filter(payment_status='pending').count()
        
        total_spent = user_payments.filter(
            payment_status='completed'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'total_payments': total_payments,
            'completed_payments': completed_payments,
            'pending_payments': pending_payments,
            'total_spent': float(total_spent)
        })
    
    @action(detail=True, methods=['get'])
    def invoice(self, request, pk=None):
        """Get invoice for a payment"""
        payment = self.get_object()
        
        # TODO: Generate PDF invoice
        # invoice_pdf = generate_invoice_pdf(payment)
        
        return Response({
            'invoice_number': payment.invoice_number,
            'amount': payment.amount,
            'currency': payment.currency,
            'payment_status': payment.payment_status,
            'created_at': payment.created_at,
            # 'pdf_url': invoice_pdf_url
        })