import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlayerListComponent } from './player/list/player-list.component';
import { SeasonComponent } from './season/season.component';
import { SeasonListComponent } from './season/list/season-list.component';

const routes: Routes = [
    { path: '', component: IndexComponent, pathMatch: 'full' },
    { path: 'players', component: PlayerListComponent },
    { path: 'seasons', component: SeasonListComponent },
    { path: 'seasons/:id', component: SeasonComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
