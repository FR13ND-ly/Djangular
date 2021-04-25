from django.conf import settings
from django.db import models
from django.utils import timezone

class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=False)
    title = models.CharField(max_length=200)
    text = models.TextField()
    url = models.CharField(max_length=200, default=True)
    date = models.DateTimeField(default=timezone.now)
    draft = models.BooleanField(default=False)
    has_survey = models.BooleanField(default=False)
    surveys_question = models.CharField(max_length=200, blank=True, null=True)
    type_of_vote = models.BooleanField(default=True)
    active_survey = models.BooleanField(default=False)
    cover = models.ForeignKey('blog.Image', on_delete=models.CASCADE, related_name='cover', null=True)
    block_comments = models.BooleanField(default=False)
    hide_likes = models.BooleanField(default=False)
    tags = models.TextField(default="")

    def __str__(self):
        return self.title

class Image(models.Model):
    file = models.ImageField(blank=False, null=False)
    date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.file.name

class Comment(models.Model):
    author = models.CharField(max_length=200, null=True)
    text = models.TextField(null=True)
    post = models.ForeignKey('blog.Post', on_delete=models.CASCADE, related_name='comments')
    date = models.DateTimeField(default=timezone.now)
    by_administration = models.BooleanField(default=False)
    by_authenticated = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class SubComment(models.Model):
    author = models.CharField(max_length=200, null=True)
    text = models.TextField(null=True)
    comment = models.ForeignKey('blog.Comment', on_delete=models.CASCADE, related_name='subComments')
    date = models.DateTimeField(default=timezone.now)
    by_administration = models.BooleanField(default=False)
    by_authenticated = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    darktheme = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class List(models.Model):
    name = models.CharField(max_length=200, default=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    noAccessOtherUsers = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)
    removable = models.BooleanField(default=True)
    hidden = models.BooleanField(default=False)

    def __str__(self):
        return self.name + " (" + self.user.username + ")"

class ListItem(models.Model):
    List = models.ForeignKey('blog.List', on_delete=models.CASCADE, blank=True, null=True)
    post = models.ForeignKey('blog.Post', on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    historic = models.BooleanField(default=False)
    like = models.BooleanField(default=False)
    
    def __str__(self):
        return self.post.title + " (" + self.List.user.username + ")"

class Survey(models.Model):
    post = models.ForeignKey('blog.Post', on_delete=models.CASCADE, related_name='survey', null=True)
    variant = models.CharField(max_length=200)

class Vote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    variant = models.ForeignKey('blog.Survey', on_delete=models.CASCADE, related_name='vote')

class Addon(models.Model):
    link = models.CharField(max_length=200, null=True)
    title = models.CharField(max_length=200, default="Text" ,null=True)
    description = models.CharField(max_length=200, default="Text", null=True)
    image = models.ForeignKey('blog.Image', on_delete=models.CASCADE, related_name='addon', null=True)
    onlyImage = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    draft = models.BooleanField(default=False)