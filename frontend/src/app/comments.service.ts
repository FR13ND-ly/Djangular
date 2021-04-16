import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  readonly APIUrl ="http://127.0.0.1:8000/api/"

  constructor(private http: HttpClient) { }

  getComments(pk){
    return this.http.get(this.APIUrl + 'comments/' + pk + '/')
  }

  addComment(val){
    return this.http.post(this.APIUrl + 'comment/', val)
  }

  deleteComment(pk){
    return this.http.delete(this.APIUrl + 'deleteComment/' + pk + '/')
  }
}
