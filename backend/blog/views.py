from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FileUploadParser
from django.contrib.auth.hashers import make_password
import os
from django.contrib.auth.models import User
from datetime import timedelta
from dateutil.relativedelta import relativedelta


from .serializer import PostSerializer
from .models import Post, Image, Comment, Survey, Vote, Profile, List, ListItem, SubComment, Addon

import locale
locale.setlocale(locale.LC_ALL, 'ro')

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token' : token.key,
            'user_id' : user.pk,
            'username' : user.username,
            'email' : user.email,
            'is_authenticated' : user.is_authenticated,
            'is_staff' : user.is_staff
        })

@csrf_exempt
def getUser(request):
    data = JSONParser().parse(request)
    token = data['token']
    if token == None:
        response = {
            'user_id' : 0,
            'username' : "Autentifică-te",
            'is_authenticated' : False,
            'is_staff' : False,
            'token' : token,
            "darktheme" : False
        }
    else:
        user = Token.objects.get(key=token).user
        response = {
           'user_id' : user.pk,
           'username' : user.username,
           'is_authenticated' : user.is_authenticated,
           'is_staff' : user.is_staff,
           'token' : token,
           "darktheme" : False
        }
    return JsonResponse(response, safe=False)

@csrf_exempt
def register(request):
    data = JSONParser().parse(request)
    for i in User.objects.all():
        if i.username == data['username']:
            print("error")
    for i in ['admin', 'administrator', 'est curier', 'estcurier', 'est-curier', 'administrația']:
        if i in data['username'].lower():
            print("error")
    user = User.objects.create(username = data['username'], date_joined = timezone.now(), password = make_password(data['password']))
    user.save()
    profile = Profile.objects.create(user=user)
    profile.save()
    token, created = Token.objects.get_or_create(user=user)
    for i in ['Istoric', 'Pe mai târziu', 'Aprecieri']:
        newList = List.objects.create(
            user = user,
            name = i,
            noAccessOtherUsers = False,
            removable = False,
            hidden = False if i == "Pe mai târziu" else True
        )
        newList.save()
    response = {
        'token' : token.key,
        'user_id' : user.pk,
        'username' : user.username,
        'email' : user.email,
        'is_authenticated' : user.is_authenticated,
        'is_staff' : user.is_staff
    }
    return JsonResponse(response, safe=False)

@csrf_exempt
def postsAPI(request):
    data = JSONParser().parse(request)
    lk = int(data["lk"])
    user_is_staff = Token.objects.get(key = data['token']).user.is_staff if data['token'] != None else False
    if user_is_staff:
        relative_number_of_pages = (len(Post.objects.all()) - 1) // 5 + 1
        posts = Post.objects.all().order_by('date').select_related('author', 'cover').reverse()
    else:
        relative_number_of_pages = (len(Post.objects.all().filter(draft = False)) - 1) // 5 + 1
        posts = Post.objects.filter(draft = False).order_by('date').select_related('author', 'cover').reverse()
    if (len(posts) - lk * 5) < 0:
        posts = posts[(lk - 1)* 5 : ]
    else:
        posts = posts[(lk - 1) * 5 : lk * 5]
    number_of_pages = []
    if relative_number_of_pages > 1:
        if lk < 4:
            for i in range(1, lk + 3 + (5 - lk)):
                if i <= relative_number_of_pages:
                    number_of_pages.append(i)
        if lk > 3:
            for i in range(lk - 3, lk + 4):
                if i <= relative_number_of_pages:
                    number_of_pages.append(i)
                else:
                    if lk - 3 - (i - relative_number_of_pages) > 0:
                        number_of_pages.insert(0, lk - 3 - (i - relative_number_of_pages))
    Posts = []
    response = {
        'posts' : Posts, 
        'number_of_pages' : number_of_pages, 
    }
    for post in posts:
        response['posts'].append({
            "author": post.author.username,
            "pk": post.pk,
            "title": post.title,
            "likeCount" : len(ListItem.objects.filter(post = post, like=True)),
            "views" : len(ListItem.objects.filter(post = post, historic=True)),
            "text": post.text,
            "date": formatDate(post.date),
            "draft" : post.draft,
            "url" : post.url,
            "cover": "http://127.0.0.1:8000/api" + post.cover.file.url
        })   
    return JsonResponse(response, safe=False)

def topArticles(requests):
    top_posts_dict = {}
    top_posts_points = []
    def check_exist(points):
        if points in top_posts_dict:
            points += 1
            check_exist(points)
        else:
            top_posts_dict[points] = i
            top_posts_points.append(points)
    for i in Post.objects.filter(draft = False).select_related('cover', 'author').order_by('date').reverse()[:15]:
        points = len(ListItem.objects.filter(post = i, like=True))
        points += len(ListItem.objects.filter(post = i, historic=True)) * 5
        check_exist(points)
    top_posts_points.sort()
    top_posts_points.reverse()
    tposts = []
    for tpoints in top_posts_points[ : 3]:
            tposts.append(top_posts_dict[tpoints])
    posts = []
    for post in tposts:
        posts.append({
            "author": post.author.username,
            "pk": post.pk,
            "title": post.title,
            "likeCount" : len(ListItem.objects.filter(post = post, like=True)),
            "views" : len(ListItem.objects.filter(post = post, historic=True)),
            "text" : post.text,
            "url" : post.url,
            "draft": post.draft,
            "date": formatDate(post.date),
            "cover": "http://127.0.0.1:8000/api" + post.cover.file.url
        })
    response = {
        "posts" : posts
    }
    return JsonResponse(response, safe=False)

def sepPosts(request):
    economic, politic, social, cultural, video = [], [], [], [], []
    for post in Post.objects.select_related('author', 'cover').order_by('-date'):
        if 'economic' in post.tags.lower() and len(economic) < 5:
            economic.append(post) 
        elif 'politic' in post.tags.lower() and len(politic) < 5:
            politic.append(post) 
        elif 'social' in post.tags.lower() and len(social) < 5: 
            social.append(post)
        elif 'cultural' in post.tags.lower() and len(social) < 5: 
            cultural.append(post)
        elif 'video' in post.tags.lower() and len(video) < 3: 
            video.append(post)
    def toResponse(listR):
        posts = []
        for post in listR:
            posts.append({
                "author": post.author.username,
                "pk": post.pk,
                "title": post.title,
                "likeCount" : len(ListItem.objects.filter(post = post, like=True)),
                "views" : len(ListItem.objects.filter(post = post, historic=True)),
                "text": post.text,
                "url" : post.url,
                "date": formatDate(post.date),
                "cover": "http://127.0.0.1:8000/api" + post.cover.file.url
            })
        return posts
    response = {
        'economic' : toResponse(economic),
        'social' : toResponse(social),
        'politic' : toResponse(politic),
        'cultural' : toResponse(cultural),
        'video' : toResponse(video)
    }  
    return JsonResponse(response, safe=False)

def formatDate(date):
    new_date = date.strftime("%d %B %Y, %H:%M").split()
    new_date[1] = new_date[1].capitalize()
    new_date = " ".join(new_date)
    return new_date

@csrf_exempt
def subCommentsAPI(request):
    data = JSONParser().parse(request)
    response = {}
    if request.method == "POST":
        subComment = SubComment.objects.create(
            author = data['author'],
            text = data['text'],
            comment = Comment.objects.get(pk = data['commentPk']),
            date = timezone.now(),
            by_administration = data['admin'],
            by_authenticated =  data['auth']
        )
        subComment.save()
    elif request.method == "PUT":
        subComment = SubComment.objects.get(pk = data['pk'])
        subComment.delete()
    return JsonResponse(response, safe=False)

@csrf_exempt
def listAPI(request):
    data = JSONParser().parse(request)
    user = Token.objects.get(key = data['token']).user if data['token'] != None else None
    response = {}
    if user == None:
        return JsonResponse(response, safe=False)
    if request.method == "POST":
        if data["method"] == "GET":
            if data.get('pk'):
                post = Post.objects.get(url = data['pk'])
                lists = []
                for i in List.objects.filter(user = user, hidden = False):
                    added = False
                    for j in ListItem.objects.filter(List = i):
                        if post == j.post:
                            added = True
                    lists.append({
                        "pk" : i.pk,
                        "name" : i.name,
                        "access" : i.noAccessOtherUsers,
                        "added" : added
                    })
                response = lists
            else:
                lists = []
                for i in List.objects.filter(user = user):
                    posts = []
                    for item in ListItem.objects.filter(List = i).order_by("-date")[ : 4]:
                        posts.append({
                            "title" : item.post.title,
                            "url" : item.post.url,
                            "cover" : "http://127.0.0.1:8000/api" + item.post.cover.file.url
                        })
                    lists.append({
                        "pk" : i.pk,
                        "name" : i.name,
                        "access" : i.noAccessOtherUsers,
                        "posts" : posts,
                        "length" : ListItem.objects.filter(List = i).count(),
                        "hidden": i.hidden
                    })
                response = {
                    "lists" : lists,
                    "views" : len(ListItem.objects.filter(List = List.objects.get_or_create(user=user, name="Istoric", removable=False, hidden=True)[0])),
                    "likes" : len(ListItem.objects.filter(List = List.objects.get_or_create(user=user, name="Aprecieri", removable=False, hidden= True)[0]))
                }
            return JsonResponse(response, safe=False)
        elif data['method'] == "POST":
            newList = List.objects.create(
                user = user,
                name = data['name'],
                noAccessOtherUsers = data['access']
            )
            newList.save()
        elif data['method'] == "GETALL":
            tList = List.objects.get(pk = data['listPk'])
            if user != tList.user and not tList.noAccessOtherUsers:
                response = {
                    "status" : "error",
                }
                return JsonResponse(response, safe=False)
            lk = data['lk']
            posts = []
            for item in ListItem.objects.filter(List = tList).order_by(data['direction'] + "date")[lk * 20 : (lk + 1) * 20]:
                posts.append({
                    "author": item.post.author.username,
                    "pk": item.post.pk,
                    "title": item.post.title,
                    "likeCount" : len(ListItem.objects.filter(post = item.post, like=True)),
                    "views" : len(ListItem.objects.filter(post = item.post, historic=True)),
                    "text": item.post.text,
                    "date": formatDate(item.post.date),
                    "createdDate" : formatDate(item.date),
                    "draft" : item.post.draft,
                    "url" : item.post.url,
                    "cover": "http://127.0.0.1:8000/api" + item.post.cover.file.url
                })
            response = {
                "posts" : posts,
                "name" : tList.name,
                "access" : tList.noAccessOtherUsers,
                "hidden" : tList.hidden,
                "removable" : tList.removable,
                "pk" : tList.pk,
                "author" : tList.user.username,
                "status" : "success",
                "own" : user == tList.user,
                "last" : (len(ListItem.objects.filter(List = tList)) - 20 * ( lk - 1 )) < 20,
                "length" : len(ListItem.objects.filter(List = tList))
            }
        if data['method'] == "DELETE":
            tList = List.objects.get(pk = data['listPk'])
            tList.delete()
    elif request.method == "PUT":
        if data["method"] == "POST":
            nList = List.objects.get(pk = data['listPk'])
            post = Post.objects.get(url = data['postPk'])
            newItem = ListItem.objects.create(
                List = nList,
                post = post
            )
            newItem.save()
        elif data["method"] == "PUT":
            nList = List.objects.get(pk=data['listPk'])
            if data['target'] == "access":
                nList.noAccessOtherUsers = data['access']
            elif data['target'] == "name":
                nList.name = data['name']
            nList.save()
        elif data["method"] == "DELETE":
            listItem = ListItem.objects.filter(List=List.objects.get(pk = data['listPk']), post = Post.objects.get(url = data["postPk"]))
            listItem.delete()
    return JsonResponse(response, safe=False)
1
@csrf_exempt
def viewAPI(request):
    response = {}
    data = JSONParser().parse(request)
    if request.method == "PUT":
        post = Post.objects.get(url = data['url'])
        newListItem = ListItem.objects.create(post = post, date = timezone.now(), historic=True)
        if data['token'] != None:
            newListItem.List = List.objects.get(name="Istoric", user = Token.objects.get(key = data['token']).user)
        newListItem.save()
    return JsonResponse(response, safe=False)

@csrf_exempt
def postAPI(request, url=0):
    if request.method == "GET":
        post = Post.objects.get(url = url)
        variants = {}
        questionList = []
        for i in Survey.objects.filter(post = post):
            variants.update({i.variant  : len(Vote.objects.filter(variant = i))})
            questionList.append([i.variant])
        response = {
            "title" : post.title,
            "pk" : post.pk,
            "author" : post.author.username,
            "text" : post.text,
            "draft" : post.draft,
            "date" : formatDate(post.date),
            "views" : len(ListItem.objects.filter(post = post, historic=True)),
            "blockComments" : post.block_comments,
            "hideLikes" : post.hide_likes,
            "questionList" : questionList,
            "tags" : post.tags.strip().split(" "),
            "surveysQuestion" : post.surveys_question,
            "surveyActive" : post.active_survey,
            "typeOfVote" : post.type_of_vote,
            "imagePk" :  post.cover.pk,
            "cover" : "http://127.0.0.1:8000/api" + post.cover.file.url,
            "variants" : variants
        }
        return JsonResponse(response, safe=False)
    if request.method == "POST":
        post_data = JSONParser().parse(request)
        user = Token.objects.get(key=post_data['token']).user
        tags = ""
        for i in post_data['tags']:
            tags += " " + i['tag']
        post = Post.objects.create(
            author = user, 
            title = post_data['title'], 
            text = post_data['text'], 
            date = timezone.now(),
            draft = post_data['draft'],
            block_comments = post_data['blockComments'],
            hide_likes = post_data['hideLikes'],
            tags = tags.strip(),
            type_of_vote = post_data['typeOfSurvey'],
            active_survey = post_data['activeSurvey'],
            surveys_question = post_data['surveysQuestion'],
            url = post_data['title'].replace(' ', '-')
        )
        post.cover = Image.objects.get(pk = post_data['pk'])
        if post.active_survey:
            for i in post_data['variants']:
                newSurvey = Survey.objects.create(post = post, variant = i)
                newSurvey.save()
        tags = ""
        for i in post_data['tags']:
            tags += " " + i['tag']
        post.tags = tags
        post.save()
        return JsonResponse(str(post.url), safe=False)
    if request.method == "PUT":
        data = JSONParser().parse(request)
        post = Post.objects.get(url = data['url'])
        post.title = data['title']
        post.text = data['text']
        post.url = data['title'].replace(' ', '-')
        post.draft = data['draft']
        post.cover = Image.objects.get(pk = data['imgPk'])
        post.block_comments = data['blockComments']
        post.hide_likes = data['hideLikes']
        post.type_of_vote = data['typeOfVote']
        post.active_survey = data['activeSurvey']
        for i in Survey.objects.filter(post = post):
            i.delete()
        if post.active_survey:
            for i in data['variants']:
                newSurvey = Survey.objects.create(post = post, variant = i)
                newSurvey.save()
        tags = ''
        for i in data['tags']:
            tags += " " + i['tag']
        post.tags = tags
        post.save()
        response = {
            "url" : post.url 
        }
        return JsonResponse(response, safe=False)
    if request.method == "DELETE":
        Post.objects.get(url = url).delete()
        return JsonResponse("Success", safe=False)

@csrf_exempt
def surveyApi(request):
    data = JSONParser().parse(request)
    if request.method == "POST":
        post = Post.objects.get(url = data['url'])
        user = Token.objects.get(key = data['token']).user if data['token'] != None else None
        variants = {}
        user_voted = False
        for i in Survey.objects.filter(post = post):
            variants.update({i.variant  : [len(Vote.objects.filter(variant = i)), i.pk]})
            for j in Vote.objects.filter(variant = i):
                if j.user == user:
                    user_voted = True
        response = {
            "user_voted" : user_voted,
            "surveys_question" : post.surveys_question,
            "variants" : variants
        }
        return JsonResponse(response, safe=False)
    elif request.method == "PUT":
        user = Token.objects.get(key = data['token']).user if len(data['token']) != 0 else None
        post = Post.objects.get(url = data['url'])
        if post.type_of_vote:
            survey = Survey.objects.get(pk = data['pk'])
            vote = Vote.objects.create(variant = survey, user = user)
            vote.save()
        else:
            for i in data['pk'].strip().split(" "):
                survey = Survey.objects.get(pk = int(i))
                vote = Vote.objects.create(variant = survey, user = user)
                vote.save()
        variants = {}
        for i in Survey.objects.filter(post = post):
            variants.update({i.variant  : [len(Vote.objects.filter(variant = i)), i.pk]})
            for j in Vote.objects.filter(variant = i):
                if j.user == user:
                    user_voted = True
        response = {
            "user_voted" : user_voted,
            "surveys_question" : post.surveys_question,
            "variants" : variants
        }
        return JsonResponse(response, safe=False)

    
@csrf_exempt
def fileAPI(request, lk = 1):
    if request.method == "GET":
        imgList = []
        for i in Image.objects.all().order_by('date').reverse()[8 * (lk - 1) : 8 * lk]:
            imgList.append({"pk": i.pk, "url": "http://127.0.0.1:8000/api" + i.file.url})
        response = {
            "imgList" : imgList,
            "lastImages" : (len(Image.objects.all()) - 8 * (lk-1)) < 8
        }
        return JsonResponse(response, safe=False)
    if request.method == "POST":
        file = Image.objects.create(file = request.FILES['file'])
        file.save()
        response = {
            "location" : "http://127.0.0.1:8000/api" + file.file.url
        }
        return JsonResponse(response, safe=False)

@csrf_exempt
def commentsApi(request, pk):
    post = Post.objects.get(url = pk)
    comments = Comment.objects.filter(post = post).order_by("date").reverse()
    response = []
    for comment in comments:
        subComments = []
        for i in SubComment.objects.filter(comment = comment).order_by('-date'):
            subComments.append({
                'author': i.author,
                'text' : i.text,
                'pk' : i.pk,
                'date' : formatDate(i.date),
                'admin' : i.by_administration,
                'auth' : i.by_authenticated
            })
        response.append({
            "author": comment.author,
            "pk": comment.pk,
            "text": comment.text,
            "date": formatDate(comment.date),
            "admin": comment.by_administration,
            "auth": comment.by_authenticated,
            "answer" : False,
            "subComments" : subComments
        })
    return JsonResponse(response, safe=False)

@csrf_exempt
def commentApi(request, pk=0):
    if request.method == "POST":
        comment_data = JSONParser().parse(request)
        post = Post.objects.get(url = comment_data['url'])
        comment = Comment.objects.create(post = post, author = comment_data['author'], text = comment_data['text'], by_authenticated = comment_data['by_authenticated'], by_administration = comment_data['by_administration'], date = timezone.now())
        comment.save()
        response = {
            "author": comment.author,
            "pk": comment.pk,
            "text": comment.text,
            "date": formatDate(comment.date),
            "admin": comment.by_administration,
            "auth": comment.by_authenticated
        }
        return JsonResponse(response, safe=False)
    if request.method == "DELETE":
        Comment.objects.get(pk = pk).delete()
        return JsonResponse("Succes", safe=False)


@csrf_exempt
def likeApi(request):
    like_data = JSONParser().parse(request)
    post = Post.objects.get(url = like_data['url'])
    user = Token.objects.get(key = like_data['token']).user if len(Token.objects.filter(key = like_data['token'])) != 0 else None
    response = {}
    if request.method == "POST":
        if user == None:
            response = {
                "like_count" : len(ListItem.objects.filter(post = post, like=True)),
                "liked" : "favorite_outline"
            }
        else:
            response = {
                "like_count" : len(ListItem.objects.filter(post = post, like=True)),
                "liked" : "favorite_outline" if len(ListItem.objects.filter(List = List.objects.get(user = user, name = "Aprecieri"), post = post, like = True)) == 0 else "favorite"
            }
        return JsonResponse(response, safe=False)
    if request.method == "PUT":
        like, created = ListItem.objects.get_or_create(List = List.objects.get(user = user, name = "Aprecieri"), post = post, like = True)
        if created:
            like.save()
        else:
            like.delete()
        response = {
            "like_count" : len(ListItem.objects.filter(post = post, like=True)),
            "liked" : "favorite_outline" if len(ListItem.objects.filter(List = List.objects.get(user = user, name = "Aprecieri"), post = post, like = True)) == 0 else "favorite"
        }
        return JsonResponse(response, safe=False)


@csrf_exempt
def search(request):
    data = JSONParser().parse(request)
    def prepare(word):
        return word.lower().replace('ț', 't').replace('ș', 's').replace('î', 'i').replace('â', 'a').replace('ă', 'a')

    def prepare_word_list(word_list):
        for i in ["și", "sau", "de", "care", "la", "a", "fi", "eu", "ea", "el", "dar", "tu"]:
            if i in word_list:
                word_list.remove(i)
        return word_list
    if data['text'][0] == "#":
        posts = []
        for post in Post.objects.all():
            if data['text'][1:] in post.tags.split(" "):
                posts.append(post)
        result = []
        for post in posts:
            result.append({
                "author": post.author.username,
                "pk": post.pk,
                "title": post.title,
                "likeCount" : len(ListItem.objects.filter(post = post, like=True)),
                "views" : len(ListItem.objects.filter(post = post, historic=True)),
                "text": post.text,
                "date": formatDate(post.date),
                "url" : post.url,
                "cover": "http://127.0.0.1:8000/api" + post.cover.file.url
            })   
        response =  {
            "result" : result
        }
        return JsonResponse(response, safe=False)
    words_list = prepare_word_list(data['text'].split(' '))
    posts = []
    for word in words_list:
        for post in Post.objects.all().order_by("date").reverse():
            for word_of_title in prepare_word_list(post.title.split(" ")):
                if prepare(word) in prepare(word_of_title) and post not in posts:
                    posts.append(post)
            for word_of_text in prepare_word_list(post.text.split(' ')):
                if prepare(word) in prepare(word_of_text) and post not in posts:
                    posts.append(post)
    result = []
    for post in posts:
        result.append({
            "author": post.author.username,
            "pk": post.pk,
            "title": post.title,
            "likeCount" : len(ListItem.objects.filter(post = post, like=True)),
            "views" : len(ListItem.objects.filter(post = post, historic=True)),
            "text": post.text,
            "date": formatDate(post.date),
            "cover": "http://127.0.0.1:8000/api" + post.cover.file.url
        })   
    response =  {
        "result" : result
    }
    return JsonResponse(response, safe=False)

@csrf_exempt
def statistic(request):
    Administrators = User.objects.filter(is_staff = True).count()
    Users = User.objects.filter(is_staff = False).count()
    Posts = Post.objects.all().count()
    Views = ListItem.objects.filter(historic = True).count()
    Likes = ListItem.objects.filter(like = True).count()
    Comments = Comment.objects.all().count()
    views_by_date = {}
    views_by_month = {}
    views_by_year = {}
#    views_by_signed_and_not = {"Autentificat" : int(), "Oaspete" : int()}
  #  white_or_dark_theme_stat = {"Luminoasă" : int(),"Întunecată" : int()}
    comment_by_signed_and_not = {"De autentificați" : int(), "De oaspeți" : int()}
    for i in range(int(timezone.now().strftime("%d")), 0, - 1):
        views_by_date.update({
            i : [
                ListItem.objects.filter(historic = True).filter(date__date=timezone.now() - timedelta(days = int(timezone.now().strftime("%d")) - i)).reverse().count(), 
                ListItem.objects.filter(like = True).filter(date__date=timezone.now() - timedelta(days = int(timezone.now().strftime("%d")) - i)).reverse().count(), 
                Comment.objects.filter(date__date=timezone.now() - timedelta(days = int(timezone.now().strftime("%d")) - i)).reverse().count()
            ]
        })
    for i in range(int(timezone.now().strftime("%m")), -1, -1):
        views_by_month.update({
            (timezone.now() - relativedelta(months = int(timezone.now().strftime("%m"))-i)).strftime("%B").capitalize() : [
                ListItem.objects.filter(historic = True).filter(date__date=timezone.now() - relativedelta(months = int(timezone.now().strftime("%m")) - i)).reverse().count(), 
                ListItem.objects.filter(like = True).filter(date__date=timezone.now() - relativedelta(months = int(timezone.now().strftime("%m")) - i)).reverse().count(), 
                Comment.objects.filter(date__date=timezone.now() - relativedelta(months = int(timezone.now().strftime("%m")) - i)).reverse().count()
            ] 
        })
    for i in range(int(timezone.now().strftime("%Y")), int(timezone.now().strftime("%Y"))-4, -1):
        views_by_year.update({
            i : [
                ListItem.objects.filter(historic = True).filter(date__date=timezone.now() - relativedelta(years = int(timezone.now().strftime("%Y")) - i)).reverse().count(), 
                ListItem.objects.filter(like = True).filter(date__date=timezone.now() - relativedelta(years = int(timezone.now().strftime("%Y")) - i)).reverse().count(), 
                Comment.objects.filter(date__date=timezone.now() - relativedelta(years = int(timezone.now().strftime("%Y")) - i)).reverse().count()
            ] 
        })
 #   for i in ListItem.objects.filter(historic = True):
 #       if i.user != None:
 #           views_by_signed_and_not["Autentificat"] += 1
 #       else:
 #           views_by_signed_and_not["Oaspete"] += 1
 #   for i in Profile.objects.all():
 #       if i.darktheme:
 #           white_or_dark_theme_stat["Întunecată"] += 1
 #       else:
 #           white_or_dark_theme_stat["Luminoasă"] += 1
    for i in Comment.objects.all():
        if  i.by_authenticated:
            comment_by_signed_and_not["De autentificați"] += 1
        else:
            comment_by_signed_and_not["De oaspeți"] += 1
    response = {
        "Administrators" : Administrators, 
        "Users" : Users, 
        "Posts" : Posts, 
        "Views" : Views, 
        "Likes" : Likes, 
        "Comments" : Comments, 
        "views_by_date" : views_by_date, 
        "views_by_month" : views_by_month, 
        "views_by_year" : views_by_year, 
     #   'views_by_signed_and_not' : views_by_signed_and_not , 
     #   "white_or_dark_theme_stat" : white_or_dark_theme_stat, 
        "comment_by_signed_and_not" : comment_by_signed_and_not}
    return JsonResponse(response, safe=False)

@csrf_exempt
def addonsAPI(request):
    response = {}
    data = JSONParser().parse(request)
    if data['method'] == "GET":
        response = []
        for pk in range(1, 5):
            addon = Addon.objects.get_or_create(pk = pk)[0]
            response.append({
                "pk" : addon.pk,
                "link" : addon.link,
                "title" : addon.title,
                "description" : addon.description,
                "image" : "http://127.0.0.1:8000/api" + addon.image.file.url if addon.image != None else "http://127.0.0.1:8000/api/media/wallhaven-5wmgo9_026kwyS.jpg",
                "imagePk" : addon.image.pk if addon.image != None else -1,
                "onlyImage" : addon.onlyImage,
                "active" : addon.active,
                "draft" : addon.draft
            })
    if data['method'] == "PUT":
        addon = Addon.objects.get_or_create(pk = data['pk'])[0]
        addon.link = data['link']
        addon.title = data['title']
        addon.description = data['description']
        addon.image = data['imagePk']
        addon.onlyImage = data['onlyImage']
        addon.active = data['active']
        addon.draft = data['draft']
        addon.save()
    return JsonResponse(response, safe=False)