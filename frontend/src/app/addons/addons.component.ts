import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/hero.service'

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css']
})
export class AddonsComponent implements OnInit {

  constructor(private service: HeroService) { }
  addons : any
  ngOnInit(): void {
    this.service.addons({method: "GET"}).subscribe(data=>{
      console.log(data)
      this.addons = data
    })
  }

}
