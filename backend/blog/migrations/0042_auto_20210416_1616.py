# Generated by Django 3.1.6 on 2021-04-16 13:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0041_listitem_likes'),
    ]

    operations = [
        migrations.RenameField(
            model_name='listitem',
            old_name='likes',
            new_name='like',
        ),
    ]
