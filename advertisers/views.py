from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
import os
from django.conf import settings
import uuid
from rest_framework import serializers
try:
    import clamd
    _HAS_CLAMD = True
except Exception:
    clamd = None
    _HAS_CLAMD = False
from datetime import datetime
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from collections import defaultdict
from .models import (
    PricingPackage, AdPlacement, Ad, UploadedFile,
    Booking, Analytics, Message, MessageReply,
    Notification, AuditLog,
    PlatformBenefit, FAQ, Testimonial, CaseStudy,
    PricingFeature, EnhancedPricingPackage, PackageFeature,
    PromotionalBanner, PlatformStatistic
)
from .serializers import (
    PricingPackageSerializer, AdPlacementSerializer,
    AdSerializer, AdListSerializer, UploadedFileSerializer,
    BookingSerializer, BookingCalendarSerializer,
    AnalyticsSerializer, MessageSerializer, MessageListSerializer,
    MessageReplySerializer, NotificationSerializer, AuditLogSerializer,
    AdStatisticsSerializer, BookingStatisticsSerializer,
    
    PlatformBenefitSerializer, FAQSerializer, FAQListSerializer,
    TestimonialSerializer, CaseStudyListSerializer, CaseStudyDetailSerializer,
    PricingFeatureSerializer, EnhancedPricingPackageSerializer,
    PromotionalBannerSerializer, PlatformStatisticSerializer
)

User = get_user_model()


class PricingPackageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve pricing packages
    """
    queryset = PricingPackage.objects.filter(is_active=True)
    serializer_class = PricingPackageSerializer
    permission_classes = [permissions.AllowAny]


class AdPlacementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve ad placements
    """
    queryset = AdPlacement.objects.filter(is_active=True)
    serializer_class = AdPlacementSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Check availability for a placement"""
        placement = self.get_object()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({
                'error': 'start_date and end_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for conflicts
        conflicts = Booking.objects.filter(
            placement=placement,
            status__in=['confirmed', 'active'],
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        is_available = not conflicts.exists()
        
        return Response({
            'is_available': is_available,
            'conflicting_bookings': BookingCalendarSerializer(conflicts, many=True).data
        })


class AdViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for ads
    """
    queryset = Ad.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'is_featured']
    search_fields = ['title', 'short_description']
    ordering_fields = ['created_at', 'start_date', 'total_clicks', 'total_impressions']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AdListSerializer
        return AdSerializer
    
    def get_queryset(self):
        # Regular users see only their own ads
        if not self.request.user.is_staff:
            return Ad.objects.filter(user=self.request.user)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        ad = serializer.save(user=self.request.user)
        
        # If submitted for review, send notification to admins
        if ad.status == 'pending_review':
            self.notify_admins_new_ad(ad)
    
    def notify_admins_new_ad(self, ad):
        """Send email notification to admins about new ad"""
        try:
            # Get all admin users
            admin_emails = User.objects.filter(
                is_staff=True, is_active=True
            ).values_list('email', flat=True)
            
            if admin_emails:
                subject = f'[AdPortal] New Ad Awaiting Review: {ad.title}'
                message = f"""
Hello Admin,

A new advertisement has been submitted for review:

Title: {ad.title}
Advertiser: {ad.user.username} ({ad.user.email})
Company: {ad.user.company_name or 'N/A'}
Submitted: {ad.created_at.strftime('%Y-%m-%d %H:%M')}

Description:
{ad.short_description or ad.full_description[:200]}

Please review this ad at:
http://127.0.0.1:8000/admin/advertisers/ad/{ad.id}/change/

---
AdPortal Admin System
                """
                
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    admin_emails,
                    fail_silently=True,
                )
                print(f"✉️ Notification sent to {len(admin_emails)} admins")
        except Exception as e:
            print(f"⚠️ Failed to send admin notification: {e}")
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """Approve an ad (admin only)"""
        ad = self.get_object()
        ad.status = 'approved'
        ad.reviewed_by = request.user
        ad.reviewed_at = timezone.now()
        ad.save()
        
        # Notify user via email
        self.notify_user_ad_status(ad, 'approved')
        
        # Create notification
        Notification.objects.create(
            user=ad.user,
            title='Ad Approved',
            message=f'Your ad "{ad.title}" has been approved and is now live!',
            notification_type='ad_approved',
            related_ad=ad
        )
        
        return Response({'message': 'Ad approved successfully'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """Reject an ad (admin only)"""
        ad = self.get_object()
        reason = request.data.get('reason', 'No reason provided')
        
        ad.status = 'rejected'
        ad.rejection_reason = reason
        ad.reviewed_by = request.user
        ad.reviewed_at = timezone.now()
        ad.save()
        
        # Notify user via email
        self.notify_user_ad_status(ad, 'rejected', reason)
        
        # Create notification
        Notification.objects.create(
            user=ad.user,
            title='Ad Rejected',
            message=f'Your ad "{ad.title}" has been rejected. Reason: {reason}',
            notification_type='ad_rejected',
            related_ad=ad
        )
        
        return Response({'message': 'Ad rejected'})
    
    def notify_user_ad_status(self, ad, status, reason=None):
        """Send email to user about ad status change"""
        try:
            if status == 'approved':
                subject = f'[AdPortal] Your Ad "{ad.title}" Has Been Approved!'
                message = f"""
Hello {ad.user.first_name or ad.user.username},

Great news! Your advertisement has been approved and is now live:

Title: {ad.title}
Status: Approved ✅
Approved on: {timezone.now().strftime('%Y-%m-%d %H:%M')}

You can now book advertising slots for this ad in the calendar.

View your ad: http://localhost:5173/ads/{ad.id}

Thank you for using AdPortal!

---
AdPortal Team
                """
            else:  # rejected
                subject = f'[AdPortal] Update Required for "{ad.title}"'
                message = f"""
Hello {ad.user.first_name or ad.user.username},

Your advertisement requires some updates before it can be approved:

Title: {ad.title}
Status: Needs Revision ⚠️

Reason:
{reason}

What to do next:
1. Log in to your account
2. Go to "My Ads"
3. Edit your ad and address the feedback
4. Resubmit for review

Edit your ad: http://localhost:5173/ads/{ad.id}/edit

If you have questions, please contact our support team.

---
AdPortal Team
                """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [ad.user.email],
                fail_silently=True,
            )
            print(f"✉️ Status notification sent to {ad.user.email}")
        except Exception as e:
            print(f"⚠️ Failed to send user notification: {e}")
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for an ad"""
        ad = self.get_object()
        
        # Analytics by date
        analytics = Analytics.objects.filter(ad=ad)
        
        impressions_by_date = analytics.filter(event_type='impression').values(
            'event_timestamp__date'
        ).annotate(count=Count('id')).order_by('event_timestamp__date')
        
        clicks_by_date = analytics.filter(event_type='click').values(
            'event_timestamp__date'
        ).annotate(count=Count('id')).order_by('event_timestamp__date')
        
        # Device breakdown
        device_breakdown = analytics.values('device_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Country breakdown
        country_breakdown = analytics.values('country').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'total_impressions': ad.total_impressions,
            'total_clicks': ad.total_clicks,
            'click_through_rate': ad.click_through_rate,
            'impressions_by_date': list(impressions_by_date),
            'clicks_by_date': list(clicks_by_date),
            'device_breakdown': list(device_breakdown),
            'country_breakdown': list(country_breakdown)
        })
    
    @action(detail=False, methods=['get'])
    def my_statistics(self, request):
        """Get overall statistics for user's ads"""
        user_ads = Ad.objects.filter(user=request.user)
        
        total_ads = user_ads.count()
        active_ads = user_ads.filter(status='live').count()
        pending_ads = user_ads.filter(status='pending_review').count()
        
        total_impressions = user_ads.aggregate(Sum('total_impressions'))['total_impressions__sum'] or 0
        total_clicks = user_ads.aggregate(Sum('total_clicks'))['total_clicks__sum'] or 0
        
        average_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        
        return Response(AdStatisticsSerializer({
            'total_ads': total_ads,
            'active_ads': active_ads,
            'pending_ads': pending_ads,
            'total_impressions': total_impressions,
            'total_clicks': total_clicks,
            'average_ctr': round(average_ctr, 2)
        }).data)


class UploadedFileViewSet(viewsets.ModelViewSet):
    """
    File upload and management
    """
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        # Users see only their own files
        if not self.request.user.is_staff:
            return UploadedFile.objects.filter(user=self.request.user)
        return super().get_queryset()
    
    def scan_file_for_virus(self, file_path):
        """
        Scan a file for viruses using ClamAV
        Returns: ('clean'|'infected'|'failed', threat_name_or_error)
        """
        # If pyclamd / clamd isn't installed, return failed so uploads still work
        if not _HAS_CLAMD or clamd is None:
            print("⚠️ WARNING: clamd (pyclamd) not installed. Skipping virus scan.")
            return ('failed', 'clamd not installed')

        try:
            # Connect to ClamAV daemon (Unix socket by default)
            cd = clamd.ClamdUnixSocket()  # Use ClamdNetworkSocket() for TCP if available

            # Scan the file
            scan_result = cd.scan(file_path)

            if scan_result is None:
                return ('clean', None)

            # Check if file is infected
            if file_path in scan_result:
                status, threat = scan_result[file_path]
                if status == 'FOUND':
                    return ('infected', threat)
                else:
                    return ('clean', None)

            return ('clean', None)

        except clamd.ConnectionError:
            # ClamAV daemon not running
            print("⚠️ WARNING: ClamAV daemon not running. File not scanned.")
            return ('failed', 'ClamAV daemon not available')
        except Exception as e:
            print(f"⚠️ WARNING: Virus scan failed: {str(e)}")
            return ('failed', str(e))
    
    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        
        if not file:
            raise serializers.ValidationError({'file': 'No file provided'})
        
        # Generate unique filename
        ext = os.path.splitext(file.name)[1]
        stored_filename = f"{uuid.uuid4()}{ext}"
        
        # Save file
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, stored_filename)
        
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        
        # Get file size
        file_size_kb = file.size // 1024
        
        # Scan for viruses
        scan_status, threat_info = self.scan_file_for_virus(file_path)
        
        # If infected, delete the file immediately
        if scan_status == 'infected':
            os.remove(file_path)
            raise serializers.ValidationError({
                'file': f'File is infected with malware: {threat_info}. Upload rejected.'
            })
        
        # Get image dimensions if it's an image
        width = None
        height = None
        if file.content_type.startswith('image/'):
            try:
                from PIL import Image
                with Image.open(file_path) as img:
                    width, height = img.size
            except Exception as e:
                print(f"Could not get image dimensions: {e}")
        
        # Calculate relative file path for URL
        relative_path = f'/media/uploads/{stored_filename}'
        
        # Save to database
        serializer.save(
            user=self.request.user,
            original_filename=file.name,
            stored_filename=stored_filename,
            file_path=relative_path,
            file_type=file.content_type,
            file_size_kb=file_size_kb,
            width=width,
            height=height,
            virus_scan_status=scan_status,
            virus_scan_date=timezone.now()
        )
        
        print(f"✓ File uploaded: {file.name} | Scan: {scan_status}")


class BookingViewSet(viewsets.ModelViewSet):
    """
    Booking management (Calendar functionality)
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'placement']
    ordering_fields = ['start_date', 'created_at']
    
    def get_queryset(self):
        # Users see only their own bookings
        if not self.request.user.is_staff:
            return Booking.objects.filter(user=self.request.user)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """Get calendar view of bookings"""
        placement_id = request.query_params.get('placement_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = Booking.objects.filter(status__in=['confirmed', 'active'])
        
        if placement_id:
            queryset = queryset.filter(placement_id=placement_id)
        
        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    Q(start_date__lte=end) & Q(end_date__gte=start)
                )
            except ValueError:
                pass
        
        serializer = BookingCalendarSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        if booking.status not in ['pending', 'confirmed']:
            return Response({
                'error': 'Cannot cancel this booking'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reason = request.data.get('reason', '')
        booking.status = 'cancelled'
        booking.cancellation_reason = reason
        booking.save()
        
        return Response({'message': 'Booking cancelled successfully'})
    
    @action(detail=False, methods=['get'])
    def my_statistics(self, request):
        """Get booking statistics for user"""
        user_bookings = Booking.objects.filter(user=request.user)
        
        total_bookings = user_bookings.count()
        active_bookings = user_bookings.filter(status='active').count()
        completed_bookings = user_bookings.filter(status='completed').count()
        
        total_revenue = user_bookings.filter(
            status__in=['completed', 'active']
        ).aggregate(Sum('final_price'))['final_price__sum'] or 0
        
        return Response(BookingStatisticsSerializer({
            'total_bookings': total_bookings,
            'active_bookings': active_bookings,
            'completed_bookings': completed_bookings,
            'total_revenue': total_revenue
        }).data)


class MessageViewSet(viewsets.ModelViewSet):
    """
    Support message management
    """
    queryset = Message.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'priority']
    ordering_fields = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MessageListSerializer
        return MessageSerializer
    
    def get_queryset(self):
        # Users see only their own messages
        if not self.request.user.is_staff:
            return Message.objects.filter(user=self.request.user)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Add a reply to a message"""
        message = self.get_object()
        reply_text = request.data.get('reply_text')
        
        if not reply_text:
            return Response({
                'error': 'reply_text is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reply = MessageReply.objects.create(
            message=message,
            user=request.user,
            reply_text=reply_text,
            is_admin_reply=request.user.is_staff
        )
        
        return Response(MessageReplySerializer(reply).data, status=status.HTTP_201_CREATED)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    User notifications
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_read', 'notification_type']
    ordering_fields = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'message': 'Marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'message': 'All notifications marked as read'})
    
    # ============================================================================
# MARKETING VIEWSETS (ADD THESE AT THE BOTTOM)
# ============================================================================

class PlatformBenefitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlatformBenefit.objects.filter(is_active=True)
    serializer_class = PlatformBenefitSerializer
    permission_classes = [permissions.AllowAny]


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FAQListSerializer
        return FAQSerializer
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        faqs = FAQ.objects.filter(is_active=True)
        grouped = defaultdict(list)
        for faq in faqs:
            grouped[faq.category].append(faq)
        
        result = []
        for category, category_faqs in grouped.items():
            result.append({
                'category': category,
                'category_display': dict(FAQ.CATEGORY_CHOICES).get(category, category),
                'faqs': FAQListSerializer(category_faqs, many=True).data
            })
        return Response(result)
    
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        faq = self.get_object()
        is_helpful = request.data.get('helpful', True)
        if is_helpful:
            faq.helpful_count += 1
        else:
            faq.not_helpful_count += 1
        faq.save()
        return Response({'message': 'Feedback recorded'})


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        testimonials = Testimonial.objects.filter(is_active=True, is_featured=True)
        serializer = self.get_serializer(testimonials, many=True)
        return Response(serializer.data)


class CaseStudyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CaseStudy.objects.filter(is_published=True)
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filterset_fields = ['industry', 'is_featured']
    search_fields = ['title', 'company_name', 'summary']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CaseStudyDetailSerializer
        return CaseStudyListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        case_studies = CaseStudy.objects.filter(is_published=True, is_featured=True)[:3]
        serializer = CaseStudyListSerializer(case_studies, many=True)
        return Response(serializer.data)


class PricingFeatureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PricingFeature.objects.all()
    serializer_class = PricingFeatureSerializer
    permission_classes = [permissions.AllowAny]


class EnhancedPricingPackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EnhancedPricingPackage.objects.filter(is_active=True)
    serializer_class = EnhancedPricingPackageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def comparison(self, request):
        packages = self.get_queryset()
        all_features = PricingFeature.objects.filter(packages__in=packages).distinct()
        
        return Response({
            'packages': EnhancedPricingPackageSerializer(packages, many=True).data,
            'all_features': PricingFeatureSerializer(all_features, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        package = self.get_queryset().filter(is_popular=True).first()
        if package:
            return Response(self.get_serializer(package).data)
        return Response({'message': 'No packages available'}, status=404)


class PromotionalBannerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PromotionalBannerSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        now = timezone.now()
        return PromotionalBanner.objects.filter(
            is_active=True
        ).filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now)
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=now)
        )


class PlatformStatisticViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlatformStatistic.objects.filter(is_active=True)
    serializer_class = PlatformStatisticSerializer
    permission_classes = [permissions.AllowAny]


class MarketingOverviewViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        benefits = PlatformBenefit.objects.filter(is_active=True)
        statistics = PlatformStatistic.objects.filter(is_active=True)
        testimonials = Testimonial.objects.filter(is_active=True, is_featured=True)[:3]
        case_studies = CaseStudy.objects.filter(is_published=True, is_featured=True)[:3]
        pricing = EnhancedPricingPackage.objects.filter(is_active=True)
        
        now = timezone.now()
        banners = PromotionalBanner.objects.filter(
            is_active=True
        ).filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now)
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=now)
        )
        
        return Response({
            'benefits': PlatformBenefitSerializer(benefits, many=True).data,
            'statistics': PlatformStatisticSerializer(statistics, many=True).data,
            'featured_testimonials': TestimonialSerializer(testimonials, many=True).data,
            'featured_case_studies': CaseStudyListSerializer(case_studies, many=True).data,
            'active_banners': PromotionalBannerSerializer(banners, many=True).data,
            'pricing_packages': EnhancedPricingPackageSerializer(pricing, many=True).data,
        })

# END OF FILE 