import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroService } from './hero.service';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PostListComponent } from './post-list/post-list.component';
import { PostNewComponent } from './post-new/post-new.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { UserService } from './user.service';
import { PostEditComponent } from './post-edit/post-edit.component'
import { NoSanitizePipe } from 'src/app/noSanitaze.pipe';
import { FormatPreviewPipe } from 'src/app/formatPreview.pipe';
import { CommentsService } from './comments.service';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideSearchComponent } from './side-search/side-search.component';
import { SepPostsComponent } from './sep-posts/sep-posts.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostNewComponent,
    PostDetailsComponent,
    SideNavComponent,
    PostEditComponent,
    NoSanitizePipe,
    FormatPreviewPipe,
    SideSearchComponent,
    SepPostsComponent,
    PlaylistsComponent,
    PlaylistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatMenuModule,
    BrowserAnimationsModule,
    EditorModule
  ],
  providers: [HeroService, UserService, NoSanitizePipe, FormatPreviewPipe, CommentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
