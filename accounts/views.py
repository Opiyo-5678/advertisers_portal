from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import UserProfile, PasswordResetToken
from .serializers import (
    UserSerializer, UserRegistrationSerializer,
    UserProfileSerializer, ChangePasswordSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    """
    Authentication endpoints: register, login, logout, etc.
    """
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login user"""
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Please provide both username and password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'error': 'Account is deactivated'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Update last login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """Logout user"""
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get current user details"""
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        """Change user password"""
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({
                    'old_password': ['Wrong password.']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def password_reset_request(self, request):
        """Request password reset"""
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Generate token
                token = str(uuid.uuid4())
                expires_at = timezone.now() + timedelta(hours=24)
                
                PasswordResetToken.objects.create(
                    user=user,
                    token=token,
                    expires_at=expires_at
                )
                
                # TODO: Send email with reset link
                # send_password_reset_email(user, token)
                
                return Response({
                    'message': 'Password reset email sent',
                    'token': token  # Remove this in production!
                }, status=status.HTTP_200_OK)
            
            except User.DoesNotExist:
                # Don't reveal that user doesn't exist (security)
                return Response({
                    'message': 'If email exists, password reset email sent'
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def password_reset_confirm(self, request):
        """Confirm password reset"""
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            token = serializer.validated_data['token']
            
            try:
                reset_token = PasswordResetToken.objects.get(token=token)
                
                if not reset_token.is_valid():
                    return Response({
                        'error': 'Token is expired or already used'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Reset password
                user = reset_token.user
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                
                # Mark token as used
                reset_token.used = True
                reset_token.save()
                
                return Response({
                    'message': 'Password reset successful'
                }, status=status.HTTP_200_OK)
            
            except PasswordResetToken.DoesNotExist:
                return Response({
                    'error': 'Invalid token'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """
    User management endpoints
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Regular users can only see themselves
        if not self.request.user.is_staff:
            return User.objects.filter(id=self.request.user.id)
        return super().get_queryset()
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        """Get or update user profile"""
        user = request.user
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(user.profile)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = UserProfileSerializer(
                user.profile,
                data=request.data,
                partial=(request.method == 'PATCH')
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
