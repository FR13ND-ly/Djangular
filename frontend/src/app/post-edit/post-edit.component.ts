import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { HeroService } from 'src/app/hero.service'
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service'  

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  id:any
  post : any
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
  surveysQuestion : string
  selectedIndex = -1

  constructor(private service: HeroService, private router: Router, private userService: UserService, private route: ActivatedRoute, @Inject(DOCUMENT) document) { }

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

  ngOnInit(): void {
    this.userService.getUser().subscribe(res => {
      if (!res['is_staff']){
        this.router.navigate(['/'])
      }
    })
    this.route.params.subscribe(params => {
      this.id = params['id']
    });
    this.service.getPost(this.id).subscribe(data =>{
      this.post = data
      console.log(data)
      this.post.tags.forEach(element => {
        M.Chips.getInstance(document.getElementById("etichete")).addChip({tag : element})
      });
    });
    
  }

  uploadFile(event){
    let file = event.target.files[0]
    let formData = new FormData()
    formData.append('file', file, file.name)
    this.service.uploadFile(formData).subscribe(res => {})
  }

  openImageMenu(){
    this.imagePage = 1
    this.service.imageList(this.imagePage).subscribe(res => {
      this.imgList = res['imgList']
      this.noMoreImages = res['lastImages']
    })
    M.Modal.getInstance(document.getElementById('modal1')).open();
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
    this.post.imagePk = this.imgList[index].pk
  }

  setCover(){
    this.post.cover = this.imageSrc
    M.Modal.getInstance(document.getElementById('modal1')).close();
  }

  saveChanges(){
    let data = {
      url : this.id,
      title : this.post.title,
      text : this.post.text,
      draft : this.post.draft,
      imgPk : this.post.imagePk,
      blockComments : this.post.blockComments,
      hideLikes : this.post.hideLikes,
      tags : M.Chips.getInstance(document.getElementById("etichete")).chipsData,
      surveysQuestion : this.post.surveysQuestion,
      variants : this.post.questionList.flat(),
      typeOfVote : this.post.typeOfVote,
      activeSurvey : this.post.surveyActive
    }
    this.service.editPost(data).subscribe(data => {
      this.router.navigate(['/articol/'+ data['url'] + '/'])  
    })
  }
}
