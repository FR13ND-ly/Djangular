import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { HeroService } from 'src/app/hero.service'
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service'  
//import * as Editor from 'src/assets/js/editor.js'

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})

export class PostNewComponent implements OnInit {

  pk: any

  post = {
    text : "",
    title : ""
  }
  imgList: any
  uploading =  false
  imageSrc: string
  imagePk : number
  draft = false
  blockComments = false
  hideLikes = false
  coverImageSrc = "http://127.0.0.1:8000/api/media/white_default_cover.png"
  imagePage = 1
  noMoreImages = false
  activeSurvey = false
  questionList = []
  typeOfSurvey = true
  surveysQuestion = ""

  constructor(private userService: UserService, private service: HeroService, private router: Router, @Inject(DOCUMENT) document) {}

  selectedIndex = -1

  settings = {
    height: 500,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking',
      'table emoticons template paste help'
    ],
    toolbar: `styleselect | bold italic | alignleft aligncenter alignright alignjustify | 
      bullist numlist outdent indent | link image  
      forecolor backcolor | undo redo`,
    menubar: 'favs file edit view insert format tools table',
    images_upload_url: 'http://127.0.0.1:8000/api/fileApi/'
  }

  ngOnInit() {
    this.userService.getUser().subscribe(res => {
      if (!res['is_staff']){
        this.router.navigate(['/'])
      }
    })
  }

  savePost(){
    let val = {
      title : this.post.title,
      text : window.frames[0].document.getElementsByTagName('body')[0].innerHTML,
      pk : this.imagePk,
      draft : this.draft,
      blockComments : this.blockComments,
      hideLikes : this.hideLikes,
      tags : M.Chips.getInstance(document.getElementById("etichete")).chipsData,
      surveysQuestion  : this.surveysQuestion,
      variants : [].concat.apply([], this.questionList),
      typeOfSurvey : this.typeOfSurvey,
      activeSurvey : this.activeSurvey
    }
    this.service.addPost(val).subscribe(res=>{
      this.router.navigate(['/articol/'+ res + '/']);
    })
  }
  
  openImageMenu(){
    this.imagePage = 1
    this.service.imageList(this.imagePage).subscribe(res => {
      this.imgList = res['imgList']
      this.noMoreImages = res['lastImages']
    })
    M.Modal.getInstance(document.getElementById('modal1')).open();
  }

  uploadFile(event){
    this.uploading = true
    let file = event.target.files[0]
    let formData = new FormData()
    formData.append('file', file, file.name)
    this.service.uploadFile(formData).subscribe(res => {
      this.uploading = false
      this.imgList.unshift(res['imgList'])
      if( !this.noMoreImages ){
        this.imgList.pop()
      }
    })
  }

  moreImg(){
    this.imagePage++;
    this.service.imageList(this.imagePage).subscribe(res => {
      res['imgList'].forEach(element => {
        this.imgList.push(element)
      });
      this.noMoreImages = res['lastImages']
    })
  }

  selectImage(index){
    for (let i = 0; i < document.querySelectorAll('.listimage').length; i++){
      document.querySelectorAll('.listimage')[i].className = "col s3 listimage"
    }
    document.getElementById('image' + index).className = "col s3 listimage selected"
    this.selectedIndex = index
    this.imageSrc = this.imgList[index].url
    this.imagePk = this.imgList[index].pk
  }

  setCover(){
    this.coverImageSrc = this.imageSrc
    M.Modal.getInstance(document.getElementById('modal1')).close();
  }
}
