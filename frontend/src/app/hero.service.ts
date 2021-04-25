import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  readonly APIUrl ="http://127.0.0.1:8000/api/"
  readonly PhotoUrl = "http://127.0.0.1:8000/media"
  constructor(private http: HttpClient) { }

  getPostList(val){
    return this.http.post(this.APIUrl + 'posts/', val)
  }

  getPost(data){
    return this.http.get(this.APIUrl + 'post/' + data + '/')
  }

  addPost(data){
    data = Object.assign(data, {token: localStorage.getItem('token')})
    return this.http.post(this.APIUrl + 'post/new/', data)
  }

  deletePost(data){
    return this.http.delete(this.APIUrl + 'post/' + data + '/')
  }

  editPost(data){
    return this.http.put(this.APIUrl + 'post/', data)
  }

  sepPosts(){
    return this.http.get(this.APIUrl + "sep/")
  }

  addView(val){
    return this.http.put(this.APIUrl + "viewAPI/", val).subscribe()
  }

  deleteView(val){
    return this.http.delete(this.APIUrl + "viewAPI/", val)
  }

  history(val){
    return this.http.post(this.APIUrl + "viewAPI/", val)
  }

  topPosts(){
    return this.http.get(this.APIUrl + 'topPosts/')
  }

  likes(data){
    return this.http.post(this.APIUrl + 'like/', data)
  }

  like(data){
    return this.http.put(this.APIUrl + 'like/', data)
  }

  getSurvey(data){
    return this.http.post(this.APIUrl + 'surveyApi/', data)
  }

  vote(data){
    return this.http.put(this.APIUrl + 'surveyApi/', data)
  }

  search(data){
    return this.http.post(this.APIUrl + 'search/', data)
  }

  imageList(lk){
    return this.http.get(this.APIUrl + 'fileApi/' + lk + '/')
  }

  uploadFile(data){
    return this.http.post(this.APIUrl + 'fileApi/', data)
  }
  addSubComment(data){
    return this.http.post(this.APIUrl + "subComments/", data)
  }
  deleteSubComment(data){
    return this.http.put(this.APIUrl + "subComments/", data)
  }
  lists(data){
    return this.http.post(this.APIUrl + "list/", data)
  }
  addRemoveItemtoList(data){
    return this.http.put(this.APIUrl + "list/", data)
  }
  statistic(){
    return this.http.get(this.APIUrl + "statistic/")
  }

  addons(data){
    return this.http.post(this.APIUrl + "addons/", data)
  }
}
