# Generated by Django 3.1.6 on 2021-03-16 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0026_auto_20210315_0927'),
    ]

    operations = [
        migrations.AddField(
            model_name='view',
            name='hide',
            field=models.BooleanField(default=False),
        ),
    ]
