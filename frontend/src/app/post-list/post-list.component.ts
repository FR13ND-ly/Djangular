import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/hero.service'
import { ActivatedRoute} from '@angular/router';
import { UserService } from 'src/app/user.service'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  pageId : number
  constructor(private service: HeroService, private route: ActivatedRoute, private userService: UserService) { }
  
  postList: any = []
  paginator: any
  bigImage = 0
  showArrows = false
  topPostList: any
  interval : any
  userToken : any

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pageId = params['id']
    });
    if (this.pageId == null){
      this.pageId = 1
    }
    let p = new Promise((resolve, reject) => {
      this.userService.getUser().subscribe(res => {
        this.userToken =  res['token']
        resolve(this.userToken)
      })
    })
    p.then((data)=> {
      this.getPostList(this.pageId)
    })
    this.service.topPosts().subscribe(data=>{
      this.topPostList = data['posts']
    })
    
    this.setTimer()
  }

  clickTag(tag){
    let instance = M.Sidenav.getInstance(document.getElementById("slide-out1"))
    instance.open()
    document.getElementById('search').value = '#' + tag
    document.getElementById('secondSearch').click()
  }

  setTimer(){
    window.clearInterval(this.interval);
    this.interval = setInterval(()=>{
      this.bigImage = this.bigImage == this.postList.length - 1 ? 0 : this.bigImage = this.bigImage + 1
    }, 15000)
  }

  getPostList(lk){
    this.bigImage = 0
    this.pageId = lk
    let val = {
      lk : lk,
      token: this.userToken
    }
    this.service.getPostList(val).subscribe(data =>{
      this.postList = data['posts'];
      this.paginator = data['number_of_pages']
    });
  }

}
