import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeroService } from 'src/app/hero.service'
import { UserService } from 'src/app/user.service'  

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: HeroService, private userService: UserService, private router: Router) { }
  pk : string
  list : any
  user = {
    user_id: 0,
    username: '',
    is_authenticated: false,
    is_staff: false,
    token : ""
  }
  direction = ""
  added = 0
  loading = false
  last = false
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pk = params['url']
    });
    let promise = new Promise((resolve, reject)=> {
      this.userService.getUser().subscribe(res => {
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

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight - 250;
    if (pos >= max && !this.loading && !this.last)   {
      this.loading = true
      this.service.lists({lk : this.added, method : "GETALL", token: this.user.token, listPk: this.pk, direction: this.direction}).subscribe(data => {
        if (data["status"] == "error"){
          this.router.navigate(['/']);
        } 
        this.list.posts = this.list.posts.concat(data['posts'])
        this.loading = false
        this.added++
        this.last = data['last']
      })
    } 
  }

  lists(){
    this.service.lists({lk : this.added, method : "GETALL", token: this.user.token, listPk: this.pk, direction: this.direction}).subscribe(data => {
      if (data["status"] == "error"){
        this.router.navigate(['/']);
      } 
      this.list = data
      this.last = data['last']
      this.added++
    })
  }

  copyUrl(){
    navigator.clipboard.writeText(window.location.href)
  }

  shuffle(){
    this.direction = this.direction === "-" ? "" : "-"
    this.added = 0
    this.lists()
  }

  changeAccess(){
    this.service.addRemoveItemtoList({token: this.user.token, method: "PUT", listPk: this.pk, access: this.list.access, target : "access"}).subscribe()
  }

  changeName(newName){
    this.service.addRemoveItemtoList({token: this.user.token, method: "PUT", listPk: this.pk, name: newName.trim(), target : "name"}).subscribe()
  }
  
  deleteList(){
    this.service.lists({token: this.user.token, method: "DELETE", listPk: this.pk}).subscribe()
    this.router.navigate(['/liste/']);
  }
}
