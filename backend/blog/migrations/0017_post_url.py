# Generated by Django 3.1.6 on 2021-03-09 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0016_remove_post_block_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='url',
            field=models.CharField(default=True, max_length=200),
        ),
    ]