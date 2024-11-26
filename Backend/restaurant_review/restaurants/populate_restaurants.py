import random
from faker import Faker
from restaurants.models import Restaurant
from accounts.models import CustomUser

fake = Faker()

def repopulate_restaurants(n=50):
    # Fetch owners
    owners = CustomUser.objects.filter(role='owner')
    if not owners.exists():
        print("No owners available. Please create some owner accounts first.")
        return

    # Define options
    cuisines = ['Mexican', 'Greek', 'Italian', 'Chinese']
    food_types = ['vegetarian', 'vegan', 'gluten-free']
    price_ranges = ['$', '$$', '$$$']
    ratings = [round(random.uniform(1, 5), 1) for _ in range(100)]

    # Clear the existing data
    Restaurant.objects.all().delete()

    for _ in range(n):
        try:
            # Create restaurant
            restaurant = Restaurant.objects.create(
                owner=random.choice(owners),
                name=fake.company(),
                address=fake.street_address(),
                city=fake.city(),
                state=fake.state(),
                zip_code=fake.zipcode(),
                cuisine_type=random.choice(cuisines),
                food_type=random.choice(food_types),
                price_range=random.choice(price_ranges),
                rating=random.choice(ratings),
                hours_of_operation=f"{random.randint(8, 11)}:00 AM - {random.randint(8, 11)}:00 PM",
                website=fake.url(),
                phone_number=fake.phone_number()[:15],
                verified=True,
                latitude=fake.latitude(),
                longitude=fake.longitude(),
            )
            print(f"Added restaurant: {restaurant.name}")
        except Exception as e:
            print(f"Error adding restaurant: {e}")

# Run the script
repopulate_restaurants(100)  # Populate with 100 restaurants
