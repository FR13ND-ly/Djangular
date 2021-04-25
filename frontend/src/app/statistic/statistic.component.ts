import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service'
import { HeroService } from 'src/app/hero.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  constructor(private service: HeroService, private router: Router, private userService: UserService) { }


  statistic: any
  ngOnInit(): void {
    this.userService.getUser().subscribe(res => {
      if (!res['is_staff']){
        this.router.navigate(['/'])
      }
    })
    this.service.statistic().subscribe(data=>{
      this.statistic = data
    })
  }

  asIsOrder(a, b) {
    return 1;
  }

}
