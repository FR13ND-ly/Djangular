import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/hero.service'
import { UserService } from 'src/app/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  constructor(private service: HeroService, private userService: UserService, private router: Router) { }

  Lists: any
  user = {
    user_id: 0,
    username: '',
    is_authenticated: false,
    is_staff: false,
    token : ""
  }

  ngOnInit(): void {
    let promise = new Promise((resolve, reject)=> {
      this.userService.getUser().subscribe(res => {
        if (!res['is_staff']){
          this.router.navigate(['/'])
        }
        this.user = {
          user_id: res["user_id"],
          username: res["username"],
          is_authenticated: res["is_authenticated"],
          is_staff: res['is_staff'],
          token: res['token']
        }
        resolve(this.user.token)
      })
    })
    .then(data => {
      this.lists()
    })
  }

  lists(){
    this.service.lists({method : "GET", token: this.user.token}).subscribe(data => {
      this.Lists = data
    })
  }
}
