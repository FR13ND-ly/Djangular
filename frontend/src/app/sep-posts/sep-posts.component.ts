import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/hero.service'

@Component({
  selector: 'app-sep-posts',
  templateUrl: './sep-posts.component.html',
  styleUrls: ['./sep-posts.component.css']
})
export class SepPostsComponent implements OnInit {

  constructor(private service: HeroService) { }

  lists : any

  ngOnInit(): void {
    this.service.sepPosts().subscribe(data => {
      this.lists = data
      console.log(data)
    })
  }

  clickTag(tag){
    let instance = M.Sidenav.getInstance(document.getElementById("slide-out1"))
    instance.open()
    document.getElementById('search').value = '#' + tag
    document.getElementById('secondSearch').click()
  }

}
