import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SeasonComponent } from './season/season.component';
import { SeasonListComponent } from './season/list/season-list.component';

const routes: Routes = [
    { path: '', redirectTo: 'seasons', pathMatch: 'full' },
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
