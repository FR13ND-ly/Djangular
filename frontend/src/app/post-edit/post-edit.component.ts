import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { HeroService } from 'src/app/hero.service'
import { ActivatedRoute, Router } from '@angular/router';

import * as Editor from 'src/assets/js/editor.js'

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  id:any
  fileToUpload: File
  editorMode = "code"
  post : any

  constructor(private service: HeroService, private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) document) { }

  editor = Editor

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']
    });
    this.service.getPost(this.id).subscribe(data =>{
      this.post = data
      window.frames[0].document.getElementsByTagName('body')[0].innerHTML = this.post.text
    });
    this.editor.init()
  }

  uploadFile(event){
    let file = event.target.files[0]
    let formData = new FormData()
    formData.append('file', file, file.name)
    this.service.uploadFile(formData).subscribe(res => {})
  }

  saveChanges(){
    let data = {
      pk : this.id,
      title : this.post.title,
      text : window.frames[0].document.getElementsByTagName('body')[0].innerHTML
    }
    this.service.editPost(data)
    this.router.navigate(['/articol/'+ this.id + '/'])
  }

  changeView(){
    this.editorMode = this.editorMode == "code" ? "title" : "code"
    this.editor.changeView(this.editorMode)
  }
}
