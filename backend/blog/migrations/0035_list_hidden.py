# Generated by Django 3.1.6 on 2021-04-16 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0034_auto_20210416_1538'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='hidden',
            field=models.BooleanField(default=False),
        ),
    ]