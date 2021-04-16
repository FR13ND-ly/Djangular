from django.contrib import admin
from .models import Post, Comment, Image, List, ListItem

admin.site.register(List)
admin.site.register(ListItem)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Image)
