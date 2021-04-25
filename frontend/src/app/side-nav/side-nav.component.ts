import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/hero.service'
import { UserService } from 'src/app/user.service'
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  user = {
    user_id: 0,
    username: '',
    is_authenticated: false,
    is_staff: false
  }
  registration = false
  
  constructor(private service: HeroService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(res => {
      this.user = {
        user_id: res["user_id"],
        username: res["username"],
        is_authenticated: res["is_authenticated"],
        is_staff: res['is_staff']
      }
    })
  }

  auth(login, password){
    var val = {
      username : login,
      password : password
    }
    this.userService.login(val)
  }

  logout(){
    this.userService.logout()
    location.reload();
  }

  register(login, password, rpassword){
    if (password == rpassword){
      this.userService.register({username: login, password: password})
    }
  }
}
