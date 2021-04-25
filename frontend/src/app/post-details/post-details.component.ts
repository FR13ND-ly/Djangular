import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common'
import { HeroService } from 'src/app/hero.service'
import { CommentsService } from 'src/app/comments.service'
import { UserService } from 'src/app/user.service'

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  id: number
  post: any
  commentList: any
  writeComment = false
  username = ""
  text = ""
  likeCount = 0
  liked : 'favorite_outline'
  user = {
    user_id: 0,
    username: '',
    is_authenticated: false,
    is_staff: false,
    token : "",
    darktheme : false
  }
  survey: any
  subComment = {
    author: "",
    text: ""
  }
  selectedVariant = ""
  Lists: any
  addList = false
  newList = {
    name : "",
    access : false
  }

  constructor(private router : Router, private route: ActivatedRoute, private service: HeroService, private commentService : CommentsService, private userService: UserService, @Inject(DOCUMENT) document) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']
    });
   
    let promise = new Promise((resolve, reject)=> {
      this.userService.getUser().subscribe(res => {
        this.user = {
          user_id: res["user_id"],
          username: res["username"],
          is_authenticated: res["is_authenticated"],
          is_staff: res['is_staff'],
          token: res['token'],
          darktheme: res['darktheme']
        }
        resolve(this.user.token)
      })
    }) 
    promise.then((value)=> {
      let val = {
        url : this.id,
        token: value
      }
      this.service.likes(val).subscribe(res => {
        this.likeCount = res['like_count']
        this.liked = res['liked']
      })
    })
    .then((value)=>{
      this.service.getPost(this.id).subscribe(data =>{
        this.post = data
        this.getSurvey()
      });
    })
    .then((value) => {
      this.service.addView({url: this.id, token: this.user.token, method : "POST"})
    })
    this.getCommentList()
    
  }
  lists(){
    M.Modal.getInstance(document.getElementById('modal1')).open();
    this.addList = false
    this.service.lists({method : "GET", token: this.user.token, pk : this.id}).subscribe(data => {
      this.Lists = data
    })
    this.newList = {
      name : "",
      access : false
    }
  }

  addNewList(){
    this.service.lists({method : "POST", token: this.user.token, name: this.newList.name, access : this.newList.access}).subscribe()
    this.lists()
  }

  addRemoveItemtoList(list){
    this.service.addRemoveItemtoList({ token: this.user.token, postPk : this.id, listPk : list.pk, method : list.added ? "DELETE" : "POST" }).subscribe()
  }

  getSurvey(){
    if (this.post.surveyActive){
      this.service.getSurvey({url : this.id, token: this.user.token}).subscribe(data => {
        this.survey = data
        console.log(data)
      })
    }
  }

  getCommentList(){
    this.commentService.getComments(this.id).subscribe(data => {
      this.commentList = data
    })
  }

  vote(){
    if (this.user.is_authenticated){
      this.service.vote({pk : this.selectedVariant, token : this.user.token, url : this.id}).subscribe(data => {
        this.survey = data
      })
    }
    else {
      alert('loghează-te măi')
    }
  }

  clickVariant(pk){
    if (!this.survey.user_voted && this.user.is_authenticated){
      if (this.post.typeOfVote){
        this.selectedVariant = pk
        let variants = document.querySelectorAll(".variant")
        variants.forEach(element => {
          element.className = "variant collection-item light-blue-text text-darken-2"
        });
        document.getElementById(pk).className = "variant collection-item white-text blue"
      }
      else {
        if (document.getElementById(pk).className == "variant collection-item light-blue-text text-darken-2"){
          document.getElementById(pk).className = "variant collection-item white-text blue"
          this.selectedVariant += " " + pk
        }
        else {
          document.getElementById(pk).className = "variant collection-item light-blue-text text-darken-2"
          this.selectedVariant = this.selectedVariant.replace(" " + pk, "")
        }
      }
    }
  }

  deletePost(){
    this.service.deletePost(this.id).subscribe()
  }

  addComment(){
    this.username = this.user.is_authenticated ? this.user.username : this.username
    let val = {
      url : this.id,
      author : this.username,
      text : this.text,
      by_authenticated : this.user.is_authenticated,
      by_administration : this.user.is_staff
    }
    this.commentService.addComment(val).subscribe(res => {
      this.commentList.unshift(res)
    })
    this.writeComment = false
  }

  answer(){
    this.commentList.forEach(element => {
      element.answer = false
    });
    this.writeComment = false
    this.subComment = {
      author: "",
      text: ""
    }
  }

  addSubComment(pk){
    this.username = this.user.is_authenticated ? this.user.username : this.username
    let val = {
      commentPk : pk, 
      author : this.subComment.author,
      text : this.subComment.text,
      auth : this.user.is_authenticated,
      admin : this.user.is_staff
    }
    val.author = this.user.is_authenticated ? this.user.username : this.subComment.author 
    this.service.addSubComment(val).subscribe(res => {})
    this.commentList.forEach(element => {
      element.answer = false
      if (element.pk == pk){
        element.subComments.unshift(val)
      }
    });
  }

  deleteSubComment(pk){
    this.service.deleteSubComment({pk}).subscribe(res => {})
    this.commentList.forEach(comment => {
        comment.subComments = comment.subComments.filter(subComment =>{
          return subComment.pk != pk
        })
    });
  }

  openCloseComments(){
    this.writeComment = !this.writeComment
    document.getElementById("commentBtn").className = "waves-effect waves-light btn blue white-text"
    setTimeout(()=>{
      document.getElementById("commentBtn").className = "waves-effect waves-light btn white blue-text"
    }, 350)
  }

  removeComment(pk){
    this.commentService.deleteComment(pk).subscribe()
    this.commentList = this.commentList.filter((comment) => { return comment.pk !== pk; });
  }

  clickTag(tag){
    let instance = M.Sidenav.getInstance(document.getElementById("slide-out1"))
    instance.open()
    document.getElementById('search').value = '#' + tag
    document.getElementById('secondSearch').click()
  }

  like(){
    if (this.user.is_authenticated){
      document.getElementById("likeBtn").className = "waves-effect waves-light btn red white-text"
      setTimeout(()=>{
        document.getElementById("likeBtn").className = "waves-effect waves-light btn white red-text"
      }, 350)
      let val = {
        url : this.id,
        token : this.user.token
      }
      this.service.like(val).subscribe(res => {
        this.likeCount = res['like_count']
        this.liked = res['liked']
      })
    }
  }
}
