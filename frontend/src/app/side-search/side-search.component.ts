import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { HeroService } from 'src/app/hero.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-search',
  templateUrl: './side-search.component.html',
  styleUrls: ['./side-search.component.css']
})
export class SideSearchComponent implements OnInit {

  constructor(private service : HeroService, private router : Router, private route : ActivatedRoute, @Inject(DOCUMENT) document) { }
  text : string
  resultList = []
  ngOnInit(): void {
  }

  close(){
    let instance = M.Sidenav.getInstance(document.getElementById("slide-out1"))
    instance.close()
    this.resultList = []
    this.text = ""
  }

  clickPost(pk){
    let p = new Promise((resolve, reject) => {
      this.router.navigate([''])
      resolve('a')
    })
    p.then((a) => {
      this.router.navigate(['/articol/' + pk + '/'])
    })
    this.close()
  }

  search(){
    this.text = this.text.trim()
    this.tag = this.text[0] == "#" ? "blue-text" : ""
    if (this.text != "" && this.text != "#"){
      this.service.search({text : this.text}).subscribe(res=>{
        this.resultList = res['result']
      })
    }
    else {
      this.resultList = []
    }
  }
  secondSearch(){
    this.text = document.getElementById('search').value
    this.search()
  }

}
