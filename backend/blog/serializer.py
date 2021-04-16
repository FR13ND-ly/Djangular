from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.Serializer):
    author = serializers.CharField()
    pk = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    text = serializers.CharField()
    date = serializers.DateTimeField()
    class Meta:
        model = Post
        fields = '__all__'