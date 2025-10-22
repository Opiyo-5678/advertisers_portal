# Run this with: python manage.py shell < load_sample_data.py

from advertisers.models import PricingPackage, AdPlacement

# Create Pricing Packages
PricingPackage.objects.create(
    package_name='Basic Plan',
    package_type='basic',
    price_monthly=29.99,
    price_quarterly=79.99,
    price_yearly=299.99,
    max_active_ads=5,
    analytics_access=False,
    description='Perfect for small businesses'
)

PricingPackage.objects.create(
    package_name='Premium Plan',
    package_type='premium',
    price_monthly=79.99,
    price_quarterly=219.99,
    price_yearly=799.99,
    max_active_ads=20,
    analytics_access=True,
    description='For growing businesses'
)

PricingPackage.objects.create(
    package_name='Enterprise Plan',
    package_type='enterprise',
    price_monthly=199.99,
    price_quarterly=549.99,
    price_yearly=1999.99,
    max_active_ads=100,
    analytics_access=True,
    priority_support=True,
    featured_placement=True,
    description='Unlimited features for large companies'
)

# Create Ad Placements
AdPlacement.objects.create(
    placement_name='Homepage Banner',
    placement_code='homepage_banner',
    base_price_per_day=50.00,
    dimensions='1200x400',
    description='Prime position on homepage'
)

AdPlacement.objects.create(
    placement_name='Sidebar Ad',
    placement_code='sidebar_ad',
    base_price_per_day=20.00,
    dimensions='300x250',
    description='Sidebar placement on all pages'
)

AdPlacement.objects.create(
    placement_name='Category Featured',
    placement_code='category_featured',
    base_price_per_day=35.00,
    dimensions='800x300',
    description='Featured in category pages'
)

AdPlacement.objects.create(
    placement_name='Newsletter Spot',
    placement_code='newsletter_spot',
    base_price_per_day=40.00,
    dimensions='600x200',
    description='Included in weekly newsletter'
)

print("Sample data loaded successfully!")