from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0005_restaurant_review_count.py'),
    ]

    operations = [
        # Create the RestaurantPhoto table
        migrations.CreateModel(
            name='RestaurantPhoto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_key', models.CharField(max_length=255)),  # Store S3 object key
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('restaurant', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='photos',
                    to='restaurants.restaurant'
                )),
            ],
        ),
    ]
