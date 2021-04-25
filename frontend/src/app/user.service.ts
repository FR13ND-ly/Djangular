import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly APIUrl ="http://127.0.0.1:8000/api/"


  constructor(private http: HttpClient) {
  }

  login(val){
    console.log(val)
    return this.http.post(this.APIUrl + 'auth/', val).subscribe(res => {
      let token = res['token']
      localStorage.setItem('token', token)
      location.reload()
    })
  }

  theme(val){
    this.http.post(this.APIUrl + 'themeAPI/', val)
  }

  getUser(){
    let token = localStorage.getItem('token')
    return this.http.post(this.APIUrl + 'getUser/', {token})
  }

  logout(){
    localStorage.clear()
  }

  register(val){
    return this.http.post(this.APIUrl + 'register/', val).subscribe(res => {
      let token = res['token']
      localStorage.setItem('token', token)
      location.reload()
    })
  }
}
