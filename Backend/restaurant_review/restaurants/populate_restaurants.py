import random
from faker import Faker
from restaurants.models import Restaurant
from accounts.models import CustomUser

fake = Faker()

def populate_restaurants(n=50):
    # Get a random restaurant owner
    owners = CustomUser.objects.filter(role='owner')
    if not owners.exists():
        print("No owners available. Please create some owner accounts first.")
        return

    categories = ['fast_food', 'fine_dining', 'cafe']
    cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American']
    food_types = ['vegan', 'vegetarian', 'non_veg']
    price_ranges = ['$', '$$', '$$$']

    for _ in range(n):
        restaurant = Restaurant.objects.create(
            owner=random.choice(owners),
            name=fake.company(),
            address=fake.address(),
            city=fake.city(),
            state=fake.state(),
            zip_code=fake.zipcode(),
            cuisine_type=random.choice(cuisines),
            food_type=random.choice(food_types),
            price_range=random.choice(price_ranges),
            hours_of_operation=f"{random.randint(8, 11)}:00 AM - {random.randint(8, 11)}:00 PM",
            website=fake.url(),
            phone_number=fake.phone_number()[:15],
            verified=random.choice([True, False])
        )
        print(f"Added restaurant: {restaurant.name}")

populate_restaurants()
