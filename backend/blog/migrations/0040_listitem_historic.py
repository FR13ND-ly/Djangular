# Generated by Django 3.1.6 on 2021-04-16 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0039_auto_20210416_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='listitem',
            name='historic',
            field=models.BooleanField(default=False),
        ),
    ]