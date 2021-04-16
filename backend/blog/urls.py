from django.urls import path ,include
from django.conf.urls import url
from . import views
from django.conf import settings
from django.views.static import serve
from django.conf.urls.static import static

urlpatterns = [
    path('posts/', views.postsAPI),
    path('register/', views.register),
    path('topPosts/', views.topArticles),
    path('viewAPI/', views.viewAPI),
    path('sep/', views.sepPosts),
    path('post/', views.postAPI),
    path('post/new/', views.postAPI),
    path('post/<str:url>/', views.postAPI),
    path('post/delete/<str:url>', views.postAPI),
    path('auth/', views.CustomAuthToken.as_view()),
    path('getUser/', views.getUser),
    path('comments/<str:pk>/', views.commentsApi),
    path('comment/', views.commentApi),
    path('subComments/', views.subCommentsAPI),
    path('deleteComment/<str:pk>/', views.commentApi),
    path('list/', views.listAPI),
    path('search/', views.search),
    path('like/', views.likeApi),
    path('surveyApi/', views.surveyApi),
    path('fileApi/<int:lk>/', views.fileAPI),
    path('fileApi/', views.fileAPI),
    url(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}), 
]