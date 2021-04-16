import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/hero.service'
import { UserService } from 'src/app/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private service: HeroService, private userService: UserService) {}

  ngOnInit(): void {
  }

}
