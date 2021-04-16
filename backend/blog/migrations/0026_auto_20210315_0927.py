# Generated by Django 3.1.6 on 2021-03-15 07:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blog', '0025_auto_20210315_0926'),
    ]

    operations = [
        migrations.AlterField(
            model_name='view',
            name='user',
            field=models.ForeignKey(blank=True, default=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
