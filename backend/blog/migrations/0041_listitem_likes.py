# Generated by Django 3.1.6 on 2021-04-16 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0040_listitem_historic'),
    ]

    operations = [
        migrations.AddField(
            model_name='listitem',
            name='likes',
            field=models.BooleanField(default=False),
        ),
    ]
