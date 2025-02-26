# Generated by Django 5.1.2 on 2024-12-02 22:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0005_restaurant_review_count'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CuisineType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='FoodType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='restaurant',
            name='cuisine_type',
        ),
        migrations.RemoveField(
            model_name='restaurant',
            name='food_type',
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='owner',
            field=models.ForeignKey(limit_choices_to={'role': 'owner'}, on_delete=django.db.models.deletion.CASCADE, related_name='restaurants', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='cuisine_type',
            field=models.ManyToManyField(related_name='restaurants', to='restaurants.cuisinetype'),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='food_type',
            field=models.ManyToManyField(related_name='restaurants', to='restaurants.foodtype'),
        ),
    ]
