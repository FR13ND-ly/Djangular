# Generated by Django 3.1.6 on 2021-04-16 13:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0037_auto_20210416_1551'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listitem',
            name='List',
            field=models.ForeignKey(default=None, null=None, on_delete=django.db.models.deletion.CASCADE, to='blog.list'),
        ),
    ]
