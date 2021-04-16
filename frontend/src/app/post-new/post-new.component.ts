import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { HeroService } from 'src/app/hero.service'
import { Router } from '@angular/router';
import * as Editor from 'src/assets/js/editor.js'

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})

export class PostNewComponent implements OnInit {

  pk: any
  title: any
  text = ""

  post = {
    text : "",
    title : ""
  }
  code: true
  editorMode : string
  imgList: any
  uploading =  false
  imageSrc: string
  customSize = false
  height: number
  width: number
  align = 'left'
  insertOrCover = true
  imagePk : number
  draft = false
  blockComments = false
  hideLikes = false
  blockLikes = false
  coverImageSrc = "http://127.0.0.1:8000/api/media/white_default_cover.png"
  imagePage = 1
  noMoreImages = false
  activeSurvey = false
  questionList = []
  typeOfSurvey = true
  surveysQuestion : string

  constructor(private service: HeroService, private router: Router, @Inject(DOCUMENT) document) {}

  editor = Editor

  selectedIndex = -1
  abs = ""

  settings = {
    height: 500,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking',
      'table emoticons template paste help'
    ],
    toolbar: 'styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image  ' +
      'forecolor backcolor | undo redo ',
    menubar: 'favs file edit view insert format tools table',
    images_upload_url: 'http://127.0.0.1:8000/api/fileApi/'
  }

  ngOnInit() {
    this.editorMode = "code"
    this.editor.init()
  }

  savePost(){
    let variants = []
    let variantsInput = document.querySelectorAll(".variant")
    variantsInput.forEach(el =>{
      if (el.value.trim()){
        variants.push(el.value)
      }
    })
    let val = {
      title : this.post.title,
      text : window.frames[0].document.getElementsByTagName('body')[0].innerHTML,
      pk : this.imagePk,
      draft : this.draft,
      blockComments : this.blockComments,
      hideLikes : this.hideLikes,
      blockLikes : this.blockLikes,
      tags : M.Chips.getInstance(document.getElementById("etichete")).chipsData,
      surveysQuestion  : this.surveysQuestion,
      variants : variants,
      typeOfSurvey : this.typeOfSurvey,
      activeSurvey : this.activeSurvey
    }
    this.service.addPost(val).subscribe(res=>{
      this.router.navigate(['/articol/'+ res + '/']);
    }) 
  }

  changeView(){
    this.editorMode = this.editorMode == "code" ? "title" : "code"
    this.editor.changeView(this.editorMode)
  }
  
  openImageMenu(){
    this.imagePage = 1
    this.service.imageList(this.imagePage).subscribe(res => {
      this.imgList = res['imgList']
      this.noMoreImages = res['lastImages']
    })
    M.Modal.getInstance(document.getElementById('modal1')).open();
    this.insertOrCover = true;
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

  nextUploadStep(){
    M.Modal.getInstance(document.getElementById('modal1')).close();
    M.Modal.getInstance(document.getElementById('modal2')).open();
  }

  setSize(size){
    this.customSize = size == 'custom' ? true : false
  }

  addCoverImage(){
    this.openImageMenu()
    this.insertOrCover = false;
  }

  setCover(){
    this.coverImageSrc = this.imageSrc
    M.Modal.getInstance(document.getElementById('modal1')).close();
  }
}
