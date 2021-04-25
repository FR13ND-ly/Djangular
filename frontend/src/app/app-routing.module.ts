import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './post-list/post-list.component'
import { PostNewComponent } from './post-new/post-new.component'
import { PostDetailsComponent } from './post-details/post-details.component'
import { PostEditComponent } from './post-edit/post-edit.component';
import { SideSearchComponent } from './side-search/side-search.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { StatisticComponent } from './statistic/statistic.component';
//import { AddonsComponent } from './addons/addons.component';

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'articol/nou', component: PostNewComponent},
  {path: 'articol/:id', component: PostDetailsComponent},
  {path: 'pagina/:id', component: PostListComponent},
  {path: 'articol/:id/edit', component: PostEditComponent},
  {path: 'tag/:tag', component: SideSearchComponent},
  {path: 'liste', component: PlaylistsComponent},
  {path: 'lista/:url', component: PlaylistComponent},
  {path: 'pagina/:nr', component: PostListComponent},
  {path: 'statistic', component: StatisticComponent},
//  {path: 'addons', component: AddonsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
