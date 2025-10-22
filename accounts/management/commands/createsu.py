from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates superuser and demo user if they do not exist'

    def handle(self, *args, **options):
        # Create superuser
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'changeme123')

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created successfully!'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser "{username}" already exists.'))

        # Create demo user
        demo_username = 'demo'
        demo_email = 'demo@example.com'
        demo_password = 'demo123'

        if not User.objects.filter(username=demo_username).exists():
            User.objects.create_user(
                username=demo_username,
                email=demo_email,
                password=demo_password,
                first_name='Demo',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS(f'Demo user "{demo_username}" created successfully!'))
        else:
            self.stdout.write(self.style.WARNING(f'Demo user "{demo_username}" already exists.'))