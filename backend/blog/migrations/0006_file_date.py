# Generated by Django 3.1.6 on 2021-02-16 09:25

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]